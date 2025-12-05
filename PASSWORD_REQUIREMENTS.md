# Password Requirements

## Password Rules

- **Minimum Length**: 7 characters
- **Maximum Length**: 72 bytes (bcrypt limitation)
- **Characters**: Any characters are allowed

## Why 72 bytes?

Bcrypt, the password hashing algorithm used, has a hard limit of 72 bytes. This means:
- Most ASCII characters = 1 byte each (so 72 characters max)
- Some Unicode characters = 2-4 bytes each (so fewer characters allowed)

## Examples

✅ **Valid Passwords:**
- `password123` (11 characters, 11 bytes)
- `MyP@ssw0rd!` (11 characters, 11 bytes)
- `1234567` (7 characters, 7 bytes - minimum)

❌ **Invalid Passwords:**
- `123456` (6 characters - too short)
- Very long passwords over 72 bytes

## Error Messages

- **Too Short**: "Password must be at least 7 characters long"
- **Too Long**: "Password cannot be longer than 72 bytes"

