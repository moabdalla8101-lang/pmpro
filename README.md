# PMP Exam Prep Mobile App

A comprehensive mobile application for PMP (Project Management Professional) exam preparation, including a web-based back office for content management.

## Project Structure

This is a monorepo containing:

- **mobile/** - React Native mobile app for iOS and Android
- **web-admin/** - React TypeScript web back office for administrators
- **backend/** - Node.js/Express microservices backend
  - **user-service/** - User authentication and management service
  - **content-service/** - Question and content management service
  - **analytics-service/** - Analytics and reporting service
  - **shared/** - Shared backend utilities and types
  - **database/** - Database migrations and seeds
- **shared/** - Shared types and utilities across all projects
- **infrastructure/** - Docker, Kubernetes, and CI/CD configurations

## Technology Stack

- **Mobile App**: React Native (Expo)
- **Web Admin**: React + TypeScript
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL
- **Infrastructure**: Docker, Kubernetes, AWS

## Getting Started

See individual service READMEs for setup instructions:
- [Backend README](backend/README.md)
- [Mobile App README](mobile/README.md)
- [Web Admin README](web-admin/README.md)

## Development

Each service can be developed independently. Use Docker Compose for local development with all services.

## License

Proprietary


