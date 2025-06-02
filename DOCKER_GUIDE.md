# 🐳 Docker Guide - F1 World Champion

## 📋 Overview

This guide covers Docker operations for the F1 World Champion application, including local development, CI/CD builds, and production deployment.

## 🚀 Quick Start

### Local Development with Docker

```bash
# Build both images locally
docker build -t f1-backend ./BackEnd
docker build -t f1-frontend ./FrontEnd/app

# Run with Docker Compose (if available)
docker-compose up --build

# Or run individually
docker run -d --name f1-mongo mongo:7.0
docker run -d --name f1-backend -p 5000:3001 --link f1-mongo:mongo f1-backend
docker run -d --name f1-frontend -p 3000:3000 f1-frontend
```

## 🔧 Docker Hub Setup

### Prerequisites
1. **Docker Hub Account**: https://hub.docker.com
2. **GitHub Secrets** configured:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password/token

### Repository Setup
Create these repositories on Docker Hub:
- `your-username/f1-backend`
- `your-username/f1-frontend`

## 📦 Image Tags Strategy

The CI/CD pipeline creates multiple tags:

### Backend Images
- `your-username/f1-backend:latest` (main branch only)
- `your-username/f1-backend:BE-dev` (development branch)
- `your-username/f1-backend:main-SHA` (commit-specific)
- `your-username/f1-backend:BE-dev-SHA` (development commit-specific)

### Frontend Images
- `your-username/f1-frontend:latest` (main branch only)
- `your-username/f1-frontend:BE-dev` (development branch)
- `your-username/f1-frontend:main-SHA` (commit-specific)
- `your-username/f1-frontend:BE-dev-SHA` (development commit-specific)

## 🏗️ Build Process

### Multi-Stage Builds
Both Dockerfiles use optimized multi-stage builds:

1. **Builder Stage**: Installs all dependencies and builds the application
2. **Production Stage**: Creates minimal runtime image with only production dependencies

### Security Features
- ✅ Non-root user execution
- ✅ Minimal Alpine Linux base
- ✅ Health checks included
- ✅ Proper signal handling with dumb-init
- ✅ .dockerignore optimization

## 🔄 CI/CD Integration

### Automatic Builds
Docker images are built and pushed automatically when:
- ✅ Push to `main` branch (creates `latest` tag)
- ✅ Push to `BE-dev` branch (creates `BE-dev` tag)
- ✅ All tests pass
- ✅ Build stage completes successfully

### Cache Optimization
- GitHub Actions cache for faster builds
- Layer caching with BuildKit
- Dependencies cached between builds

## 🚀 Production Deployment

### Docker Compose Example

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongo_data:/data/db
    networks:
      - f1-network

  backend:
    image: your-username/f1-backend:latest
    environment:
      MONGODB_URI: mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/f1-world-champion?authSource=admin
      NODE_ENV: production
    depends_on:
      - mongodb
    networks:
      - f1-network

  frontend:
    image: your-username/f1-frontend:latest
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3001/api
    ports:
      - "80:3000"
    depends_on:
      - backend
    networks:
      - f1-network

volumes:
  mongo_data:

networks:
  f1-network:
    driver: bridge
```

### Deployment Commands

```bash
# Pull latest images
docker pull your-username/f1-backend:latest
docker pull your-username/f1-frontend:latest

# Deploy with compose
docker-compose -f docker-compose.prod.yml up -d

# Health check
docker ps
docker logs f1-backend
docker logs f1-frontend
```

## 🔍 Monitoring & Debugging

### Health Checks
Both containers include health checks:
- **Backend**: HTTP check on `/health` endpoint
- **Frontend**: HTTP check on root `/` endpoint

### Log Management
```bash
# View logs
docker logs f1-backend
docker logs f1-frontend

# Follow logs
docker logs -f f1-backend

# Container stats
docker stats f1-backend f1-frontend
```

### Debugging
```bash
# Execute shell in running container
docker exec -it f1-backend sh
docker exec -it f1-frontend sh

# Check container details
docker inspect f1-backend
docker inspect f1-frontend
```

## 🔧 Maintenance

### Image Updates
```bash
# Pull latest images
docker pull your-username/f1-backend:latest
docker pull your-username/f1-frontend:latest

# Restart services
docker-compose restart backend frontend
```

### Cleanup
```bash
# Remove unused images
docker image prune

# Remove unused containers
docker container prune

# Full cleanup (careful!)
docker system prune -a
```

## 📊 Image Sizes

Target sizes (optimized):
- **Backend**: ~150MB (Alpine + Node.js + App)
- **Frontend**: ~200MB (Alpine + Node.js + Next.js)

## 🔐 Security Best Practices

- ✅ Non-root user execution
- ✅ Minimal base images (Alpine)
- ✅ No secrets in images
- ✅ Regular base image updates
- ✅ Health checks for monitoring
- ✅ .dockerignore for build context optimization

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   docker build --no-cache -t debug-image ./BackEnd
   ```

2. **Connection Issues**
   ```bash
   # Check network connectivity
   docker network ls
   docker network inspect bridge
   ```

3. **Permission Issues**
   ```bash
   # Verify user permissions
   docker exec -it container-name whoami
   ```

4. **Health Check Failures**
   ```bash
   # Check health status
   docker inspect --format='{{.State.Health.Status}}' container-name
   ```

---

## 📞 Support

For Docker-related issues:
1. Check container logs: `docker logs container-name`
2. Verify health checks: `docker ps`
3. Check network connectivity
4. Review environment variables
5. Consult application logs within containers 