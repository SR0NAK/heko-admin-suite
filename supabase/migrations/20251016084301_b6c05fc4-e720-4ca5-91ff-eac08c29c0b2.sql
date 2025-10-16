-- Add 'customer' role to app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'customer';

-- Create OTP verifications table
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  otp text NOT NULL,
  verified boolean DEFAULT false,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on otp_verifications (service role will bypass this)
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create customer sessions table
CREATE TABLE IF NOT EXISTS public.customer_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_customer_sessions_token ON public.customer_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_customer_sessions_user_id ON public.customer_sessions(user_id);

-- Enable RLS on customer_sessions
ALTER TABLE public.customer_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own sessions
CREATE POLICY "Users can view own sessions" 
ON public.customer_sessions 
FOR SELECT 
USING (user_id IN (
  SELECT id FROM public.profiles WHERE phone IN (
    SELECT phone FROM public.customer_sessions cs2 
    WHERE cs2.user_id = customer_sessions.user_id
  )
));

-- Update profiles RLS to allow service role insertions
-- The existing policies already allow authenticated users to insert their own profile
-- No changes needed as service role bypasses RLS

-- Update user_roles RLS to allow service role insertions
-- The existing policies already handle role viewing
-- No changes needed as service role bypasses RLS

-- Add index on profiles phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- Clean up expired OTPs (optional - can be run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.otp_verifications
  WHERE expires_at < now() - interval '1 day';
END;
$$;

-- Clean up expired sessions (optional - can be run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.customer_sessions
  WHERE expires_at < now();
END;
$$;