-- 1. Create Houses Table
CREATE TABLE houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text, -- General suburb or identifier
  status text NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create User House Assignments Table
CREATE TABLE user_house_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  house_id uuid NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES users(id),
  assigned_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL CHECK (status IN ('active', 'inactive')),
  UNIQUE(user_id, house_id)
);

-- 3. Create Shifts Table
CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id uuid NOT NULL REFERENCES houses(id),
  user_id uuid NOT NULL REFERENCES users(id),
  shift_type text NOT NULL CHECK (shift_type IN ('AM', 'PM', 'Night', 'Custom')),
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  status text NOT NULL CHECK (status IN ('active', 'submitted', 'cancelled')),
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_house_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Houses: Users can only read houses they are assigned to (if status is active). 
-- Admins/Managers can read all houses.
CREATE POLICY "Users can view assigned houses" ON houses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_house_assignments uha 
      WHERE uha.house_id = houses.id 
      AND uha.user_id = auth.uid() 
      AND uha.status = 'active'
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

-- User House Assignments: Users can read their own assignments. Admins/Managers can read all.
CREATE POLICY "Users can view their own house assignments" ON user_house_assignments
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

-- Shifts: Users can view shifts for houses they are assigned to.
CREATE POLICY "Users can view shifts for their assigned houses" ON shifts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_house_assignments uha
      WHERE uha.house_id = shifts.house_id
      AND uha.user_id = auth.uid()
      AND uha.status = 'active'
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

-- Shifts: Users can insert shifts for themselves if they are assigned to the house.
CREATE POLICY "Users can insert their own shifts" ON shifts
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND 
    EXISTS (
      SELECT 1 FROM user_house_assignments uha
      WHERE uha.house_id = shifts.house_id
      AND uha.user_id = auth.uid()
      AND uha.status = 'active'
    )
  );

-- Shifts: Users can update their own active shifts.
CREATE POLICY "Users can update their own active shifts" ON shifts
  FOR UPDATE
  USING (
    user_id = auth.uid() AND status = 'active'
  );

-- 5. Trigger to prevent duplicate active shifts for a user
CREATE OR REPLACE FUNCTION check_duplicate_active_shift()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    IF EXISTS (
      SELECT 1 FROM shifts 
      WHERE user_id = NEW.user_id 
      AND status = 'active' 
      AND id != NEW.id -- In case of update
    ) THEN
      RAISE EXCEPTION 'User already has an active shift.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_active_shift
BEFORE INSERT OR UPDATE ON shifts
FOR EACH ROW
EXECUTE FUNCTION check_duplicate_active_shift();
