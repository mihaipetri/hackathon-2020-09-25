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
            try {
                container('maven') {
                    sh 'mihai testing'
                }
            } catch (Exception e) {
                throw e
            }
        }
    }
}
