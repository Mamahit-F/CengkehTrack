pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'VITE_API_BASE_URL=/ npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '''
                        export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
                        export PATH="$JAVA_HOME/bin:$PATH"
                        mvn -B -DskipTests package
                    '''
                }
            }
        }

        stage('Deploy to VPS') {
            steps {
                sh 'sudo /usr/local/bin/deploy-cengkihtrack'
            }
        }
    }

    post {
        success {
            echo 'CengkihTrack berhasil diperbarui!'
        }
        failure {
            echo 'Pipeline gagal. Periksa Console Output.'
        }
    }
}
