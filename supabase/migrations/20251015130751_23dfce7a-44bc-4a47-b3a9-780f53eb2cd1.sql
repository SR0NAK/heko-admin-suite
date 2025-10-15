-- Fix the app_role enum and the trigger function that's using 'delivery' instead of 'delivery_partner'

-- Step 1: Drop the view that depends on the role column
DROP VIEW IF EXISTS user_roles_with_details;

-- Step 2: Temporarily convert column to text
ALTER TABLE user_roles ALTER COLUMN role TYPE text;

-- Step 3: Drop and recreate the enum with correct values
DROP TYPE IF EXISTS app_role CASCADE;
CREATE TYPE app_role AS ENUM ('admin', 'vendor', 'delivery_partner', 'user');

-- Step 4: Restore the column type
ALTER TABLE user_roles ALTER COLUMN role TYPE app_role USING role::app_role;

-- Step 5: Recreate the view
CREATE OR REPLACE VIEW user_roles_with_details AS
SELECT 
  ur.id,
  ur.user_id,
  ur.role,
  ur.created_at,
  p.name,
  p.email
FROM user_roles ur
LEFT JOIN profiles p ON ur.user_id = p.id;

-- Step 6: Fix the handle_role_assignment function to use 'delivery_partner' instead of 'delivery'
CREATE OR REPLACE FUNCTION public.handle_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_profile RECORD;
BEGIN
  -- Get user profile details
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- If role is vendor, add to vendors table
  IF NEW.role = 'vendor' THEN
    INSERT INTO public.vendors (
      user_id,
      owner_name,
      business_name,
      phone,
      email,
      address,
      status
    )
    VALUES (
      NEW.user_id,
      user_profile.name,
      user_profile.name || '''s Store',
      user_profile.phone,
      user_profile.email,
      'Address not set',
      'active'::user_status
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  -- If role is delivery_partner, add to delivery_partners table
  IF NEW.role = 'delivery_partner' THEN
    INSERT INTO public.delivery_partners (
      user_id,
      name,
      phone,
      email,
      status
    )
    VALUES (
      NEW.user_id,
      user_profile.name,
      user_profile.phone,
      user_profile.email,
      'active'::user_status
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;