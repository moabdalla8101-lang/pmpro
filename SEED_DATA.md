# 📚 Database Seeding Guide

Guide to seed the database with PMP exam questions and data.

---

## ✅ Questions Seeded!

The database has been seeded with **15 PMP exam questions** covering all 10 knowledge areas.

### Statistics:
- **Questions:** 15
- **Answers:** 60 (4 answers per question)
- **Knowledge Areas Covered:** All 10 PMP knowledge areas
- **Difficulty Levels:** Easy, Medium, Hard

---

## 🚀 Quick Seed

### Seed Questions:
```bash
./scripts/seed-questions.sh
```

### Seed Initial Data (Certifications & Knowledge Areas):
```bash
psql -d pmp_app -f backend/database/seeds/001_initial_data.sql
```

---

## 📊 What's Included

### Certifications:
- ✅ Project Management Professional (PMP)

### Knowledge Areas (10):
1. Project Integration Management
2. Project Scope Management
3. Project Schedule Management
4. Project Cost Management
5. Project Quality Management
6. Project Resource Management
7. Project Communications Management
8. Project Risk Management
9. Project Procurement Management
10. Project Stakeholder Management

### Questions (15):
- **Integration Management:** 2 questions
- **Scope Management:** 2 questions
- **Schedule Management:** 2 questions
- **Cost Management:** 2 questions
- **Quality Management:** 2 questions
- **Resource Management:** 1 question
- **Communications Management:** 1 question
- **Risk Management:** 1 question
- **Procurement Management:** 1 question
- **Stakeholder Management:** 1 question

---

## 🔍 Verify Seeded Data

### Check Questions:
```bash
psql -d pmp_app -c "SELECT COUNT(*) FROM questions;"
```

### Check Answers:
```bash
psql -d pmp_app -c "SELECT COUNT(*) FROM answers;"
```

### View Questions by Knowledge Area:
```bash
psql -d pmp_app -c "
SELECT 
    ka.name as knowledge_area,
    COUNT(q.id) as question_count
FROM knowledge_areas ka
LEFT JOIN questions q ON ka.id = q.knowledge_area_id
GROUP BY ka.name
ORDER BY ka.\"order\";
"
```

### View Sample Questions:
```bash
psql -d pmp_app -c "
SELECT 
    ka.name as knowledge_area,
    LEFT(q.question_text, 60) || '...' as question,
    q.difficulty
FROM questions q
JOIN knowledge_areas ka ON q.knowledge_area_id = ka.id
LIMIT 10;
"
```

---

## 📝 Question Structure

Each question includes:
- **Question Text:** The actual question
- **Explanation:** Why the correct answer is correct
- **Difficulty:** Easy, Medium, or Hard
- **4 Answer Options:** One correct, three incorrect
- **Knowledge Area:** One of the 10 PMP knowledge areas

---

## ➕ Add More Questions

### Method 1: Add to SQL File

Edit `backend/database/seeds/002_pmp_questions.sql` and add more questions following the same pattern.

### Method 2: Use API

If the backend is running, you can add questions via the API:

```bash
# Get auth token first
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pmpapp.com","password":"admin123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# Create a question
curl -X POST http://localhost:3001/api/questions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "questionText": "Your question text here",
    "knowledgeAreaId": "knowledge-area-uuid",
    "difficulty": "medium",
    "answers": [
      {"answerText": "Option A", "isCorrect": false},
      {"answerText": "Option B", "isCorrect": true},
      {"answerText": "Option C", "isCorrect": false},
      {"answerText": "Option D", "isCorrect": false}
    ],
    "explanation": "Explanation of the correct answer"
  }'
```

### Method 3: Import CSV

Use the import/export feature in the web admin:
1. Login to http://localhost:3000
2. Go to Questions page
3. Click "Import Questions"
4. Upload a CSV file with questions

---

## 🗑️ Clear Seeded Data

### Remove All Questions:
```bash
psql -d pmp_app -c "DELETE FROM answers; DELETE FROM questions;"
```

### Reset Everything:
```bash
psql -d pmp_app -c "
DELETE FROM user_answers;
DELETE FROM bookmarks;
DELETE FROM mock_exams;
DELETE FROM answers;
DELETE FROM questions;
DELETE FROM user_progress;
"
```

---

## 📚 Sample Questions Included

The seed file includes questions on:
- Project Charter and Integration Management
- Scope Statement and Scope Creep
- Critical Path and Milestones
- EAC, CPI, and Cost Performance
- Quality Assurance vs Quality Control
- RACI Matrix
- Communication Channels
- Risk vs Issue
- Contract Types
- Stakeholder Engagement

---

## 🎯 Next Steps

1. **View Questions:**
   - Web Admin: http://localhost:3000 → Questions
   - API: `GET /api/questions`

2. **Practice Questions:**
   - Mobile App: Browse and answer questions
   - Track your progress

3. **Take Mock Exams:**
   - Start a mock exam from the mobile app
   - Complete all questions
   - View your score

---

## 📖 Related Documentation

- `CREATE_ADMIN.md` - Create admin user
- `API_ENDPOINTS.md` - API documentation
- `HOW_TO_TEST.md` - Testing guide

