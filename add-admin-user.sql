-- SQL Query to Add Admin User to NoPaper Database
-- Run this in MySQL command line or MySQL Workbench

-- First, you need to hash the password using bcrypt
-- Use the Python script below to generate the password hash

-- Example: If password is "admin123" (must be at least 7 characters)
-- The hash will be something like: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYq5q5q5q5q

-- Replace the values below:
-- - 'admin@nopaper.com' with your admin email
-- - 'YOUR_PASSWORD_HASH_HERE' with the bcrypt hash from the Python script

INSERT INTO users (email, password_hash, role, created_at)
VALUES (
    'admin@nopaper.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYq5q5q5q5q',  -- Replace with actual hash
    'admin',
    NOW()
);

-- To verify the admin was created:
SELECT id, email, role, created_at FROM users WHERE role = 'admin';

-- To update an existing user to admin:
-- UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

