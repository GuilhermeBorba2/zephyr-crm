-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own activities" ON activities;
DROP POLICY IF EXISTS "Anyone can view activity types" ON activity_types;

-- Enable RLS for activities table
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies for activities
CREATE POLICY "Users can manage their own activities"
  ON activities FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create activity types table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for activity_types
ALTER TABLE activity_types ENABLE ROW LEVEL SECURITY;

-- Create policy for activity_types
CREATE POLICY "Anyone can view activity types"
  ON activity_types FOR SELECT
  TO authenticated
  USING (true);

-- Insert default activity types
INSERT INTO activity_types (name, icon, color) VALUES
  ('Chamada', 'phone', '#3B82F6'),
  ('Reunião', 'users', '#10B981'),
  ('Tarefa', 'check-square', '#F59E0B'),
  ('Prazo', 'clock', '#EF4444'),
  ('E-mail', 'mail', '#8B5CF6'),
  ('Almoço', 'coffee', '#6B7280')
ON CONFLICT (name) DO UPDATE SET
  icon = EXCLUDED.icon,
  color = EXCLUDED.color;