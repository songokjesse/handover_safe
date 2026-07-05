-- Create Users Table linked to Supabase Auth
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('support_worker', 'team_leader', 'manager', 'admin')),
  status text NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch the user role safely to avoid infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM users WHERE id = user_id;
$$ LANGUAGE sql STABLE;

-- RLS Policies for SELECT
CREATE POLICY "Allow individuals to read their own profile"
ON users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Allow privileged users to read all profiles"
ON users
FOR SELECT
USING (get_user_role(auth.uid()) IN ('admin', 'manager', 'team_leader'));

-- RLS Policies for WRITE (INSERT, UPDATE, DELETE)
CREATE POLICY "Allow admin users full access to manage profiles"
ON users
FOR ALL
USING (get_user_role(auth.uid()) = 'admin')
WITH CHECK (get_user_role(auth.uid()) = 'admin');
