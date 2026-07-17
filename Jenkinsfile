pipeline {
  agent none
  options {
    timestamps()
    timeout(time: 45, unit: 'MINUTES')
    disableConcurrentBuilds(abortPrevious: true)
  }
  parameters {
    choice(name: 'TEST_GREP', choices: ['@smoke', '@regression', '@api'])
  }
  environment {
    CI = 'true'
    BASE_URL = 'https://opensource-demo.orangehrmlive.com'
  }
  stages {
    stage('Quality gates') {
      agent { docker { image 'mcr.microsoft.com/playwright:v1.61.1-noble'; args '--ipc=host' } }
      steps {
        sh 'npm ci'
        sh 'npm run typecheck'
        sh 'npm run lint'
        sh 'npm run format:check'
      }
    }
    stage('Cross-browser tests') {
      parallel {
        stage('Chromium') {
          agent { docker { image 'mcr.microsoft.com/playwright:v1.61.1-noble'; args '--ipc=host' } }
          steps { runBrowser('chromium') }
        }
        stage('Firefox') {
          agent { docker { image 'mcr.microsoft.com/playwright:v1.61.1-noble'; args '--ipc=host' } }
          steps { runBrowser('firefox') }
        }
        stage('WebKit') {
          agent { docker { image 'mcr.microsoft.com/playwright:v1.61.1-noble'; args '--ipc=host' } }
          steps { runBrowser('webkit') }
        }
      }
    }
  }
  post {
    always {
      junit allowEmptyResults: true, testResults: '**/reports/junit/*.xml'
      archiveArtifacts allowEmptyArchive: true, artifacts: '**/playwright-report/**, **/test-results/**, **/reports/**'
    }
  }
}

void runBrowser(String browser) {
  withCredentials([
    usernamePassword(
      credentialsId: 'orangehrm-demo',
      usernameVariable: 'TEST_USERNAME',
      passwordVariable: 'TEST_PASSWORD'
    )
  ]) {
    withEnv([
      "TEST_GREP=${params.TEST_GREP}",
      "PLAYWRIGHT_BROWSER=${browser}"
    ]) {
      sh 'npm ci'
      sh 'npx playwright test --project="$PLAYWRIGHT_BROWSER" --grep "$TEST_GREP"'
    }
  }
}
