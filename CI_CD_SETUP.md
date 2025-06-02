# CI/CD Setup Guide

This document explains how to set up and use the GitHub Actions CI/CD pipeline for the F1 World Champion application.

## 🔄 Pipeline Overview

The CI/CD pipeline follows the required stages: **install → lint → test → build**

### Pipeline Stages

1. **Install**: Installs dependencies for both frontend and backend
2. **Security Scan**: Runs CodeQL security analysis (nice-to-have requirement)
3. **Lint**: Runs code linting for both applications
4. **Test**: Executes unit and integration tests
5. **Build**: Builds production-ready applications
6. **Docker** (optional): Builds and pushes Docker images
7. **Deploy** (optional): Deploys to production environment

## 🚀 Getting Started

### 1. Push to GitHub

The pipeline automatically triggers on:
- Push to `main` or `develop` branches
- Pull requests to `main` branch

### 2. Required GitHub Secrets

For Docker and deployment features, add these secrets in your GitHub repository:

**Repository Settings → Secrets and variables → Actions**

#### Docker Hub (Optional)
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
```

#### Deployment (Optional)
Choose one based on your deployment platform:

**Railway:**
```
RAILWAY_TOKEN=your-railway-token
RAILWAY_PROJECT_ID=your-project-id
```

**Render:**
```
RENDER_DEPLOY_HOOK=your-render-deploy-hook-url
```

**Fly.io:** (Add your fly.toml configuration)

### 3. Environment Variables

The pipeline uses these environment variables:
- `NODE_VERSION`: '18' (Node.js version)
- `MONGODB_URI`: mongodb://localhost:27017/f1-test (for testing)

## 📊 Pipeline Features

### ✅ Mandatory Requirements Met

- **GitHub Actions**: ✅ Using GitHub Actions as CI service
- **Pipeline Stages**: ✅ install → lint → test → build
- **Test Failure Rejection**: ✅ Pipeline fails if tests fail
- **Both Applications**: ✅ Handles both frontend (Next.js) and backend (Node.js/TypeScript)

### 🎯 Nice-to-Have Features Included

- **Security Scanning**: ✅ CodeQL dependency scan
- **Scan Failure Rejection**: ✅ Pipeline fails on security issues
- **Docker Images**: ✅ Builds and pushes to public registry
- **Auto Deployment**: ✅ Ready for Railway, Render, or Fly.io
- **Test Coverage**: ✅ Codecov integration
- **Caching**: ✅ NPM dependencies cached for faster builds

## 🐳 Docker Support

### Backend Docker Image
- Multi-stage build for optimization
- Non-root user for security
- Health checks included
- Proper signal handling with dumb-init

### Frontend Docker Image
- Next.js standalone output for smaller images
- Static asset optimization
- Health checks included
- Security best practices

### Building Locally
```bash
# Backend
docker build -t f1-backend ./BackEnd

# Frontend
docker build -t f1-frontend ./FrontEnd/app
```

## 🔧 Customization

### Adding Frontend Tests
Uncomment the frontend test section in `.github/workflows/ci-cd.yml`:

```yaml
- name: Run Frontend Tests
  working-directory: ./FrontEnd/app
  run: npm test
```

### Enabling Deployment
1. Choose your deployment platform (Railway, Render, Fly.io)
2. Add the required secrets to GitHub
3. Uncomment the relevant deployment section in the workflow
4. Configure platform-specific deployment files

### Changing Node.js Version
Update the `NODE_VERSION` environment variable in the workflow file.

## 📈 Monitoring

### Build Status
- Check the "Actions" tab in your GitHub repository
- Green checkmark = successful pipeline
- Red X = failed pipeline

### Coverage Reports
- Backend coverage reports are uploaded to Codecov
- Add Codecov token to secrets for private repositories

### Security Alerts
- Security vulnerabilities appear in the "Security" tab
- CodeQL results show in pull request checks

## 🚨 Troubleshooting

### Common Issues

1. **Tests Failing**: Check test output in the Actions tab
2. **Build Errors**: Ensure all dependencies are in package.json
3. **Docker Build Fails**: Check Dockerfile syntax and .dockerignore
4. **Deployment Issues**: Verify secrets and deployment configuration

### Pipeline Failure Points
- Install stage: Missing or incompatible dependencies
- Lint stage: Code style violations or TypeScript errors
- Test stage: Failing unit/integration tests or MongoDB connection
- Build stage: Build errors in frontend or backend
- Security stage: High-severity vulnerabilities found

### Getting Help
1. Check the Actions logs for detailed error messages
2. Ensure all package.json scripts are properly configured
3. Verify that tests pass locally before pushing
4. Check that MongoDB is properly mocked in tests

## 📋 Checklist for First Run

- [ ] Repository pushed to GitHub
- [ ] `main` and `develop` branches created
- [ ] All tests pass locally
- [ ] Code follows linting rules
- [ ] Package.json scripts are configured
- [ ] MongoDB connection is properly mocked in tests
- [ ] (Optional) Docker Hub credentials added to secrets
- [ ] (Optional) Deployment platform configured

## 🔄 Continuous Integration Best Practices

1. **Keep tests fast**: Use in-memory MongoDB for testing
2. **Run linting locally**: Use pre-commit hooks
3. **Small, focused commits**: Easier to debug pipeline failures
4. **Branch protection**: Require PR reviews and status checks
5. **Monitor coverage**: Aim for >80% test coverage
6. **Regular updates**: Keep dependencies and actions updated

The CI/CD pipeline is now ready to ensure code quality, security, and reliable deployments for your F1 World Champion application! 🏎️ 