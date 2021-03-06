pipeline {
    agent none

    environment {
		JENK_INT_IT_CRED_ID = "kaniko-role"
        PROJECT_ZONE = "us-central1-a"
		PROJECT_ZONE2 = "us-east1-b"
        PROJECT_ID = "hackathon-2020-09-25"
        STAGING_CLUSTER = "google-k8s-cluster"
        PROD_CLUSTER = "aws-k8s-cluster"
		PROD_CLUSTER2 = "azure-k8s-cluster"
		PROD_CLUSTER3 = "on-premise-k8s-cluster"
        BUILD_CONTEXT_BUCKET = "hackathon-2020-09-25-bucket"
        BUILD_CONTEXT = "build-context-${BUILD_ID}.tar.gz"
        APP_NAME = "app-hackathon-demo"
        GCR_IMAGE = "gcr.io/${PROJECT_ID}/${APP_NAME}:${BUILD_ID}"
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
				/kaniko/executor -f `pwd`/Dockerfile -c `pwd` --dockerfile=`pwd`/Dockerfile --context=`pwd` --destination="${GCR_IMAGE}"
				'''
			}
	    }
	}
	stage("Deploy to AWS K8s Cluster") {
            agent {
    	        kubernetes {
      		    cloud 'kubernetes'
      		    label 'gke-deploy'
		    yamlFile 'gke-deploy-pod.yaml'
		}
            }
	    environment {
                CLOUD = "AWS"
      	    }			
	    steps{
		container('gke-deploy') {
		    sh "sed -i s#IMAGE#${GCR_IMAGE}#g manifest-aws.yaml"
                    step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.PROD_CLUSTER, location: env.PROJECT_ZONE, manifestPattern: 'manifest-aws.yaml', credentialsId: env.JENK_INT_IT_CRED_ID, verifyDeployments: true])
			}
        }
	}
	stage("Deploy to Azure K8s Cluster") {
            agent {
    	        kubernetes {
      		    cloud 'kubernetes'
      		    label 'gke-deploy'
		    yamlFile 'gke-deploy-pod.yaml'
		}
            }
	    environment {
                CLOUD = "Azure"
      	    }			
	    steps{
		container('gke-deploy') {
		    sh "sed -i s#IMAGE#${GCR_IMAGE}#g manifest-azure.yaml"
                    step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.PROD_CLUSTER2, location: env.PROJECT_ZONE2, manifestPattern: 'manifest-azure.yaml', credentialsId: env.JENK_INT_IT_CRED_ID, verifyDeployments: true])
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
	    environment {
                CLOUD = "Google Cloud Platform"
      	    }
	    steps{
		container('gke-deploy') {
		    sh "sed -i s#IMAGE#${GCR_IMAGE}#g manifest-google.yaml"
                    step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.STAGING_CLUSTER, location: env.PROJECT_ZONE, manifestPattern: 'manifest-google.yaml', credentialsId: env.JENK_INT_IT_CRED_ID, verifyDeployments: true])
			}
        }
	}
        stage('Wait for the Manager Approval') {
            steps{
                timeout(time:12, unit:'HOURS') {
                    input message:'Approve deployment?'
                }
            }
        }
	stage("Deploy to On-Premise K8s Cluster") {
            agent {
    	        kubernetes {
      		    cloud 'kubernetes'
      		    label 'gke-deploy'
		    yamlFile 'gke-deploy-pod.yaml'
		}
            }
	    environment {
                CLOUD = "On-Premise"
      	    }			
	    steps{
		container('gke-deploy') {
		    sh "sed -i s#IMAGE#${GCR_IMAGE}#g manifest-on-premise.yaml"
                    step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.PROD_CLUSTER3, location: env.PROJECT_ZONE2, manifestPattern: 'manifest-on-premise.yaml', credentialsId: env.JENK_INT_IT_CRED_ID, verifyDeployments: true])
			}
        }
	}
    }
}
