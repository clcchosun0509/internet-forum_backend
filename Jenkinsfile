pipeline{
  agent any
  environment {
    BUILD_IMAGE_TAG = "build-image-tag:latest"
    TEST_IMAGE_TAG = "test-image-tag:latest"
  }

  stages{
    stage('Verify Tooling'){
      steps{
        sh '''
          docker version
          docker info
        '''
      }
    }

    // stage('Prune Docker data'){
    //   steps{
    //     sh 'docker system prune -a --volumes -f'
    //   }
    // }

    stage('Build'){
      steps{
        sh "docker build --target build --tag ${env.BUILD_IMAGE_TAG} -f ./Dockerfile.prod ."
        sh "docker run --rm ${env.BUILD_IMAGE_TAG}"
      }
    }

    stage('Test'){
      steps{
        sh "docker build --target test --tag ${env.TEST_IMAGE_TAG} -f ./Dockerfile.prod ."
        sh "docker run --rm ${env.TEST_IMAGE_TAG}"
      }
    }
  }
  post{
    always{
      script{
        sh "docker rmi ${env.BUILD_IMAGE_TAG}"
        sh "docker rmi ${env.TEST_IMAGE_TAG}"
      }
    }
  }
}