# 💳 Payment Setup Guide

## UPI Payment Integration

The system now redirects to UPI payment and sends email notifications.

---

## Configuration

### Email Setup (Gmail)

1. **Enable App Password:**
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Generate App Password for "Mail"
   - Copy the 16-character password

2. **Set Environment Variable:**
   ```powershell
   $env:EMAIL_PASSWORD="your-16-character-app-password"
   ```
   
   Or create `.env` file in `backend/` folder:
   ```
   EMAIL_PASSWORD=your-16-character-app-password
   ```

### UPI Configuration

- **UPI ID:** `lijorajpr321@okaxis` (configured in code)
- **Admin Email:** `lijorajpr321@gmail.com` (configured in code)

---

## How It Works

### 1. User Clicks "Buy"
- Creates order with "pending" status
- Returns UPI payment URL

### 2. UPI Payment Redirect
- Opens UPI app with payment details
- Amount, UPI ID, and order ID pre-filled

### 3. Payment Confirmation
- User confirms payment completion
- System verifies and updates order to "paid"

### 4. Email Notification
- Sends email to `lijorajpr321@gmail.com` with:
  - Order ID
  - User email
  - Book title
  - Amount paid
  - Payment time
  - Status

---

## Payment Flow

```
User clicks Buy
    ↓
Order created (pending)
    ↓
UPI payment URL generated
    ↓
User redirected to UPI app
    ↓
User completes payment
    ↓
User confirms payment
    ↓
Order status → "paid"
    ↓
Email sent to admin
    ↓
User can download book
```

---

## Testing

### Without Email Setup:
- Payment will still work
- Email sending will be skipped (logged to console)

### With Email Setup:
- Payment confirmation emails sent automatically
- Check `lijorajpr321@gmail.com` for payment notifications

---

## Troubleshooting

### Email Not Sending:
- Check EMAIL_PASSWORD is set correctly
- Verify App Password is correct (16 characters)
- Check Gmail account has 2-Step Verification enabled

### UPI Not Opening:
- Ensure UPI app is installed
- Check UPI ID format: `lijorajpr321@okaxis`

---

**Payment system is ready!** 🎉

