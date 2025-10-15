-- Make user_id nullable in vendors table to allow vendor creation without auth user
ALTER TABLE public.vendors ALTER COLUMN user_id DROP NOT NULL;

-- Make user_id nullable in delivery_partners table to allow partner creation without auth user
ALTER TABLE public.delivery_partners ALTER COLUMN user_id DROP NOT NULL;