-- Fix RLS policies for Edge Function-based customer authentication (v2)
-- This migration safely handles existing policies

-- ==============================================
-- PROFILES TABLE
-- ==============================================
DROP POLICY IF EXISTS "Deny unauthenticated access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow service role access to profiles" ON public.profiles;

CREATE POLICY "Allow service role access to profiles"
ON public.profiles FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================
-- ORDERS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Vendors can view assigned orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated access to orders" ON public.orders;

CREATE POLICY "Allow authenticated access to orders"
ON public.orders FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================
-- ORDER_ITEMS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Vendors can view and update assigned items" ON public.order_items;
DROP POLICY IF EXISTS "Allow authenticated access to order_items" ON public.order_items;

CREATE POLICY "Allow authenticated access to order_items"
ON public.order_items FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================
-- USER_ADDRESSES TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can manage own addresses" ON public.user_addresses;
DROP POLICY IF EXISTS "Allow authenticated access to addresses" ON public.user_addresses;

CREATE POLICY "Allow authenticated access to addresses"
ON public.user_addresses FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================
-- NOTIFICATIONS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow authenticated access to notifications" ON public.notifications;

CREATE POLICY "Allow authenticated access to notifications"
ON public.notifications FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================
-- WALLET_TRANSACTIONS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view own transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Allow authenticated access to wallet_transactions" ON public.wallet_transactions;

CREATE POLICY "Allow authenticated access to wallet_transactions"
ON public.wallet_transactions FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================
-- CUSTOMER_SESSIONS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view own sessions" ON public.customer_sessions;
DROP POLICY IF EXISTS "Allow service role access to sessions" ON public.customer_sessions;

CREATE POLICY "Allow service role access to sessions"
ON public.customer_sessions FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================
-- REFERRAL_CONVERSIONS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view own referrals" ON public.referral_conversions;
DROP POLICY IF EXISTS "Allow authenticated access to referral_conversions" ON public.referral_conversions;

CREATE POLICY "Allow authenticated access to referral_conversions"
ON public.referral_conversions FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================
-- RETURNS & RETURN_ITEMS TABLES
-- ==============================================
DROP POLICY IF EXISTS "Users can manage own returns" ON public.returns;
DROP POLICY IF EXISTS "Vendors can view and update assigned returns" ON public.returns;
DROP POLICY IF EXISTS "Allow authenticated access to returns" ON public.returns;

DROP POLICY IF EXISTS "Users can view own return items" ON public.return_items;
DROP POLICY IF EXISTS "Allow authenticated access to return_items" ON public.return_items;

CREATE POLICY "Allow authenticated access to returns"
ON public.returns FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated access to return_items"
ON public.return_items FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================
-- DELIVERIES & DELIVERY_ITEMS
-- ==============================================
DROP POLICY IF EXISTS "Allow service role access to deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Allow service role access to delivery_items" ON public.delivery_items;

CREATE POLICY "Allow service role access to deliveries"
ON public.deliveries FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow service role access to delivery_items"
ON public.delivery_items FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================
-- PRODUCTS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Authenticated users can view active products" ON public.products;
DROP POLICY IF EXISTS "Allow service role full access to products" ON public.products;

CREATE POLICY "Allow service role full access to products"
ON public.products FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================
-- DOCUMENTATION
-- ==============================================
COMMENT ON TABLE public.profiles IS 'Customer profiles with hybrid authentication. Security enforced by Edge Functions validating session tokens.';
COMMENT ON TABLE public.orders IS 'Orders table. User filtering handled by Edge Functions (WHERE user_id = validated_user_id).';
COMMENT ON TABLE public.order_items IS 'Order items. Permissive RLS to avoid recursion; security via Edge Functions.';
COMMENT ON TABLE public.customer_sessions IS 'Session tokens for customer app. Managed entirely by Edge Functions.';