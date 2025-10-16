# Customer App Authentication Integration Guide

This document explains how to integrate the hybrid authentication system for the HEKO Customer App using Edge Functions.

## Overview

The customer app uses a **phone-based OTP authentication** system that is separate from the admin panel's Supabase Auth. This allows customers to sign up and log in using only their phone number without requiring email/password.

## Architecture

- **Admin Panel**: Uses Supabase Auth with email/password
- **Customer App**: Uses custom phone OTP auth via Edge Functions with service role
- **RLS Policies**: Hybrid approach - Edge Functions use service role to bypass RLS, while customer operations use session tokens

## Available Edge Functions

### 1. Send OTP (`customer-send-otp`)
Generates and sends an OTP to the customer's phone number.

**Endpoint**: `POST /functions/v1/customer-send-otp`

**Request Body**:
```json
{
  "phone": "+1234567890"
}
```

**Response** (Development):
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "123456"  // Remove this in production
}
```

**Note**: In production, integrate with an SMS provider (Twilio, SNS, etc.) to actually send the OTP.

---

### 2. Verify OTP (`customer-verify-otp`)
Verifies the OTP and returns user info or indicates if signup is needed.

**Endpoint**: `POST /functions/v1/customer-verify-otp`

**Request Body**:
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

**Response** (Existing User):
```json
{
  "success": true,
  "isNewUser": false,
  "sessionToken": "uuid-session-token",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "referral_code": "HEKO123ABC",
    "virtual_wallet": 0,
    "actual_wallet": 0
  }
}
```

**Response** (New User):
```json
{
  "success": true,
  "isNewUser": true,
  "phone": "+1234567890"
}
```

---

### 3. Complete Signup (`customer-signup`)
Creates a new customer profile and returns session token.

**Endpoint**: `POST /functions/v1/customer-signup`

**Request Body**:
```json
{
  "phone": "+1234567890",
  "name": "John Doe",
  "email": "john@example.com",  // optional
  "referredBy": "HEKO123XYZ"    // optional referral code
}
```

**Response**:
```json
{
  "success": true,
  "sessionToken": "uuid-session-token",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "referral_code": "HEKO456DEF",
    "virtual_wallet": 0,
    "actual_wallet": 0
  }
}
```

---

### 4. Validate Session (`customer-validate-session`)
Validates a session token and returns user info.

**Endpoint**: `POST /functions/v1/customer-validate-session`

**Request Body**:
```json
{
  "sessionToken": "uuid-session-token"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "referral_code": "HEKO123ABC",
    "virtual_wallet": 0,
    "actual_wallet": 0
  }
}
```

---

## Implementation Flow

### Login/Signup Flow

```
1. User enters phone number
   ↓
2. Call customer-send-otp
   ↓
3. User receives OTP (SMS in production)
   ↓
4. User enters OTP
   ↓
5. Call customer-verify-otp
   ↓
6. If isNewUser = false:
   - Store sessionToken
   - Navigate to home screen
   
7. If isNewUser = true:
   - Show signup form (name, email, referral code)
   - Call customer-signup
   - Store sessionToken
   - Navigate to home screen
```

### Session Management

```typescript
// Store session token in AsyncStorage/localStorage
await AsyncStorage.setItem('sessionToken', response.sessionToken);

// On app launch, validate session
const sessionToken = await AsyncStorage.getItem('sessionToken');
if (sessionToken) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/customer-validate-session`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ sessionToken }),
    }
  );
  
  if (response.ok) {
    const data = await response.json();
    // User is authenticated, set user context
  } else {
    // Session expired, clear token and show login
    await AsyncStorage.removeItem('sessionToken');
  }
}
```

### Making Authenticated API Calls

For customer app API calls that require authentication, you have two options:

**Option 1: Use session token validation**
```typescript
// In your edge function that handles customer requests
const { sessionToken } = await req.json();

// Validate session
const { data: session } = await supabase
  .from('customer_sessions')
  .select('user_id, profiles(*)')
  .eq('session_token', sessionToken)
  .gte('expires_at', new Date().toISOString())
  .single();

if (!session) {
  return new Response(
    JSON.stringify({ error: 'Unauthorized' }),
    { status: 401 }
  );
}

// Use session.user_id for user-specific operations
const userId = session.user_id;
```

**Option 2: Pass session token in headers**
```typescript
// Customer app request
const response = await fetch(`${SUPABASE_URL}/functions/v1/your-function`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'X-Session-Token': sessionToken,  // Custom header
  },
  body: JSON.stringify({ /* your data */ }),
});

// In edge function
const sessionToken = req.headers.get('X-Session-Token');
// Validate as in Option 1
```

---

## Database Tables

### `otp_verifications`
Stores OTP codes temporarily (10 min expiry).

```sql
CREATE TABLE public.otp_verifications (
  id uuid PRIMARY KEY,
  phone text NOT NULL,
  otp text NOT NULL,
  verified boolean DEFAULT false,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

### `customer_sessions`
Stores customer session tokens (30 day expiry).

```sql
CREATE TABLE public.customer_sessions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id),
  session_token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

---

## Security Considerations

1. **Service Role Key**: Edge functions use `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS. Never expose this key to the client.

2. **Session Tokens**: 
   - Generated using `crypto.randomUUID()` for cryptographic randomness
   - 30-day expiry by default
   - Stored securely in client storage

3. **OTP Security**:
   - 6-digit random OTP
   - 10-minute expiry
   - One-time use (marked as verified after successful verification)
   - Auto-cleanup function available (`cleanup_expired_otps()`)

4. **Rate Limiting**: Consider implementing rate limiting on OTP generation to prevent abuse.

5. **SMS Provider**: In production, integrate with:
   - Twilio
   - AWS SNS
   - Firebase Cloud Messaging
   - Or any other SMS gateway

---

## Migration to Supabase Phone Auth (Future)

When ready to migrate to Supabase's native phone authentication:

1. Enable Phone Auth in Supabase Dashboard
2. Update edge functions to use `supabase.auth.signInWithOtp()`
3. Replace session token logic with Supabase JWT tokens
4. Update RLS policies to use `auth.uid()` instead of session validation
5. Migrate existing customer sessions to Supabase Auth users

---

## Testing

### Development Mode
In development, OTP is returned in the response for easy testing. Remove this in production:

```typescript
// In customer-send-otp/index.ts
return new Response(
  JSON.stringify({ 
    success: true, 
    message: 'OTP sent successfully',
    // Remove this line in production:
    otp: otp 
  }),
  { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
);
```

### Test Credentials
You can use any phone number format in development. Example: `+11234567890`

---

## Error Handling

All edge functions return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request (missing parameters, invalid OTP, etc.)
- `401`: Unauthorized (invalid/expired session)
- `500`: Server error

---

## Support

For questions or issues, refer to the main project documentation or contact the development team.
