# Production & App Store Deployment Checklist

## 🚀 Production Deployment Checklist

### 1. Backend/API Deployment

#### Infrastructure Requirements
- [ ] Cloud provider account (AWS/GCP/Azure)
- [ ] Production database (RDS/Cloud SQL/Azure Database)
  - Automated backups enabled
  - Encryption at rest
  - Multi-AZ for high availability
- [ ] Server hosting (ECS/EKS/App Engine/Kubernetes)
- [ ] Domain name and SSL certificate
- [ ] CDN (CloudFront/Cloudflare) for static assets
- [ ] Load balancer configured

#### Environment Configuration
- [ ] Production `.env` file with:
  ```env
  NODE_ENV=production
  DB_HOST=<production-db-host>
  DB_PORT=5432
  DB_NAME=pmp_app
  DB_USER=<secure-user>
  DB_PASSWORD=<strong-password>
  JWT_SECRET=<strong-random-secret-64-chars>
  SMTP_HOST=<email-service-host>
  SMTP_PORT=587
  SMTP_USER=<email-username>
  SMTP_PASSWORD=<email-password>
  SMTP_FROM=noreply@yourdomain.com
  ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
  PORT=3001
  ```
- [ ] Secrets management (AWS Secrets Manager/HashiCorp Vault)
- [ ] Environment variables configured in deployment platform

#### Security Checklist
- [ ] Change default admin password
- [ ] Strong JWT secret (64+ characters)
- [ ] HTTPS/TLS enabled
- [ ] CORS configured for production domains only
- [ ] Rate limiting configured for production
- [ ] Database firewall rules
- [ ] API authentication tested
- [ ] Input validation and sanitization
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled

#### Database Setup
- [ ] Run migrations on production database
- [ ] Seed initial data (certifications, knowledge areas)
- [ ] Database indexes optimized
- [ ] Connection pooling configured
- [ ] Backup strategy (daily automated backups)
- [ ] Disaster recovery plan documented

#### Monitoring & Logging
- [ ] Application monitoring (CloudWatch/Datadog/New Relic)
- [ ] Error tracking (Sentry/Rollbar)
- [ ] Log aggregation (CloudWatch Logs/ELK Stack)
- [ ] Performance monitoring (APM)
- [ ] Uptime monitoring (Pingdom/UptimeRobot)
- [ ] Database monitoring
- [ ] Alerting configured

### 2. Mobile App (iOS & Android)

#### Prerequisites
- [ ] Apple Developer Account ($99/year)
- [ ] Google Play Developer Account ($25 one-time)
- [ ] Expo account (free tier available)

#### App Configuration
- [ ] Update `app.json`:
  ```json
  {
    "expo": {
      "name": "PMP Exam Prep",
      "slug": "pmp-exam-prep",
      "version": "1.0.0",
      "ios": {
        "bundleIdentifier": "com.yourcompany.pmpexamprep",
        "buildNumber": "1"
      },
      "android": {
        "package": "com.yourcompany.pmpexamprep",
        "versionCode": 1
      }
    }
  }
  ```
- [ ] App icons (1024x1024 for iOS, adaptive for Android)
- [ ] Splash screens configured
- [ ] Update API URL to production:
  ```env
  EXPO_PUBLIC_API_URL=https://api.yourdomain.com
  ```

#### Build Preparation
- [ ] Test on physical devices (iOS and Android)
- [ ] Test all features end-to-end
- [ ] Performance testing
- [ ] Memory leak testing
- [ ] Battery usage testing
- [ ] Network error handling tested
- [ ] Offline behavior tested

#### iOS App Store Submission
- [ ] App Store Connect account setup
- [ ] App Store listing:
  - App name, subtitle, description
  - Keywords
  - Screenshots (6.5", 5.5" displays)
  - App preview video (optional)
  - Privacy policy URL
  - Support URL
  - Marketing URL (optional)
- [ ] App privacy details (data collection)
- [ ] Age rating questionnaire completed
- [ ] Pricing and availability set
- [ ] Build submission:
  ```bash
  cd mobile
  eas build --platform ios --profile production
  ```
