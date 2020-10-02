pipeline {
    agent none

    stages {
	stage("Publish Image") {
            agent {
    	    	kubernetes {
      		    cloud 'kubernetes'
			}
	    }
	    steps {
				sh 'echo "mihai testing"'
	    }
	}
    }
}
