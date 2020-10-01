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
		podTemplate(yaml: """
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

"""
)
	    node(POD_LABEL) {
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
    }
}
