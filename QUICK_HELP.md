# ❓ Quick Help Guide

Common questions and answers for the PMP Exam Prep App.

---

## 🚀 How to Start Everything

### All Services at Once:

**Terminal 1 - Backend:**
```bash
cd backend/server
npm run dev
```

**Terminal 2 - Mobile:**
```bash
cd mobile
npm start
# Press 'i' for iOS or 'a' for Android
```

**Terminal 3 - Web Admin:**
```bash
cd web-admin
npm run dev
```

---

## 🌐 How to Access

- **Backend API:** http://localhost:3001
- **Web Admin:** http://localhost:3000
- **Mobile App:** Open in simulator (press 'i' or 'a')

---

## 🔐 How to Login

### Web Admin:
- Email: `admin@pmpapp.com`
- Password: `admin123`

### Mobile App:
- Register a new account, or
- Use existing credentials

---

## 🧪 How to Test

### Quick API Test:
```bash
./scripts/quick-test.sh
```

### Manual Test:
```bash
# Health check
curl http://localhost:3001/health

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234","firstName":"Test","lastName":"User"}'
```

---

## 🐛 How to Fix Common Issues

### Port Already in Use:
```bash
# Kill process on port
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Dependencies Missing:
```bash
cd backend/server && npm install
cd ../mobile && npm install
cd ../web-admin && npm install
```

### Node Version Wrong:
```bash
source ~/.nvm/nvm.sh
nvm use 20
```

---

## 📚 More Help

- `START_APP.md` - How to run app and simulator
- `START_WEB_ADMIN.md` - Web admin guide
- `HOW_TO_TEST.md` - Complete testing guide
- `API_ENDPOINTS.md` - API documentation
- `TROUBLESHOOTING.md` - Common issues and fixes

---

## 💡 Quick Commands

```bash
# Test backend
curl http://localhost:3001/health

# View API info
curl http://localhost:3001/

# Start all services
./RUN_NOW.sh
```

---

Need specific help? Ask:
- "How to register a user?"
- "How to create questions?"
- "How to view analytics?"
- "How to deploy?"



