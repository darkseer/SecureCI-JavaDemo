node (){

    currentBuild.result = "SUCCESS"
    
    try {

	parallel MVNSetup: {
	    env.DOCKER_HOST_INTERNAL_IP = sh (
		script: 'ip route show dev docker0',
		returnStdout: true
	    ).trim()
	    def matcher=null
	    matcher=(env.DOCKER_HOST_INTERNAL_IP =~ /.*src ([^ ]+).*/)
	    env.DOCKER_HOST_INTERNAL_IP=matcher[0][1]
	    matcher=null

	    echo "${DOCKER_HOST_INTERNAL_IP}"
	    //Create maven cache directory if it doesn't exist
	    sh "if [ ! -d .m2 ] ; then mkdir .m2; fi"
	    
	    //Set the maven variables for this project
	    env.MAVEN_OPTS="-Dmaven.repo.local=${env.WORKSPACE}/.m2"
	    env.MAVEN_HOME="/opt/apache-maven-3.5.2"
	    env.PATH="${MAVEN_HOME}/bin:" + env.PATH
	},
	Checkout: {
	    checkout scm
	    def imageId
	    env.BRANCH_NAME="securecidemo"
	    sh "git rev-parse HEAD > commit-id"
	    env.GIT_COMMIT = readFile('commit-id')
	    echo "The commit: ${env.GIT_COMMIT}"
	    echo "Branch: ${BRANCH_NAME}"
	    
	    env.RELEASE="1.0"
	    

	    env.BRANCH_PREFIX="none"
	    env.BRANCH_ID=env.BRANCH_NAME


	    
	    //We should no longer need to set the gradle path
	    echo "My branch is: ${env.BRANCH_ID}"

	    // Nexus 3 version weirdness
	    env.VERSION="${env.BUILD_ID}.${env.BRANCH_ID}"
	    env.SONAR_VERSION="${env.BUILD_ID}"
	    
	    //Create Unique name
	    sh 'uuid | cut -c 1-8 > HOSTNAME.${VERSION}.properties'
	    sh 'rm -f commit-id'
	    
	}
	docker.withRegistry('http://secureci:8182','docker') {
	    withDockerContainer(args: '--net=\"host\"', image:'secureci:8182/centos:latest') {
		withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', passwordVariable: 'nexuspass', usernameVariable: 'nexususer']]) {			  
		    stage ("build") {
			sh "${MAVEN_HOME}/bin/mvn clean compile"
		    }
		}
	    }

	    parallel UnitTests: {
		withDockerContainer(args: '--net=\"host\"', image:'secureci:8182/centos:latest') {
		    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', passwordVariable: 'nexuspass', usernameVariable: 'nexususer']]) {			  
			sh "${MAVEN_HOME}/bin/mvn -Dmaven.test.failure.ignore=false package"
			junit allowEmptyResults: true, testResults: 'target/surefire-reports/*.xml'
		    }
		}

	    },
	    IntegrationTests: {
		
		def tomcatContainer
		def mysqlContainer
		def testContainer
		
		try { 
		    mysqlContainer = docker.image("secureci:8182/mysql:latest").run('-p 3306 --name=mysql_${BUILD_NUMBER}','/start.sh')
		    env.MYSQLID=mysqlContainer.id
		    
		    waitUntil {
			sh "docker exec -t ${MYSQLID} netstat -apn | grep 3306 | grep LISTEN | wc -l | tr -d '\n' > wait_results"
			wait_results = readFile 'wait_results'
			echo "Wait Results(${wait_results})"
			if ("${wait_results}" == "1")
			{
			    echo "Mysql is listening on port 3306"
			    sh "rm -f wait_results"
			    return true
			}
			else {
			    echo "Mysql is not listening on port 3306 yet"
			    return false
			}
		    }// end of waitUntil
		    env.MYSQLPORT=mysqlContainer.port(3306)
		    
		    //Setup Tomcat Mount
		    sh "rm -f target/env.properties"
		    sh "./dburl_change.sh target/env.properties ${MYSQLPORT} ${DOCKER_HOST_INTERNAL_IP}"
		    
		    
		    tomcatContainer = docker.image("secureci:8182/tomcat:latest").run('-p 8080 -v ${WORKSPACE}/target:/home/tomcat/tmp --link=mysql_${BUILD_NUMBER}:mysql','/bin/cat')
		    env.TOMCATID=tomcatContainer.id
		    
		    // Wait for tomcat to be up
		    waitUntil {
			sh "docker exec -t ${TOMCATID} netstat -apn | grep 8080 | grep LISTEN | wc -l | tr -d '\n' > wait_results"
			wait_results = readFile 'wait_results'
			echo "Wait Results(${wait_results})"
			if ("${wait_results}" == "1") 
			{ 
			    echo "Tomcat is listening on port 8080" 
			    sh "rm -f wait_results" 
			    return true 
			}
			else { 
			    echo "Tomcat is not listening on port 8080 yet" 
			    return false 
			} 
		    }// end of waitUntil
		    
		    env.TOMCATPORT=tomcatContainer.port(8080)
		    env.MYSQLPORT=mysqlContainer.port(3306)
		    
		    matcher=(env.TOMCATPORT =~ /.*:([^ ]+).*/)
		    env.TOMCATPORT=matcher[0][1]
		    matcher=null
		    
		    sh "echo Tomcat running on port: ${TOMCATPORT}"
		    sh "echo Mysql running on port: ${MYSQLPORT}"
		    
		    echo 'Two Minutes to test'

		    //withDockerContainer(args: '--net=\"host\"', image:'secureci:8182/centos:latest') {
		    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', passwordVariable: 'nexuspass', usernameVariable: 'nexususer']]) {
			try {
			    wrap([$class: 'Xvfb']) {
				sh "mvn -Dwebdriver.chrome.driver=/usr/java/secureci-testing-framework-1.3.0/chromedriver -Dwebdriver.gecko.driver=/usr/local/bin/geckodriver -Dmaven.test.failure.ignore=false verify -Dtomcat.port=${TOMCATPORT} -Dtomcat.ip=${DOCKER_HOST_INTERNAL_IP}"
			    }
			}
			catch (err){
			    currentBuild.result = "FAILURE"
			    throw err
			}
		    },
		    testlinux-chrome: {
			sleep 30;
		    },
		    testlinux-firefox: {
			sleep 30;
		    },
		    testwindows-chrome: {
			sleep 30;
	  	    },
		    testwindows-edge: {
			sleep 30;
	  	    },
		    testMacOS-safari: {
			sleep 30;
		    },
		    testMacOS-chrome: {
			sleep 30;
		    },
		    testMacOS-firefox: {
			sleep 30;
		    }

		    
		    stage("StaticAnalysis") {
			withDockerContainer(args: '--net=\"host\"', image:'secureci:8182/centos:latest') {
			    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', passwordVariable: 'nexuspass', usernameVariable: 'nexususer']]) {
				stage ("Upload results") {
				    //Gather the it tests Gather the int coverage results
				    sh "docker exec -t ${TOMCATID} /opt/tomcat9/bin/catalina.sh stop"
				    sh "${MAVEN_HOME}/bin/mvn sonar:sonar"				
				}
			    }
			}
		    }

		    
		}
		finally {
		    stage("Stopping Containers"){
			if (currentBuild.result == "FAILURE"){
			    stage("state capture"){
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
	}
    }
    
    catch(err) {
	stage ("Error") {
	    currentBuild.result = "FAILURE"
	    throw err
	}
    }
    finally {
	stage ("clean workspace") {
	    //sh "mvn clean"
	}
    }
}

