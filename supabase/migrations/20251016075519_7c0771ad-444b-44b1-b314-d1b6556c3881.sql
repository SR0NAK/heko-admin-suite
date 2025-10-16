-- Add INSERT policy for profiles table to allow users to create their own profile during signup
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Also update the restrictive ALL policy to be more specific
-- Drop the overly restrictive policy
DROP POLICY IF EXISTS "Deny unauthenticated access to profiles" ON public.profiles;

-- Add a more specific policy for unauthenticated users
CREATE POLICY "Deny unauthenticated access to profiles" 
ON public.profiles 
FOR ALL
TO anon
USING (false);