-- Create function to automatically add user to vendors or delivery_partners table
CREATE OR REPLACE FUNCTION public.handle_role_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
      user_profile.name || '''s Store', -- Default business name
      user_profile.phone,
      user_profile.email,
      'Address not set', -- Default address
      'active'::user_status
    )
    ON CONFLICT (user_id) DO NOTHING; -- Prevent duplicate entries
  END IF;

  -- If role is delivery, add to delivery_partners table
  IF NEW.role = 'delivery' THEN
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
    ON CONFLICT (user_id) DO NOTHING; -- Prevent duplicate entries
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on user_roles table
DROP TRIGGER IF EXISTS on_role_assigned ON public.user_roles;
CREATE TRIGGER on_role_assigned
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_role_assignment();

-- Add unique constraint to prevent duplicate vendor entries
ALTER TABLE public.vendors
DROP CONSTRAINT IF EXISTS vendors_user_id_unique;

ALTER TABLE public.vendors
ADD CONSTRAINT vendors_user_id_unique UNIQUE (user_id);

-- Add unique constraint to prevent duplicate delivery partner entries
ALTER TABLE public.delivery_partners
DROP CONSTRAINT IF EXISTS delivery_partners_user_id_unique;

ALTER TABLE public.delivery_partners
ADD CONSTRAINT delivery_partners_user_id_unique UNIQUE (user_id);