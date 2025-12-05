# 🔐 Simple Authentication Guide

## How Authentication Works Now

**No JWT tokens needed!** Just use email and password directly in headers.

---

## For Admin Endpoints (e.g., `/admin/books`)

### In Swagger UI:

1. Go to `POST /admin/books`
2. Fill in these **header fields**:
   - **`email`**: Your admin email (e.g., `admin@nopaper.com`)
   - **`password`**: Your admin password (e.g., `admin123`)
3. Fill in other fields (title, author, price, description, PDF file)
4. Click "Execute"

### Example Headers:

```
email: admin@nopaper.com
password: admin123
```

---

## For User Endpoints (e.g., `/buy`)

Same format - use email and password in headers:

```
email: user@example.com
password: userpassword123
```

---

## No More JWT Tokens!

- ❌ No need to login first
- ❌ No Bearer tokens
- ❌ No token expiration
- ✅ Just use email + password directly

---

## Quick Example

**Upload Book (Admin):**
- Endpoint: `POST /admin/books`
- Headers:
  - `email`: `admin@nopaper.com`
  - `password`: `admin123`
- Body: Fill title, author, price, description, PDF file

That's it! No tokens needed.

---

## Security Note

⚠️ **Important:** Passwords are sent in headers (plain text). This is simple but less secure than JWT tokens. Use HTTPS in production!

