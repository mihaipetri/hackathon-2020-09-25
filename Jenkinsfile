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
	stage("Publish Image") {
            agent {
    	    	kubernetes {
      		    cloud 'kubernetes'
      		    label 'kaniko-pod'
      		    yamlFile 'kaniko-pod.yaml'
		}
	    }
	    environment {
                PATH = "/busybox:/kaniko:$PATH"
      	    }
	    steps {
				container(name: 'kaniko', shell: '/busybox/sh') {
				sh '''#!/busybox/sh
				/kaniko/executor --dockerfile=Dockerfile --context=$PWD --destination="${GCR_IMAGE}"
				'''
			}
	    }
	}
	stage("Deploy to Google K8s Cluster") {
            agent {
    	        kubernetes {
      		    cloud 'kubernetes'
      		    label 'gke-deploy'
		    yamlFile 'gke-deploy-pod.yaml'
		}
            }
	    steps{
		container('gke-deploy') {
		    sh "sed -i s#IMAGE#${GCR_IMAGE}#g manifest.yaml"
                    step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.STAGING_CLUSTER, location: env.PROJECT_ZONE, manifestPattern: 'manifest.yaml', credentialsId: env.JENK_INT_IT_CRED_ID, verifyDeployments: true])
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
	stage("Deploy to AWS K8s Cluster") {
            agent {
    	        kubernetes {
      		    cloud 'kubernetes'
      		    label 'gke-deploy'
		    yamlFile 'gke-deploy-pod.yaml'
		}
            }
	    steps{
		container('gke-deploy') {
		    sh "sed -i s#IMAGE#${GCR_IMAGE}#g manifest.yaml"
                    step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.PROD_CLUSTER, location: env.PROJECT_ZONE, manifestPattern: 'manifest.yaml', credentialsId: env.JENK_INT_IT_CRED_ID, verifyDeployments: true])
			}
        }
	}
    }
}
