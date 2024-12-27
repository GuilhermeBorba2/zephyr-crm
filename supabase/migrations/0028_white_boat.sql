-- Create activity types table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type_id uuid REFERENCES activity_types(id),
  due_date timestamptz,
  due_time text,
  lead_id uuid REFERENCES leads(id),
  client_id uuid REFERENCES clients(id),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE activity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view activity types"
  ON activity_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own activities"
  ON activities FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert default activity types
INSERT INTO activity_types (name, icon, color) VALUES
  ('Chamada', 'phone', '#3B82F6'),
  ('Reunião', 'users', '#10B981'), 
  ('Tarefa', 'check-square', '#F59E0B'),
  ('Prazo', 'clock', '#EF4444'),
  ('E-mail', 'mail', '#8B5CF6'),
  ('Almoço', 'coffee', '#6B7280');

-- Create indexes
CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities(user_id);
CREATE INDEX IF NOT EXISTS activities_type_id_idx ON activities(type_id);
CREATE INDEX IF NOT EXISTS activities_due_date_idx ON activities(due_date);