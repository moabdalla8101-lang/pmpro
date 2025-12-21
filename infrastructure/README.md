# Infrastructure

Infrastructure configuration for the PMP Exam Prep App.

## Docker

### Local Development

Use Docker Compose for local development:

```bash
cd infrastructure/docker
docker-compose up
```

This will start:
- PostgreSQL database
- User Service (port 3001)
- Content Service (port 3002)
- Analytics Service (port 3003)

### Building Images

Build individual service images:

```bash
# User Service
docker build -f infrastructure/docker/Dockerfile.user-service -t pmp-user-service .

# Content Service
docker build -f infrastructure/docker/Dockerfile.content-service -t pmp-content-service .

# Analytics Service
docker build -f infrastructure/docker/Dockerfile.analytics-service -t pmp-analytics-service .

# Web Admin
docker build -f infrastructure/docker/Dockerfile.web-admin -t pmp-web-admin .
```

## Kubernetes

### Prerequisites

- Kubernetes cluster (EKS, GKE, or local)
- kubectl configured
- Docker images pushed to registry

### Deployment

1. Create secrets:
```bash
kubectl create secret generic postgres-secret \
  --from-literal=username=postgres \
  --from-literal=password=your-password

kubectl create secret generic app-secrets \
  --from-literal=jwt-secret=your-jwt-secret
```

2. Deploy services:
```bash
kubectl apply -f infrastructure/k8s/
```

### Services

- `postgres` - PostgreSQL database
- `user-service` - User authentication service
- `content-service` - Content management service
- `analytics-service` - Analytics service
- `web-admin` - Web admin frontend

## CI/CD

GitHub Actions workflow is configured in `.github/workflows/ci.yml`.

The pipeline:
1. Runs tests
2. Builds Docker images
3. Pushes to Docker registry
4. Deploys to Kubernetes (on main branch)

## AWS Infrastructure

For production deployment on AWS:

1. **EKS Cluster**: Create EKS cluster for Kubernetes
2. **RDS PostgreSQL**: Managed PostgreSQL database
3. **S3**: File storage for imports/exports
4. **CloudFront**: CDN for web admin
5. **Route 53**: DNS management
6. **ALB**: Application Load Balancer
7. **CloudWatch**: Monitoring and logging

See AWS documentation for setting up these services.

