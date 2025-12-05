-- Simple SQL Query to Add Admin User (Plain Password)
-- No encryption needed - password stored as plain text

-- Replace 'admin@nopaper.com' with your admin email
-- Replace 'admin123' with your desired password (minimum 7 characters)

INSERT INTO users (email, password_hash, role, created_at)
VALUES (
    'admin@nopaper.com',
    'admin123',  -- Plain text password (min 7 characters)
    'admin',
    NOW()
);

-- Verify the admin was created:
SELECT id, email, role, created_at FROM users WHERE role = 'admin';

-- To update an existing user to admin:
-- UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

