# 👤 Add Admin User to Database

## Method 1: Using Python Script (Recommended)

### Step 1: Generate SQL Query

Run the script to generate the password hash and SQL query:

```powershell
cd backend
..\venv\Scripts\Activate.ps1
python ..\add-admin-user.py --email admin@nopaper.com --password admin123
```

This will output:
- The password hash
- The SQL query ready to copy/paste

### Step 2: Add to Database (Option A - Python)

To add directly using Python:

```powershell
python ..\add-admin-user.py --email admin@nopaper.com --password admin123 --add
```

### Step 2: Add to Database (Option B - SQL)

Copy the SQL query from the script output and run it in MySQL:

```sql
INSERT INTO users (email, password_hash, role, created_at)
VALUES (
    'admin@nopaper.com',
    '$2b$12$...',  -- Generated hash from script
    'admin',
    NOW()
);
```

---

## Method 2: Manual SQL (If you have the hash)

### Step 1: Generate Password Hash

Run this Python code to get the hash:

```python
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
password = "admin123"  # Your admin password (min 7 chars)
hash = pwd_context.hash(password)
print(hash)
```

### Step 2: Insert into Database

```sql
INSERT INTO users (email, password_hash, role, created_at)
VALUES (
    'admin@nopaper.com',
    'PASTE_HASH_HERE',
    'admin',
    NOW()
);
```

---

## Method 3: Update Existing User to Admin

If you already have a user and want to make them admin:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

---

## Quick Example

**Email:** admin@nopaper.com  
**Password:** admin123 (7+ characters)

**SQL Query:**
```sql
-- First generate hash using Python script, then:
INSERT INTO users (email, password_hash, role, created_at)
VALUES (
    'admin@nopaper.com',
    '$2b$12$YOUR_GENERATED_HASH_HERE',
    'admin',
    NOW()
);
```

---

## Verify Admin User

Check if admin was created:

```sql
SELECT id, email, role, created_at 
FROM users 
WHERE role = 'admin';
```

---

## Login as Admin

After creating the admin user:

1. Go to http://localhost:3000/login
2. Enter the admin email and password
3. You'll be redirected to the Admin Dashboard
4. You can now upload books!

---

## Password Requirements

- **Minimum:** 7 characters
- **Maximum:** 72 bytes
- **Example:** `admin123`, `Admin@123`, `password123`

---

## Troubleshooting

### "Password must be at least 7 characters"
- Use a password with 7+ characters

### "Cannot connect to database"
- Check MySQL is running
- Verify credentials in `backend/db.py`
- Ensure database `online_bookshop` exists

### "Email already registered"
- Use a different email
- Or update existing user: `UPDATE users SET role = 'admin' WHERE email = '...'`

---

**Need help?** Run the Python script - it will guide you through the process!

