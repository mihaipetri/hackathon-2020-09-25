podTemplate(yaml: """
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: some-label-value
spec:
  containers:
  - name: maven
    image: maven:3.3.9-jdk-8-alpine
    command: ['cat']
    tty: true
"""
  ) {

    node(POD_LABEL) {
        stage('Integration Test') {
		agent {
    	        kubernetes {
      		    cloud 'kubernetes'
      		    label 'gke-deploy'
		    yamlFile 'gke-deploy-pod.yaml'
			}
        }
		steps {
			container('maven') {
				sh 'mihai testing'
			}
        }
		}
    }
}
