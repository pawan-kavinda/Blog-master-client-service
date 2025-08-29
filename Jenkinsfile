pipeline {
    agent any

    environment {
        REGISTRY = "localhost:5000"
        IMAGE_NAME = "blog-client"
        IMAGE_TAG = "1.0"
        KUBECONFIG = "C:\\Users\\user\\.kube\\config"
        K8S_NAMESPACE = "default"
    }

    // triggers { githubPush() } // Uncomment when webhook is ready

    stages {
        stage('Checkout') {
            steps {
                echo "Cloning repository..."
                git branch: 'main', url: 'https://github.com/pawan-kavinda/Blog-master-client-service.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                bat "docker build -t %REGISTRY%/%IMAGE_NAME%:%IMAGE_TAG% ."
            }
        }

        stage('Push Image') {
            steps {
                echo "Pushing image to local registry..."
                bat "docker push %REGISTRY%/%IMAGE_NAME%:%IMAGE_TAG%"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Deploying to Kubernetes..."
                bat """
                kubectl --kubeconfig=%KUBECONFIG% set image deployment/%IMAGE_NAME% %IMAGE_NAME%=%REGISTRY%/%IMAGE_NAME%:%IMAGE_TAG% -n %K8S_NAMESPACE%
                kubectl --kubeconfig=%KUBECONFIG% rollout status deployment/%IMAGE_NAME% -n %K8S_NAMESPACE%
                """
            }
        }
    }

    post {
        success {
            echo "Deployment successful! Access frontend via port-forward or service URL."
        }
        failure {
            echo "Pipeline failed. Check logs above."
        }
    }
}

// pipeline {
//     agent any

//     environment {
//         DOCKERHUB_CRED = credentials('dockerhub-username-password')  
//         IMAGE_NAME = "pawankavinda/client-service"
//         IMAGE_TAG = "${env.BUILD_NUMBER}"
//         EC2_USER = 'ec2-user'
//         EC2_HOST = '13.217.143.170'
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 git branch: 'main', url: 'https://github.com/pawan-kavinda/Blog-master-client-service'
//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 script {
//                     dockerImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
//                 }
//             }
//         }

//         stage('Login to Docker Hub') {
//             steps {
//                 script {
//                     sh """
//                     echo "${DOCKERHUB_CRED_PSW}" | docker login -u "${DOCKERHUB_CRED_USR}" --password-stdin
//                     """
//                 }
//             }
//         }

//         stage('Push Docker Image to Docker Hub') {
//             steps {
//                 script {
//                     dockerImage.push()
//                     dockerImage.push('latest')
//                 }
//             }
//         }

//         stage('Deploy to EC2') {
//             steps {
//                 sshagent(credentials: ['ec']) {
//                     sh """
//                     echo "Connecting to EC2 instance..."
//                     ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 ${EC2_USER}@${EC2_HOST} '
//                         echo "Connected successfully! Starting deployment..."
//                         echo "Pulling latest Docker image from Docker Hub..."
//                         echo "${DOCKERHUB_CRED_PSW}" | docker login -u "${DOCKERHUB_CRED_USR}" --password-stdin
//                         docker pull ${IMAGE_NAME}:latest
//                         echo "Stopping existing container..."
//                         docker stop client-service || true
//                         docker rm client-service || true
//                         echo "Starting new container..."
//                         docker run -d --name client-service -p 80:3000 ${IMAGE_NAME}:latest
//                         echo "Verifying deployment..."
//                         docker ps | grep client-service
//                         echo "Deployment completed successfully!"
//                     '
//                     """
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             sh 'docker logout'
//             cleanWs()
//         }
//         success {
//             echo 'Deployment completed successfully!'
//         }
//         failure {
//             echo 'Deployment failed!'
//         }
//     }
// }