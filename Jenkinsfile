pipeline {
    agent any

    environment {
        DOCKERHUB_CRED = credentials('dockerhub-username-password')  
        IMAGE_NAME = "pawankavinda/client-service"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        EC2_USER = 'ec2-user'
        EC2_HOST = '13.217.143.170'
        SSH_KEY_CREDENTIALS = 'ec2-ssh-key'  
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/pawan-kavinda/Blog-master-client-service'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    sh """
                    echo "${DOCKERHUB_CRED_PSW}" | docker login -u "${DOCKERHUB_CRED_USR}" --password-stdin
                    """
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    dockerImage.push()
                    dockerImage.push('latest')
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent([SSH_KEY_CREDENTIALS]) {
                    script {
                        sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            echo "Pulling latest Docker image from Docker Hub..."
                            echo "${DOCKERHUB_CRED_PSW}" | docker login -u "${DOCKERHUB_CRED_USR}" --password-stdin &&
                            docker pull ${IMAGE_NAME}:latest &&
                            docker stop client-service || true &&
                            docker rm client-service || true &&
                            docker run -d --name client-service -p 80:80 ${IMAGE_NAME}:latest
                        '
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
            cleanWs()
        }
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
