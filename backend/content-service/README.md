# Content Service

Question and content management microservice for the PMP Exam Prep App.

## Features

- Question CRUD operations
- Knowledge area management
- Certification management
- Bulk question import/export (CSV)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (copy `.env.example` to `.env`)

3. Run migrations (from root database directory)

4. Start the service:
```bash
npm run dev
```

## API Endpoints

### Questions
- `GET /api/questions` - Get questions (with filters)
- `GET /api/questions/:id` - Get single question
- `GET /api/questions/knowledge-area/:knowledgeAreaId` - Get questions by knowledge area
- `POST /api/questions` - Create question (admin)
- `PUT /api/questions/:id` - Update question (admin)
- `DELETE /api/questions/:id` - Delete question (admin)

### Knowledge Areas
- `GET /api/knowledge-areas` - Get all knowledge areas
- `GET /api/knowledge-areas/:id` - Get single knowledge area
- `GET /api/knowledge-areas/certification/:certificationId` - Get knowledge areas by certification
- `POST /api/knowledge-areas` - Create knowledge area (admin)
- `PUT /api/knowledge-areas/:id` - Update knowledge area (admin)
- `DELETE /api/knowledge-areas/:id` - Delete knowledge area (admin)

### Certifications
- `GET /api/certifications` - Get all certifications
- `GET /api/certifications/:id` - Get single certification
- `POST /api/certifications` - Create certification (admin)
- `PUT /api/certifications/:id` - Update certification (admin)
- `DELETE /api/certifications/:id` - Delete certification (admin)

### Import/Export
- `POST /api/import-export/import` - Import questions from CSV (admin)
- `GET /api/import-export/export` - Export questions to CSV (admin)


