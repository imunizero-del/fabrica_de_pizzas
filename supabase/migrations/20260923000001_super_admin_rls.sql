-- =====================================================
-- MIGRATION: Super Admin Role — RLS
-- Substitui a verificação genérica de 'authenticated'
-- por verificação da role 'super_admin' no app_metadata
--
-- NOTA: Função criada em public (não auth) pois o
-- SQL Editor não tem permissão de escrita em auth.
-- =====================================================

-- Função helper no schema PUBLIC
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin',
    false
  );
$$;

-- =====================================================
-- Atualizar políticas admin em todas as tabelas
-- =====================================================

-- combos
DROP POLICY IF EXISTS "Admin CRUD combos" ON combos;
CREATE POLICY "Admin CRUD combos" ON combos
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- flavors
DROP POLICY IF EXISTS "Admin CRUD flavors" ON flavors;
CREATE POLICY "Admin CRUD flavors" ON flavors
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- combo_flavors
DROP POLICY IF EXISTS "Admin CRUD combo_flavors" ON combo_flavors;
CREATE POLICY "Admin CRUD combo_flavors" ON combo_flavors
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- schedule_dates
DROP POLICY IF EXISTS "Admin CRUD schedule_dates" ON schedule_dates;
CREATE POLICY "Admin CRUD schedule_dates" ON schedule_dates
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- time_slots
DROP POLICY IF EXISTS "Admin CRUD time_slots" ON time_slots;
CREATE POLICY "Admin CRUD time_slots" ON time_slots
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- orders
DROP POLICY IF EXISTS "Admin CRUD orders" ON orders;
CREATE POLICY "Admin CRUD orders" ON orders
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- order_items
DROP POLICY IF EXISTS "Admin CRUD order_items" ON order_items;
CREATE POLICY "Admin CRUD order_items" ON order_items
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- order_item_flavors
DROP POLICY IF EXISTS "Admin CRUD order_item_flavors" ON order_item_flavors;
CREATE POLICY "Admin CRUD order_item_flavors" ON order_item_flavors
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
