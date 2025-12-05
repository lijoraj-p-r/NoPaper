# 🚀 Quick Guide: Authorization in Swagger UI

## What to Fill in Authorization Header

```
Bearer YOUR_JWT_TOKEN_HERE
```

---

## Get Token (2 Steps)

### 1. Login First
- Go to `POST /login` in Swagger UI
- Click "Try it out"
- Enter:
  ```json
  {
    "email": "admin@nopaper.com",
    "password": "admin123"
  }
  ```
- Click "Execute"
- **Copy the `access_token`** from response

### 2. Use Token
- Go to `POST /admin/books`
- In `authorization` header field, enter:
  ```
  Bearer <paste-your-token-here>
  ```
- Fill other fields and upload!

---

## Example

**Token from login:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "role": "admin"
}
```

**What to put in authorization header:**
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Remember:** `Bearer` + space + your token!

