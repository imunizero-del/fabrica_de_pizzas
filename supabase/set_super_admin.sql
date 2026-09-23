-- =====================================================
-- SUPER ADMIN SETUP
-- Usuário: fabricadepizzas@gmail.com
-- UUID:    bbe4534b-e607-4310-96cc-98dae72c4e2a
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- (Dashboard → SQL Editor → New query)
-- =====================================================

-- 1. Confirmar e-mail e setar role super_admin no app_metadata
UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  raw_app_meta_data  = raw_app_meta_data || '{"role": "super_admin"}'::jsonb,
  updated_at         = NOW()
WHERE id = 'bbe4534b-e607-4310-96cc-98dae72c4e2a';

-- Verificar resultado
SELECT id, email, email_confirmed_at, raw_app_meta_data
FROM auth.users
WHERE id = 'bbe4534b-e607-4310-96cc-98dae72c4e2a';