- [ ] TestFlight beta testing (optional)
- [ ] Submit for review

#### Google Play Store Submission
- [ ] Google Play Console setup
- [ ] Store listing:
  - App name, short description, full description
  - Screenshots (phone, 7" tablet, 10" tablet)
  - Feature graphic (1024x500)
  - App icon (512x512)
  - Privacy policy URL
  - Content rating questionnaire
- [ ] Content rating (PEGI/ESRB)
- [ ] Data safety section completed
- [ ] Pricing and distribution configured
- [ ] Build submission:
  ```bash
  cd mobile
  eas build --platform android --profile production
  ```
- [ ] Internal/Alpha/Beta testing (optional)
- [ ] Submit for review

### 3. Web Admin Deployment

#### Hosting
- [ ] Static hosting (S3+CloudFront/Vercel/Netlify)
- [ ] Production API URL configured
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] SSL certificate

#### Configuration
- [ ] Update API endpoint in web-admin
- [ ] Admin authentication tested
- [ ] All admin features tested

### 4. Legal & Compliance

- [ ] Privacy Policy (required for app stores)
- [ ] Terms of Service
- [ ] End User License Agreement (EULA)
- [ ] GDPR compliance (if serving EU users)
- [ ] COPPA compliance (if targeting under 13)
- [ ] Data retention policy
- [ ] Cookie policy (if web admin uses cookies)

### 5. Testing

#### Pre-Production Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] End-to-end tests
- [ ] Load testing (backend)
- [ ] Security testing
- [ ] Accessibility testing
- [ ] Cross-device testing
- [ ] Cross-browser testing (web admin)

#### Beta Testing
- [ ] TestFlight (iOS)
- [ ] Google Play Internal/Alpha (Android)
- [ ] Gather feedback
- [ ] Fix critical bugs

### 6. Documentation

- [ ] User documentation
- [ ] Admin documentation
- [ ] API documentation
- [ ] Deployment runbook
- [ ] Incident response plan
- [ ] Support contact information

### 7. Marketing & Support

- [ ] App Store Optimization (ASO)
- [ ] Marketing website
- [ ] Support email/chat
- [ ] FAQ page
- [ ] Social media accounts
- [ ] Press kit

### 8. Post-Launch

- [ ] Monitor app store reviews
- [ ] Monitor crash reports
- [ ] Monitor analytics
- [ ] Monitor server performance
- [ ] Plan for updates
- [ ] Customer support process

## 🛠️ Quick Start Commands

### Build Mobile App for Production:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
cd mobile
eas build:configure

# Build iOS
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production
```

### Deploy Backend:

```bash
# Build Docker image
docker build -t pmp-backend:latest backend/server/

# Tag for registry
docker tag pmp-backend:latest your-registry/pmp-backend:v1.0.0

# Push to registry
docker push your-registry/pmp-backend:v1.0.0

# Deploy (example with AWS ECS)
aws ecs update-service --cluster pmp-cluster --service pmp-backend --force-new-deployment
```

## 💰 Estimated Costs (Monthly)

- **Backend Hosting**: $50-200 (depending on traffic)
- **Database (RDS)**: $30-100
- **Mobile App Stores**: $124/year (Apple $99 + Google $25)
- **Domain + SSL**: $10-20/year
- **CDN**: $10-50
- **Monitoring**: $0-50 (free tiers available)
- **Email Service (SendGrid/Mailgun)**: $0-20 (free tiers available)

**Total**: ~$100-400/month + $124/year for app stores

## 📅 Priority Order

1. **Week 1**: Backend deployment, security, database setup
2. **Week 2**: Mobile app builds, testing, store listings
3. **Week 3**: Legal docs, beta testing, final fixes
4. **Week 4**: Submit to stores, monitor, launch

## 📝 Notes

- This checklist should be reviewed and updated as you progress
- Some items may not apply to your specific deployment
- Consider using a project management tool to track progress
- Keep this document updated with actual dates and completion status

## 🔗 Related Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- [SETUP.md](SETUP.md) - Development setup guide
- [README.md](README.md) - Project overview



