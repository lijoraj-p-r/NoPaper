# 🔐 Authorization Header Guide

## How to Fill the Authorization Header in Swagger UI

The authorization header requires a **Bearer Token** (JWT token) that you get after logging in.

---

## Step-by-Step Instructions

### Step 1: Get Your JWT Token

#### Option A: Login via Swagger UI

1. In Swagger UI, scroll to the **`POST /login`** endpoint
2. Click "Try it out"
3. Fill in the request body:
   ```json
   {
     "email": "admin@nopaper.com",
     "password": "admin123"
   }
   ```
4. Click "Execute"
5. Copy the `access_token` from the response:
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "token_type": "bearer",
     "role": "admin"
   }
   ```

#### Option B: Register New User

1. Use **`POST /register`** endpoint
2. Fill in email and password (min 7 characters)
3. Copy the `access_token` from response

---

### Step 2: Use the Token in Authorization Header

1. Go to **`POST /admin/books`** endpoint
2. In the **`authorization`** header field, enter:
   ```
   Bearer YOUR_TOKEN_HERE
   ```
   
   **Example:**
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJhZG1pbiIsImV4cCI6MTY5ODc2NTQzMn0.abc123...
   ```

3. **Important:** Include the word `Bearer` followed by a space, then your token

---

## Format

```
Bearer <your-jwt-token>
```

**Components:**
- `Bearer` - The authentication scheme (required)
- `<space>` - A single space
- `<your-jwt-token>` - The access_token from login/register response

---

## Example

If your token is: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Then in the authorization header field, enter:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Quick Test

1. **Login:**
   - Endpoint: `POST /login`
   - Body: `{"email": "admin@nopaper.com", "password": "admin123"}`
   - Copy the `access_token`

2. **Use Token:**
   - Endpoint: `POST /admin/books`
   - Authorization header: `Bearer <paste-token-here>`
   - Fill other fields and upload PDF

---

## Common Mistakes

❌ **Wrong:**
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (missing "Bearer")
- `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (lowercase "bearer" - might work but use "Bearer")
- `Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (colon instead of space)

✅ **Correct:**
- `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (correct format)

---

## Token Expiration

- Tokens expire after **60 minutes**
- If you get "401 Unauthorized", login again to get a new token

---

## Admin Access Required

- The `/admin/books` endpoint requires an admin role
- Make sure you login with an admin account
- Regular users cannot upload books

---

**Need an admin account?** See `add-admin-simple.sql` for SQL query to create admin user.

