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
	stage("Publish Image") {
            agent {
    	    	kubernetes {
		    cloud 'kubernetes'
      		    label 'kaniko-pod'
      		    yaml '''
		    
		    apiVersion: v1
kind: Pod
metadata:
  name: kaniko
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug-539ddefcae3fd6b411a95982a830d987f4214251
    imagePullPolicy: Always
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
      - name: kaniko-secret
        mountPath: /secret
    env:
      - name: GOOGLE_APPLICATION_CREDENTIALS
        value: /secret/kaniko-secret.json
  volumes:
  - name: kaniko-secret
    secret:
      secretName: jenkins-int-samples-kaniko-secret

		    
		    
		'''
		}
	    }
	    environment {
                PATH = "/busybox:/kaniko:$PATH"
      	    }
	    steps {
				container(name: 'kaniko', shell: '/busybox/sh') {
				sh '''#!/busybox/sh
				/kaniko/executor -f `pwd`Dockerfile -c `pwd` --context="gs://${BUILD_CONTEXT_BUCKET}/${BUILD_CONTEXT}" --destination="${GCR_IMAGE}"
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
