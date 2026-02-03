# 🔐 Create Admin User

Guide to create an admin user for the PMP Exam Prep App.

---

## ✅ Admin User Created!

**Default Admin Credentials:**
- **Email:** `admin@pmpapp.com`
- **Password:** `admin123`

---

## 🚀 Quick Create (Recommended)

### Method 1: Using Script (Easiest)

```bash
./scripts/create-admin-simple.sh
```

Or with custom credentials:
```bash
./scripts/create-admin-simple.sh your-email@example.com your-password
```

### Method 2: Using API

1. **Start the backend server:**
   ```bash
   cd backend/server
   npm run dev
   ```

2. **Register a user:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@pmpapp.com",
       "password": "admin123",
       "firstName": "Admin",
       "lastName": "User"
     }'
   ```

3. **Update role to admin:**
   ```bash
   # Connect to database
   psql -d pmp_app
   
   # Update role
   UPDATE users SET role='admin', subscription_tier='premium' 
   WHERE email='admin@pmpapp.com';
   ```

---

## 📝 Manual SQL Method

If you prefer to create directly in the database:

```sql
-- Hash password first (use Node.js or Python with bcrypt)
-- Then insert:

INSERT INTO users (id, email, password_hash, first_name, last_name, role, subscription_tier, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'admin@pmpapp.com',
    '$2b$10$YOUR_HASHED_PASSWORD_HERE',  -- Replace with actual hash
    'Admin',
    'User',
    'admin',
    'premium',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = 'admin',
    updated_at = NOW();
```

---

## 🔍 Verify Admin User

```bash
# Check if admin exists
psql -d pmp_app -c "SELECT email, role, subscription_tier FROM users WHERE role='admin';"
```

Or test login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pmpapp.com",
    "password": "admin123"
  }'
```

---

## 🌐 Login to Web Admin

1. **Open:** http://localhost:3000
2. **Login with:**
   - Email: `admin@pmpapp.com`
   - Password: `admin123`

---

## 🔒 Change Admin Password

### Via API (if logged in as admin):
```bash
# First login to get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pmpapp.com","password":"admin123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# Update password (if endpoint exists)
curl -X PUT http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"password": "new-password"}'
```

### Via SQL:
```sql
-- Hash new password first, then:
UPDATE users 
SET password_hash = '$2b$10$NEW_HASHED_PASSWORD'
WHERE email = 'admin@pmpapp.com';
```

---

## ⚠️ Security Notes

1. **Change default password** in production!
2. **Use strong passwords** (min 8 characters)
3. **Don't commit** admin credentials to git
4. **Use environment variables** for sensitive data

---

## 🐛 Troubleshooting

### "User already exists"
The script will update the existing user to admin role.

### "Database connection failed"
- Check `backend/server/.env` has correct database credentials
- Ensure PostgreSQL is running
- Verify database `pmp_app` exists

### "bcrypt not found"
- Install: `cd backend/server && npm install`
- Or use the API method (backend must be running)

---

## 📚 Related

- `START_WEB_ADMIN.md` - How to start web admin
- `API_ENDPOINTS.md` - API documentation
- `HOW_TO_TEST.md` - Testing guide



