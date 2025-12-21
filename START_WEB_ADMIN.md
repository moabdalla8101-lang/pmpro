# 🖥️ How to Start the Web Admin (Backoffice)

The web admin is a React TypeScript application for managing the PMP Exam Prep app.

---

## 🚀 Quick Start

### Terminal 3 - Web Admin:

```bash
cd /Users/mohamed/Documents/pmpro/web-admin
source ~/.nvm/nvm.sh  # If using NVM
nvm use 20            # If using NVM
npm install           # First time only
npm run dev
```

**You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 🌐 Access the Web Admin

Once running, open your browser:

**http://localhost:3000**

---

## 🔐 Login Credentials

### Default Admin Account:
- **Email:** `admin@pmpapp.com`
- **Password:** `admin123`

⚠️ **Note:** You may need to create this admin user first via the API or database.

---

## 📋 Prerequisites

1. **Backend server must be running** on port 3001
   ```bash
   cd backend/server
   npm run dev
   ```

2. **Node.js 20+** installed
   ```bash
   node -v  # Should show v20.x.x
   ```

---

## 🎯 What You Can Do in Web Admin

- **Dashboard** - Overview of users, questions, analytics
- **User Management** - View and manage users
- **Question Management** - Create, edit, delete questions
- **Knowledge Areas** - Manage knowledge areas
- **Certifications** - Manage certifications
- **Analytics** - View app analytics and reports

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Not Installed

```bash
cd web-admin
npm install
```

### Can't Connect to Backend

1. **Check backend is running:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Check API URL in web-admin:**
   - Default: `http://localhost:3001`
   - Can be set via `VITE_API_URL` environment variable

### Build Errors

```bash
# Clear cache and reinstall
cd web-admin
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Environment Variables

Create a `.env` file in `web-admin/`:

```env
VITE_API_URL=http://localhost:3001
```

---

## 🎬 Complete Setup (All Services)

### Terminal 1 - Backend:
```bash
cd backend/server
npm run dev
```

### Terminal 2 - Mobile:
```bash
cd mobile
npm start
```

### Terminal 3 - Web Admin:
```bash
cd web-admin
npm run dev
```

Then open:
- **Web Admin:** http://localhost:3000
- **Mobile App:** Press 'i' in mobile terminal for simulator

---

## ✅ Verify It's Working

1. **Backend health check:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Web admin loads:**
   - Open http://localhost:3000
   - Should see login page

3. **Login works:**
   - Use admin credentials
   - Should redirect to dashboard

---

## 📚 Related Documentation

- `START_APP.md` - How to run mobile app
- `API_ENDPOINTS.md` - API documentation
- `HOW_TO_TEST.md` - Testing guide

