pipeline {
    agent none

    environment {
        PROJECT_ZONE = "${JENK_INT_IT_ZONE}"
        PROJECT_ID = "${JENK_INT_IT_PROJECT_ID}"
        STAGING_CLUSTER = "${JENK_INT_IT_STAGING}"
        PROD_CLUSTER = "${JENK_INT_IT_PROD}"
        BUILD_CONTEXT_BUCKET = "hackathon-2020-09-25-bucket"
        BUILD_CONTEXT = "build-context-${BUILD_ID}.tar.gz"
        APP_NAME = "jenkins-integration-samples-gke"
        GCR_IMAGE = "gcr.io/${PROJECT_ID}/${APP_NAME}:${BUILD_ID}"
        APP_JAR = "${APP_NAME}.jar"
    }

    stages {
        stage("Build and test") {
	    agent {
    	    	kubernetes {
      		    cloud 'kubernetes'
      		    label 'maven-pod'
      		    yamlFile 'gke/jenkins/maven-pod.yaml'
		}
	    }
	    steps {
	    	container('maven') {
                    dir("gke") {
		        // build
	    	        sh "mvn clean package"

		        // run tests
		        sh "mvn verify"
		        
			// bundle the generated artifact    
		        sh "cp target/${APP_NAME}-*.jar $APP_JAR"

		        // archive the build context for kaniko			    
			sh "tar --exclude='./.git' -zcvf /tmp/$BUILD_CONTEXT ."
		        sh "mv /tmp/$BUILD_CONTEXT ."
		        step([$class: 'ClassicUploadStep', credentialsId: env.JENK_INT_IT_CRED_ID, bucket: "gs://${BUILD_CONTEXT_BUCKET}", pattern: env.BUILD_CONTEXT])
                    }
		}
	    }
	}
	stage("Publish Image") {
            agent {
    	    	kubernetes {
      		    cloud 'kubernetes'
      		    label 'kaniko-pod'
      		    yamlFile 'gke/jenkins/kaniko-pod.yaml'
		}
	    }
	    environment {
                PATH = "/busybox:/kaniko:$PATH"
      	    }
	    steps {
	        container(name: 'kaniko', shell: '/busybox/sh') {
		    sh '''#!/busybox/sh
		    /kaniko/executor -f `pwd`/gke/Dockerfile -c `pwd` --context="gs://${BUILD_CONTEXT_BUCKET}/${BUILD_CONTEXT}" --destination="${GCR_IMAGE}" --build-arg JAR_FILE="${APP_JAR}"
		    '''
		}
	    }
	}
	stage("Deploy to staging") {
            agent {
    	        kubernetes {
      		    cloud 'kubernetes'
      		    label 'gke-deploy'
		    yamlFile 'gke/jenkins/gke-deploy-pod.yaml'
		}
            }
	    steps{
		container('gke-deploy') {
		    sh "sed -i s#IMAGE#${GCR_IMAGE}#g gke/kubernetes/manifest.yaml"
                    step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.STAGING_CLUSTER, location: env.PROJECT_ZONE, manifestPattern: 'gke/kubernetes/manifest.yaml', credentialsId: env.JENK_INT_IT_CRED_ID, verifyDeployments: true])
		}
            }
	}
        /**
         * This stage simulates an SRE manual approval process. Should you want to incorporate
         * this into your pipeline you can uncomment this stage.
        stage('Wait for SRE Approval') {
            steps{
                timeout(time:12, unit:'HOURS') {
                    input message:'Approve deployment?'
                }
            }
        }
         **/
	stage("Deploy to prod") {
            agent {
    	        kubernetes {
      		    cloud 'kubernetes'
      		    label 'gke-deploy'
		    yamlFile 'gke/jenkins/gke-deploy-pod.yaml'
		}
            }
	    steps{
		container('gke-deploy') {
		    sh "sed -i s#IMAGE#${GCR_IMAGE}#g gke/kubernetes/manifest.yaml"
                    step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.PROD_CLUSTER, location: env.PROJECT_ZONE, manifestPattern: 'gke/kubernetes/manifest.yaml', credentialsId: env.JENK_INT_IT_CRED_ID, verifyDeployments: true])
		}
            }
	}
    }
}