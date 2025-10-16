-- Create address type enum
CREATE TYPE public.address_type AS ENUM ('home', 'work', 'other');

-- Add new columns to user_addresses
ALTER TABLE public.user_addresses
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS type address_type,
ADD COLUMN IF NOT EXISTS other_label text,
ADD COLUMN IF NOT EXISTS landmark text,
ADD COLUMN IF NOT EXISTS lat numeric,
ADD COLUMN IF NOT EXISTS lng numeric;

-- Copy existing latitude/longitude to lat/lng if they exist
UPDATE public.user_addresses
SET lat = latitude, lng = longitude
WHERE latitude IS NOT NULL OR longitude IS NOT NULL;

-- Drop old columns
ALTER TABLE public.user_addresses
DROP COLUMN IF EXISTS latitude,
DROP COLUMN IF EXISTS longitude,
DROP COLUMN IF EXISTS label;

-- Make required columns NOT NULL (set defaults for existing rows first)
UPDATE public.user_addresses
SET name = 'Not Set' WHERE name IS NULL;

UPDATE public.user_addresses
SET phone = '0000000000' WHERE phone IS NULL;

UPDATE public.user_addresses
SET type = 'home' WHERE type IS NULL;

ALTER TABLE public.user_addresses
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN phone SET NOT NULL,
ALTER COLUMN type SET NOT NULL;