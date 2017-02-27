node ('dockernode'){
  // Build parameters
  // Syntax from here: https://issues.jenkins-ci.org/browse/JENKINS-32780
  /*properties([[$class: 'ParametersDefinitionProperty', 
               parameterDefinitions: [
                   [$class: 'StringParameterDefinition', 
                       defaultValue: 'True', 
                       description: 'Prevents node from being destroyed at end of run. Default: True', 
                       name: 'TerminateNode']]]])
  echo "Parameters: TerminateNode=${TerminateNode}"
  */
  //Use try catch to set build success criteria, set true to start
  //change a comment
  currentBuild.result = "SUCCESS"
    
  try {
	  stage 'MVN Setup'
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
	  env.MAVEN_HOME="/opt/maven"
	  env.PATH="/opt/maven/bin:" + env.PATH
	  
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
		  
		  //Set up gradle based on node settings
		  if((env.BRANCH_NAME != "master") && (env.BRANCH_NAME != "develop")){
			  // pull out the branch name
			  def matcher2 = null
			  matcher2 = (env.BRANCH_NAME =~ /.*[^a-zA-Z0-9\.]([a-zA-Z0-9\.]+)/)
			  env.BRANCH_ID=matcher2[0][1]
			  matcher2 = null
		
			  // pull out the type of branch
			  matcher2 = (env.BRANCH_NAME =~ /(.*)[^a-zA-Z0-9\.][a-zA-Z0-9\.]+/)
			  env.BRANCH_PREFIX=matcher2[0][1]
			  matcher2=null
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
			
	  }
	  docker.withRegistry('http://secureci:444','nexus3') {
		  withDockerContainer('secureci:444/centos:latest') {
			  //This cant be done in the docker build so er do it here. Making any host changes
			  sh 'sudo -u root ./hosts.sh'
			  withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'nexus3', passwordVariable: 'nexuspass', usernameVariable: 'nexususer']]) {
				  
				  stage ("build") {
					  sh "mvn clean package"
				  }
				  stage ("Integration Tests") {
					  sh "mvn pre-integration-test liquibase:update"
				  }
			  }
		  }
		  stage ("TestSetup"){
			 
			 def tomcatContainer
			 def mysqlContainer
			 try { 
				 mysqlContainer = docker.image("secureci:444/mysql:latest").run('-p 3306','/start.sh')
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
				 
				 // Populate database before tomcat starts
				 withDockerContainer('secureci:444/centos:latest') {
					 //This cant be done in the docker build so er do it here. Making any host changes
					 sh 'sudo -u root ./hosts.sh'
					 withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'docker', passwordVariable: 'nexuspass', usernameVariable: 'nexususer']]) {
						 matcher = (env.MYSQLPORT =~ /(.*):(.*)/)
						 env.DBPORT=matcher[0][2]
						 matcher = null
						 stage ("build") {
							 //Populate DB
							 sh "mvn -Ddb.driver=com.mysql.cj.jdbc.Driver -Ddb.username=speaker -Ddb.password=test123 -Ddb.url=jdbc:mysql://${DOCKER_HOST_INTERNAL_IP}:${DBPORT}/speaker liquibase:update"
						 }
					 }
				 }
				 
				 //Setup Tomcat Mount
				 sh "./dburl_change.sh target/env.properties ${MYSQLPORT}"
				 				 
				 				 
				 tomcatContainer = docker.image("secureci:444/tomcat:latest").run('-p 8080 -v ${WORKSPACE}/target:/home/tomcat/tmp','/bin/cat')
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
		stage ("clean workspace") {
			//sh "mvn clean"
		}
	}
}

