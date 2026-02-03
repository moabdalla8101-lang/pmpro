# Deployment Guide

This guide covers deploying the PMP Exam Prep App to production.

## Prerequisites

- AWS account (or GCP/Azure)
- Kubernetes cluster (EKS, GKE, or AKS)
- Docker registry access
- Domain name (optional)

## AWS Deployment

### 1. Set up EKS Cluster

```bash
# Install AWS CLI and eksctl
# Create EKS cluster
eksctl create cluster \
  --name pmp-app-cluster \
  --region us-east-1 \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3
```

### 2. Set up RDS PostgreSQL

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier pmp-app-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20
```

### 3. Build and Push Docker Images

```bash
# Login to Docker registry
docker login

# Build and tag images
docker build -f infrastructure/docker/Dockerfile.user-service -t your-registry/pmp-user-service:latest .
docker build -f infrastructure/docker/Dockerfile.content-service -t your-registry/pmp-content-service:latest .
docker build -f infrastructure/docker/Dockerfile.analytics-service -t your-registry/pmp-analytics-service:latest .
docker build -f infrastructure/docker/Dockerfile.web-admin -t your-registry/pmp-web-admin:latest .

# Push images
docker push your-registry/pmp-user-service:latest
docker push your-registry/pmp-content-service:latest
docker push your-registry/pmp-analytics-service:latest
docker push your-registry/pmp-web-admin:latest
```

### 4. Create Kubernetes Secrets

```bash
# Database secrets
kubectl create secret generic postgres-secret \
  --from-literal=username=postgres \
  --from-literal=password=YOUR_DB_PASSWORD

# Application secrets
kubectl create secret generic app-secrets \
  --from-literal=jwt-secret=YOUR_JWT_SECRET
```

### 5. Deploy to Kubernetes

```bash
# Update image names in deployment files
# Then apply all manifests
kubectl apply -f infrastructure/k8s/
```

### 6. Set up Ingress

```bash
# Install NGINX ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/aws/deploy.yaml

# Apply ingress configuration
kubectl apply -f infrastructure/k8s/ingress.yaml
```

### 7. Set up S3 for File Storage

```bash
# Create S3 bucket
aws s3 mb s3://pmp-app-uploads

# Configure bucket policies for access
```

### 8. Configure CloudFront (Optional)

```bash
# Create CloudFront distribution for web admin
# Point to ALB or S3 bucket
```

## Environment Variables

Update Kubernetes ConfigMaps and Secrets with production values:

- Database connection strings
- JWT secrets
- SMTP credentials
- OAuth client IDs and secrets
- API URLs

## Database Migrations

Run migrations on production database:

```bash
psql -h YOUR_RDS_ENDPOINT -U postgres -d pmp_app -f backend/database/migrations/001_initial_schema.sql
psql -h YOUR_RDS_ENDPOINT -U postgres -d pmp_app -f backend/database/seeds/001_initial_data.sql
```

## Monitoring

Set up CloudWatch or similar monitoring:

- Application logs
- Performance metrics
- Error tracking
- Database monitoring

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database encryption
- [ ] Use secrets management (AWS Secrets Manager)
- [ ] Regular security updates

## Scaling

- Configure Horizontal Pod Autoscaling (HPA)
- Set up database read replicas if needed
- Use CDN for static assets
- Implement caching strategies

## Backup Strategy

- Automated database backups
- Regular snapshots
- Disaster recovery plan

## CI/CD

The GitHub Actions workflow will automatically:
1. Run tests
2. Build Docker images
3. Push to registry
4. Deploy to Kubernetes (on main branch)

Configure secrets in GitHub:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Rollback

If deployment fails:

```bash
# Rollback to previous deployment
kubectl rollout undo deployment/user-service
kubectl rollout undo deployment/content-service
kubectl rollout undo deployment/analytics-service
kubectl rollout undo deployment/web-admin
```

## Health Checks

Monitor service health:

```bash
# Check pod status
kubectl get pods

# Check service endpoints
kubectl get endpoints

# View logs
kubectl logs -f deployment/user-service
```



