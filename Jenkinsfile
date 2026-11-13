// Jenkins job: expense-claim-portal (Pipeline, "Pipeline script").
pipeline {
  agent any
  options { timeout(time: 20, unit: 'MINUTES') }
  environment {
    NG_CLI_ANALYTICS = 'false'   // stops the Angular CLI asking questions
    CI = 'true'
  }
  stages {
    stage('Checkout') {
      steps { git url: 'https://github.com/gkoshy-accenture/expense-claim-portal.git', branch: 'main' }
    }
    stage('Install') {
      steps {
        // --ignore-scripts: packages cannot run code at install time.
        sh 'npm ci --ignore-scripts --no-audit --no-fund'
      }
    }
    stage('Test') {
      steps { sh 'npm test' }
    }
    stage('Build') {
      steps { sh 'npm run build -- --base-href /myapp/' }
    }
    stage('Deploy') {
      steps {
        sh 'rsync -a --delete --chmod=D755,F644 dist/expense-ui/browser/ /var/www/expense-ui/'
        sh 'test -f /var/www/expense-ui/index.html && echo "Frontend deployed"'
      }
    }
  }
}
