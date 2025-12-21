# PMP Exam Prep Mobile App

A comprehensive mobile application for PMP (Project Management Professional) exam preparation, including a web-based back office for content management.

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

## 🚀 Quick Start

```bash
# Using Docker (Recommended)
cd infrastructure/docker
docker-compose up

# Or use the setup script
./scripts/setup.sh
./scripts/db-setup.sh
```

See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

## 📋 Features

### Mobile App
- ✅ User authentication (email, social login)
- ✅ Practice questions with adaptive difficulty
- ✅ Custom quizzes
- ✅ Timed mock exams (180 questions, 230 minutes)
- ✅ Progress tracking and analytics
- ✅ Bookmarks and missed questions review
- ✅ Gamification (streaks, badges)
- ✅ Daily quiz challenges

### Web Admin
- ✅ Admin dashboard with key metrics
- ✅ Question management (CRUD)
- ✅ Knowledge area management
- ✅ Certification management
- ✅ User management
- ✅ Analytics and reporting
- ✅ Bulk question import/export (CSV)

### Backend
- ✅ Monolithic architecture (simplified from microservices)
- ✅ RESTful API
- ✅ JWT authentication
- ✅ PostgreSQL database
- ✅ Scalable design for multiple certifications

## 🏗️ Architecture

```
pmpro/
├── mobile/              # React Native mobile app
├── web-admin/          # React TypeScript admin dashboard
├── backend/            # Node.js backend
│   ├── server/         # Monolithic server (all services unified)
│   ├── shared/         # Shared utilities
│   └── database/       # Database migrations and seeds
├── infrastructure/     # Docker, Kubernetes, CI/CD
└── scripts/           # Setup and utility scripts
```

## 🛠️ Technology Stack

- **Mobile**: React Native (Expo), Redux Toolkit
- **Web Admin**: React, TypeScript, Material-UI, Vite
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **Infrastructure**: Docker, Kubernetes, AWS

## 📚 Documentation

- [Quick Start Guide](QUICKSTART.md) - Get started in 5 minutes
- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions
- [Contributing](CONTRIBUTING.md) - How to contribute

## 🔧 Development

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)
- Expo CLI (for mobile)

### Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/moabdalla8101-lang/pmpro.git
   cd pmpro
   ```

2. **Run setup script**
   ```bash
   ./scripts/setup.sh
   ```

3. **Set up database**
   ```bash
   ./scripts/db-setup.sh
   ```

4. **Start services**
   ```bash
   # Backend server (monolith - all services in one)
   cd backend/server && npm run dev
   # Or use the script: ./scripts/start-server.sh
   
   # Web admin
   cd web-admin && npm run dev
   
   # Mobile app
   cd mobile && npm start
   ```

## 🧪 Testing

```bash
# Backend tests
cd backend/server && npm test
```

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/reset-password/request` - Request password reset

### Questions
- `GET /api/questions` - Get questions
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create question (admin)

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress/answer` - Record answer

### Exams
- `POST /api/exams/start` - Start mock exam
- `POST /api/exams/:id/submit` - Submit exam

See [MONOLITH_MIGRATION.md](MONOLITH_MIGRATION.md) for migration details and [backend/server/README.md](backend/server/README.md) for complete API documentation.

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

### Docker
```bash
docker-compose -f infrastructure/docker/docker-compose.yml up
```

### Kubernetes
```bash
kubectl apply -f infrastructure/k8s/
```

## 📝 License

Proprietary - All rights reserved

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📞 Support

For issues and questions:
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Open a GitHub issue
- Review service-specific README files

## 🎯 Roadmap

- [ ] Complete OAuth integration (Google, Apple)
- [ ] Push notifications
- [ ] Offline mode
- [ ] Study materials (notes, flashcards)
- [ ] Community forum
- [ ] AI-powered study coach

## 🙏 Acknowledgments

Built with modern web technologies and best practices for scalability and maintainability.
