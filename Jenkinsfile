/*
 Allocate any available build node for pipeline
*/
node() {

  currentBuild.result = "SUCCESS"

  try {
    /*
     Begin parallel block to setup the build tools (Maven and Docker) and check out the source code 
    */
    parallel MVNSetup: {
        /*
         Setting up the path and environment variables for maven and obtaining the local ip address for the docker interface 
         */
        env.DOCKER_HOST_INTERNAL_IP = sh(
          script: 'ip route show dev docker0',
          returnStdout: true
        ).trim()
        def matcher = null
        matcher = (env.DOCKER_HOST_INTERNAL_IP = ~/.*src ([^ ]+).*/)
        env.DOCKER_HOST_INTERNAL_IP = matcher[0][1]
        matcher = null

        echo "${DOCKER_HOST_INTERNAL_IP}"
        //Create maven cache directory if it doesn't exist
        sh "if [ ! -d .m2 ] ; then mkdir .m2; fi"

        //Set the maven variables for this project
        env.MAVEN_OPTS = "-Dmaven.repo.local=${env.WORKSPACE}/.m2"
        env.MAVEN_HOME = "/opt/apache-maven-3.5.4"
        env.PATH = "${MAVEN_HOME}/bin:" + env.PATH
      },
      Checkout: {
        /*
         Checking out the code and saving the pertiant variables about commit hash and revision
         */
        checkout scm
        def imageId
        env.BRANCH_NAME = "securecidemo"
        sh "git rev-parse HEAD > commit-id"
        env.GIT_COMMIT = readFile('commit-id')
        echo "The commit: ${env.GIT_COMMIT}"
        echo "Branch: ${BRANCH_NAME}"

        env.RELEASE = "1.0"

        env.BRANCH_PREFIX = "none"
        env.BRANCH_ID = env.BRANCH_NAME

        //We should no longer need to set the gradle path
        echo "My branch is: ${env.BRANCH_ID}"

        // Nexus 3 version weirdness
        env.VERSION = "${env.BUILD_ID}.${env.BRANCH_ID}"
        env.SONAR_VERSION = "${env.BUILD_ID}"

        //Create Unique name
        sh 'uuid | cut -c 1-8 > HOSTNAME.${VERSION}.properties'
        sh 'rm -f commit-id'

      }
    /*
     Build and package the code without unit tests using a docker container with the maven tool set
     */
    docker.withRegistry('http://secureci:8182', 'docker') {
      withDockerContainer(args: '--net=\"host\"', image: 'secureci:8182/centos:latest') {
        withCredentials([
          [$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', passwordVariable: 'nexuspass', usernameVariable: 'nexususer']
        ]) {
          stage("build") {
            sh "${MAVEN_HOME}/bin/mvn clean package -DskipTests"
          }
        }
      }
      /*
       Parallel block that runs unit and integration tests at the same time. This is an overall time savings allowing 
       integration tests
       */
      parallel UnitTests: {
          stage("Unit Tests") {
            /*
             Run unit tests in the maven container against already built code. 
             */
            withDockerContainer(args: '--net=\"host\"', image: 'secureci:8182/centos:latest') {
              withCredentials([
                [$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', passwordVariable: 'nexuspass', usernameVariable: 'nexususer']
              ]) {
                sh "${MAVEN_HOME}/bin/mvn -Dmaven.test.failure.ignore=false test"
                junit allowEmptyResults: true, testResults: 'target/surefire-reports/*.xml'
              }
            }
          }
        },
        IntegrationTests: {
          /*
                 Set up a mysql and tomcat container and run the API level database tests.
                 This simulates a scaled down version of the application that has all of
                 its architectual compents expressed as docker containers. 
                 */
          def tomcatContainer
          def mysqlContainer
          def testContainer

          try {
            mysqlContainer = docker.image("secureci:8182/mysql:latest").run('-p 3306 --name=mysql_${BUILD_NUMBER}')
            env.MYSQLID = mysqlContainer.id

            waitUntil {
              sh "docker exec -t ${MYSQLID} netstat -apn | grep 3306 | grep LISTEN | wc -l | tr -d '\n' > wait_results"
              wait_results = readFile 'wait_results'
              echo "Wait Results(${wait_results})"
              if ("${wait_results}" == "1") {
                echo "Mysql is listening on port 3306"
                sh "rm -f wait_results"
                return true
              } else {
                echo "Mysql is not listening on port 3306 yet"
                return false
              }
            } // end of waitUntil
            env.MYSQLPORT = mysqlContainer.port(3306)

            //Setup Tomcat Mount
            sh "rm -f target/env.properties"
            sh "./dburl_change.sh target/env.properties ${MYSQLPORT} ${DOCKER_HOST_INTERNAL_IP}"

            tomcatContainer = docker.image("secureci:8182/tomcat:latest").run('-p 8080 -v ${WORKSPACE}/target:/home/tomcat/tmp --link=mysql_${BUILD_NUMBER}:mysql --name=tomcat_${BUILD_NUMBER}')
            env.TOMCATID = tomcatContainer.id

            // Wait for tomcat to be up
            waitUntil {
              sh "docker exec -t ${TOMCATID} netstat -apn | grep 8080 | grep LISTEN | wc -l | tr -d '\n' > wait_results"
              wait_results = readFile 'wait_results'
              echo "Wait Results(${wait_results})"
              if ("${wait_results}" == "1") {
                echo "Tomcat is listening on port 8080"
                sh "rm -f wait_results"
                return true
              } else {
                echo "Tomcat is not listening on port 8080 yet"
                return false
              }
            } // end of waitUntil

            env.TOMCATPORT = tomcatContainer.port(8080)
            env.MYSQLPORT = mysqlContainer.port(3306)

            matcher = (env.TOMCATPORT = ~/.*:([^ ]+).*/)
            env.TOMCATPORT = matcher[0][1]
            matcher = null

            sh "echo Tomcat running on port: ${TOMCATPORT}"
            sh "echo Mysql running on port: ${MYSQLPORT}"

            echo 'Two Minutes to test'
            /* 
                     In a special test container run the database API tests and the chrome broser UI tests. 
                     */
            withCredentials([
              [$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', passwordVariable: 'nexuspass', usernameVariable: 'nexususer']
            ]) {
              try {
                wrap([$class: 'Xvfb']) {
                  sleep 20;
                  stage("Integration Tests") {
                    sh "mvn -Dwebdriver.chrome.driver=/usr/java/secureci-testing-framework-1.3.0/chromedriver -Dwebdriver.gecko.driver=/usr/local/bin/geckodriver -Dmaven.test.failure.ignore=false verify -Dtomcat.port=${TOMCATPORT} -Dtomcat.ip=${DOCKER_HOST_INTERNAL_IP}"
                  }
                }
              } catch (err) {
                currentBuild.result = "FAILURE"
                throw err
              }
            }
            /*
             The Int and unit tests produce coverage reslults. We run the static analysis at the end so that
             the coverage results can be uploaded at the same time the static analysis reslults are. 
             */
             /*
            stage("StaticAnalysis") {
              stage("Upload results") {
                sh "docker exec -t ${TOMCATID} /opt/tomcat9/bin/catalina.sh stop"
                withDockerContainer(args: '--net=\"host\"', image: 'secureci:8182/centos:latest') {
                  withCredentials([
                    [$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', passwordVariable: 'nexuspass', usernameVariable: 'nexususer']
                  ]) {
                    //Gather the it tests Gather the int coverage results
                    sh "${MAVEN_HOME}/bin/mvn sonar:sonar"
                  }
                }
              }
            }
            */
          } finally {
            stage("Stopping Containers") {
              if (currentBuild.result == "FAILURE") {
                stage("state capture") {
                  sh 'docker commit ${MYSQLID} secureci:8182/mysql:mysql_${BUILD_ID}'
                  sh 'docker commit ${TOMCATID} secureci:8182/tomcat:tomcat_${BUILD_ID}'
                  sh 'docker push secureci:8182/mysql:mysql_${BUILD_ID}'
                  sh 'docker push secureci:8182/tomcat:tomcat_${BUILD_ID}'
                }
              }
              tomcatContainer.stop()
              mysqlContainer.stop()
            }
          }
        }
      /*
       This is a mock of where different broswer tests should run. In the real world these would be 
       different containers for each test suite running in parallel possibly running on different nodes. 
       
       */
      parallel TestLinuxChrome: {
          sleep 30;
        },
        TestLinuxFirefox: {
          sleep 30;
        },
        TestWindowsChrome: {
          sleep 30;
        },
        TestWindowsEdge: {
          sleep 30;
        },
        TestMacOSSafari: {
          sleep 30;
        },
        TestMacOSChrome: {
          sleep 30;
        },
        TestMacOSFirefox: {
          sleep 30;
        }
    }
  } catch (err) {
    stage("Error") {
      currentBuild.result = "FAILURE"
      throw err
    }
  } finally {
    stage("clean workspace") {
      //sh "mvn clean"
    }
  }
}