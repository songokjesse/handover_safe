-- Ensure pgcrypto is enabled for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert a default admin user into Supabase Auth table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'e9b2512f-981f-4b08-8e6c-792f96e48c1e',
  'authenticated',
  'authenticated',
  'admin@handoversafe.com.au',
  crypt('AdminSecurePassword2026!', gen_salt('bf', 10)),
  now(),
  NULL,
  NULL,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"System Administrator"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert corresponding profile record into public users table
INSERT INTO public.users (
  id,
  full_name,
  email,
  role,
  status,
  created_at,
  updated_at
) VALUES (
  'e9b2512f-981f-4b08-8e6c-792f96e48c1e',
  'System Administrator',
  'admin@handoversafe.com.au',
  'admin',
  'active',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;
