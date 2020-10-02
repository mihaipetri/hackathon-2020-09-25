pipeline {
    agent none

    environment {
		JENK_INT_IT_CRED_ID = "kaniko-role"
        PROJECT_ZONE = "us-central1-a"
        PROJECT_ID = "hackathon-2020-09-25"
        STAGING_CLUSTER = "google-k8s-cluster"
        PROD_CLUSTER = "aws-k8s-cluster"
        BUILD_CONTEXT_BUCKET = "hackathon-2020-09-25-bucket"
        BUILD_CONTEXT = "build-context-${BUILD_ID}.tar.gz"
        APP_NAME = "app-hackathon-demo"
        GCR_IMAGE = "gcr.io/${PROJECT_ID}/${APP_NAME}:${BUILD_ID}"
        APP_JAR = "${APP_NAME}.jar"
    }

    stages {
    stage("Build and test") {
	    agent {
    	    	kubernetes {
      		    cloud 'kubernetes'
      		    label 'node-pod'
      		    yamlFile 'node-pod.yaml'
			}
	    }
	    steps {
	    	container('node') {
   	        	sh "npm install"
			}
	    }
	}
    }
}
