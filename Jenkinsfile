node ('dockernode'){
  // Build parameters
  // Syntax from here: https://issues.jenkins-ci.org/browse/JENKINS-32780
  properties([[$class: 'ParametersDefinitionProperty', 
               parameterDefinitions: [
                   [$class: 'StringParameterDefinition', 
                       defaultValue: 'True', 
                       description: 'Prevents node from being destroyed at end of run. Default: True', 
                       name: 'TerminateNode']]]])
  echo "Parameters: TerminateNode=${TerminateNode}"
  
  //Use try catch to set build success criteria, set true to start
  //change a comment
  currentBuild.result = "SUCCESS"
    
  try {
	  stage ("Checkout") {
		  checkout scm
		  def imageId
		  sh "git rev-parse HEAD > commit-id"
		  env.GIT_COMMIT = readFile('commit-id')
		  echo "The commit: ${env.GIT_COMMIT}"
		
		
		  //echo 'FATAL:'
		  //step([$class: 'LogParserPublisher', failBuildOnError: true, projectRulePath: '${env.WORKSPACE}/errorscanning/consolepatterns.dat', showGraphs: true, unstableOnWarning: true, useProjectRule: true])
		  //set target release here until we find a better place
		  env.RELEASE="1.0"
		
		  stage 'Toolsetup'
		  
		  
		  def matcher=null
		  //Set up gradle based on node settings
		  if((env.BRANCH_NAME != "master") && (env.BRANCH_NAME != "develop")){
			  // pull out the branch name
			  matcher = (env.BRANCH_NAME =~ /.*[^a-zA-Z0-9\.]([a-zA-Z0-9\.]+)/)
			  env.BRANCH_ID=matcher[0][1]
			  matcher = null
		
			  // pull out the type of branch
			  matcher = (env.BRANCH_NAME =~ /(.*)[^a-zA-Z0-9\.][a-zA-Z0-9\.]+/)
			  env.BRANCH_PREFIX=matcher[0][1]
			  matcher=null
			}
			else {
			  env.BRANCH_PREFIX="none"
			  env.BRANCH_ID=env.BRANCH_NAME
			}
			
			//We should no longer need to set the gradle path
			//env.PATH = "${tool 'gradle'}/bin:${env.PATH}"
			echo "My branch is: ${env.BRANCH_ID}"
			//env.VERSION="${env.BUILD_ID}.${env.BRANCH_ID}"
			//env.SONAR_VERSION="${env.BUILD_ID}.SNAPSHOT"
			// Nexus 3 version weirdness
			env.VERSION="${env.BUILD_ID}.${env.BRANCH_ID}"
			env.SONAR_VERSION="${env.BUILD_ID}"
		
			//Create Unique name
			sh 'uuid | cut -c 1-8 > HOSTNAME.${VERSION}.properties'
			sh 'rm -f commit-id'
			
			/* Now everything should be local lwith Nexus 3
			//sync docker registry
			//sh 'sudo `aws ecr get-login --region us-east-1`'
			//sh 'sudo docker pull 570220892468.dkr.ecr.us-east-1.amazonaws.com/flash:latest'
			 */
	  }
	  docker.withRegistry('https://jenkins.darkseer.org:444','nexus3') {
		  withDockerContainer('jenkins.darkseer.org:444/centos:jenkinsbuild_33') {
			  //This cant be done in the docker build so er do it here. Making any host changes
			  sh 'sudo -u root ./hosts.sh'
			  withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'nexus3', passwordVariable: 'nexuspass', usernameVariable: 'nexususer']]) {
				  //sh 'gradle -Pversion=${VERSION} -Pforce_sonar_branch=${BRANCH_NAME} -Psonarversion=${SONAR_VERSION} -Pnexuspass="$nexuspass" clean test sonarqube assemble uploadArchives --stacktrace'
				  //We need to skip sonar for now
				  sh 'mkdir -p .gradlecache .gradle'
				  
				  stage ("build") {
					  sh 'gradle --project-cache-dir .gradlecache -g .gradle -Pversion=${VERSION} -Pforce_sonar_branch=${BRANCH_NAME} -Psonarversion=${SONAR_VERSION} -Pnexuspass="$nexuspass" clean test assemble uploadArchives --stacktrace'
					  junit '**/build/test-results/test/TEST*.xml'
					  sh 'mv build/reports/tests/test/index.html build/reports/tests/test/UnitTests.html'
					  step([$class: 'ArtifactArchiver', artifacts: '**build/reports/tests/test/**', fingerprint: true])
					  sh 'gradle --project-cache-dir .gradlecache -g .gradle warstage --stacktrace'
				  }
			  }
		  }
		  stage ("TestSetup"){
			 
			 def tomcatContainer
			 def mysqlContainer
			 try { 
				 mysqlContainer = docker.image("jenkins.darkseer.org:444/mysql:14").run('-p 3306','/start.sh')
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
				 sh "./dburl_change.sh stage/tomcatcontainerwebapps/env.properties ${MYSQLPORT}"
				 				 
				 				 
				 tomcatContainer = docker.image("jenkins.darkseer.org:444/tomcat:12").run('-p 8080 -v ${WORKSPACE}/stage/tomcatcontainerwebapps:/home/tomcat/tmp','/bin/cat')
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
				 sh "echo Tomcat running on port: ${TOMCATPORT}"
				 sh "echo Mysql running on port: ${MYSQLPORT}"
				 input 'Now test'
			 }
			 finally {
				 tomcatContainer.stop()
				 mysqlContainer.stop()
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
		stage ("gradleclean") {
			sh 'rm -rf .gradle/daemon HOSTNAME*'
		}
	}
}

