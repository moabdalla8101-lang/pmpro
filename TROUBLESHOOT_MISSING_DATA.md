# 🔍 Troubleshooting: Data Disappeared

If you're seeing empty screens or missing data, follow these steps:

---

## ✅ Quick Check: Is Data Still There?

### Check Database:
```bash
psql -d pmp_app -c "SELECT COUNT(*) FROM questions; SELECT COUNT(*) FROM knowledge_areas;"
```

### Check API:
```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pmpapp.com","password":"admin123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# Test questions
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/questions

# Test knowledge areas
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/knowledge-areas
```

---

## 🔧 Common Fixes

### 1. Clear Browser Cache

**Web Admin:**
- Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows) to hard refresh
- Or clear browser cache completely

**Mobile App:**
- Close and reopen the app
- Or clear app data

### 2. Check Authentication

Make sure you're logged in:
- Web Admin: http://localhost:3001/api/auth/login
- Check browser console for 401 errors

### 3. Restart Services

```bash
# Stop backend
lsof -ti:3001 | xargs kill -9

# Restart backend
cd backend/server
npm run dev

# Restart web admin
cd web-admin
npm run dev
```

### 4. Check Browser Console

Open browser DevTools (F12) and check:
- Network tab: Are API calls successful?
- Console tab: Any JavaScript errors?
- Look for 401 (unauthorized) or 500 (server error) responses

### 5. Verify API Response Format

The API should return:
```json
{
  "questions": [
    {
      "id": "...",
      "questionText": "...",
      "answers": [
        {"answerText": "...", "isCorrect": true},
        ...
      ]
    }
  ]
}
```

If you see `question_text` instead of `questionText`, the server needs to reload.

---

## 🐛 Specific Issues

### Web Admin Shows Empty

1. **Check if logged in:**
   - Look for token in localStorage
   - Try logging out and back in

2. **Check API calls:**
   - Open DevTools → Network tab
   - Look for `/api/questions` or `/api/knowledge-areas`
   - Check if they return 200 status

3. **Check for errors:**
   - Console tab for JavaScript errors
   - Network tab for failed requests

### Mobile App Shows Empty

1. **Check API URL:**
   - Verify `EXPO_PUBLIC_API_URL` or API base URL
   - Should be: `http://localhost:3001` (iOS) or `http://10.0.2.2:3001` (Android)

2. **Check authentication:**
   - Make sure you're logged in
   - Token should be stored in AsyncStorage

3. **Restart app:**
   - Close completely and reopen
   - Or reload: Shake device → Reload

---

## 🔄 Quick Reset

If nothing works, try a complete reset:

```bash
# 1. Restart backend
cd backend/server
npm run dev

# 2. Restart web admin
cd web-admin
npm run dev

# 3. Clear browser cache
# Or use incognito/private window

# 4. Re-login
# Login again with admin credentials
```

---

## 📊 Verify Data is There

```bash
# Check database directly
psql -d pmp_app <<EOF
SELECT COUNT(*) as questions FROM questions;
SELECT COUNT(*) as answers FROM answers;
SELECT COUNT(*) as knowledge_areas FROM knowledge_areas;
SELECT ka.name, COUNT(q.id) as question_count
FROM knowledge_areas ka
LEFT JOIN questions q ON ka.id = q.knowledge_area_id
GROUP BY ka.name
ORDER BY ka."order";
EOF
```

---

## 💡 Still Not Working?

1. **Check server logs:**
   - Look at the terminal where `npm run dev` is running
   - Look for errors or warnings

2. **Check network:**
   - Make sure backend is accessible
   - Test: `curl http://localhost:3001/health`

3. **Check authentication:**
   - Make sure token is valid
   - Try logging in again

4. **Re-seed data:**
   ```bash
   ./scripts/seed-questions.sh
   ```

---

## ✅ Expected Results

After fixes, you should see:
- **Web Admin:** Questions page shows 15 questions
- **Web Admin:** Knowledge Areas page shows 10 areas
- **Mobile App:** Can browse and answer questions
- **API:** Returns data in camelCase format

---

If you're still having issues, check:
- Server terminal for errors
- Browser console for JavaScript errors
- Network tab for failed API calls



