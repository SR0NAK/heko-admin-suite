-- Fix Missing RLS: Add explicit deny policies for unauthenticated access
-- 1. Deny unauthenticated access to profiles table
CREATE POLICY "Deny unauthenticated access to profiles"
ON public.profiles
FOR ALL
TO anon
USING (false);

-- 2. Deny unauthenticated access to delivery_partners table
CREATE POLICY "Deny unauthenticated access to delivery partners"
ON public.delivery_partners
FOR ALL
TO anon
USING (false);

-- Fix Public Data Exposure: Restrict system_settings table access
-- Remove the overly permissive public read policy
DROP POLICY IF EXISTS "Anyone can view settings" ON public.system_settings;

-- Create a restrictive policy for authenticated users only
CREATE POLICY "Authenticated users can view settings"
ON public.system_settings
FOR SELECT
TO authenticated
USING (true);

-- Fix Security Definer Functions: Add usage restrictions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;