-- 1. Create Checklist Templates Table
CREATE TABLE checklist_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id uuid REFERENCES houses(id), -- Null means global default for all houses
  shift_type text CHECK (shift_type IN ('AM', 'PM', 'Night', 'Custom')), -- Null means all shifts
  section text NOT NULL, -- e.g. 'Medication', 'Housekeeping', 'Stock'
  item_name text NOT NULL,
  description text,
  is_required boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create Checklist Responses Table
CREATE TABLE checklist_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  checklist_template_id uuid NOT NULL REFERENCES checklist_templates(id),
  status text NOT NULL CHECK (status IN ('done', 'not_done', 'not_applicable')),
  comment text,
  completed_by uuid NOT NULL REFERENCES users(id),
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT comment_required_when_not_done CHECK (status != 'not_done' OR comment IS NOT NULL)
);

-- Unique constraint so an item is only answered once per shift
ALTER TABLE checklist_responses ADD CONSTRAINT unique_shift_item UNIQUE(shift_id, checklist_template_id);

-- Enable RLS
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_responses ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Checklist Templates: Anyone authenticated can view active templates.
CREATE POLICY "Users can view active templates" ON checklist_templates
  FOR SELECT
  USING (status = 'active');

-- Checklist Responses: Users can view responses for their assigned houses.
CREATE POLICY "Users can view responses for their shifts" ON checklist_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM shifts
      JOIN user_house_assignments uha ON shifts.house_id = uha.house_id
      WHERE shifts.id = checklist_responses.shift_id
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

-- Checklist Responses: Users can insert/update responses for their own active shifts.
CREATE POLICY "Users can insert responses for their active shifts" ON checklist_responses
  FOR INSERT
  WITH CHECK (
    completed_by = auth.uid() 
    AND 
    EXISTS (
      SELECT 1 FROM shifts
      WHERE shifts.id = shift_id
      AND shifts.user_id = auth.uid()
      AND shifts.status = 'active'
    )
  );

CREATE POLICY "Users can update responses for their active shifts" ON checklist_responses
  FOR UPDATE
  USING (
    completed_by = auth.uid() 
    AND 
    EXISTS (
      SELECT 1 FROM shifts
      WHERE shifts.id = shift_id
      AND shifts.user_id = auth.uid()
      AND shifts.status = 'active'
    )
  );
