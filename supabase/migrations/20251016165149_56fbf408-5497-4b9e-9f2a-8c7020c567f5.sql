-- Drop the existing foreign key constraint
ALTER TABLE public.user_addresses
DROP CONSTRAINT IF EXISTS user_addresses_user_id_fkey;

-- Add new foreign key constraint referencing profiles table
ALTER TABLE public.user_addresses
ADD CONSTRAINT user_addresses_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;