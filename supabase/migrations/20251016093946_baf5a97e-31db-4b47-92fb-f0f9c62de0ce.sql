-- Drop the foreign key constraint from profiles table since we're using hybrid authentication
-- that doesn't rely on auth.users table
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add a comment explaining the hybrid auth approach
COMMENT ON TABLE public.profiles IS 'Customer profiles using hybrid authentication (phone-based OTP). Not linked to auth.users table.';