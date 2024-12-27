/*
  # Pipeline and Activities Schema

  1. New Tables
    - pipeline_stages: Store sales pipeline stages
    - activities: Store all activities/tasks
    - activity_types: Store activity type definitions
*/

-- Create pipeline stages table
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  order_index integer NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create activity types table
CREATE TABLE IF NOT EXISTS activity_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type_id uuid REFERENCES activity_types(id),
  due_date timestamptz,
  completed_at timestamptz,
  lead_id uuid REFERENCES leads(id),
  client_id uuid REFERENCES clients(id),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their pipeline stages"
  ON pipeline_stages FOR ALL TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view activity types"
  ON activity_types FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage their activities"
  ON activities FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Insert default pipeline stages
INSERT INTO pipeline_stages (name, order_index, color, user_id) VALUES
  ('Lead Novo', 1, 'gray', '00000000-0000-0000-0000-000000000000'),
  ('Qualificado', 2, 'blue', '00000000-0000-0000-0000-000000000000'),
  ('Contatado', 3, 'yellow', '00000000-0000-0000-0000-000000000000'),
  ('Necessidades definidas', 4, 'orange', '00000000-0000-0000-0000-000000000000'),
  ('Custos estimados', 5, 'purple', '00000000-0000-0000-0000-000000000000'),
  ('Proposta feita', 6, 'green', '00000000-0000-0000-0000-000000000000'),
  ('Negociações iniciadas', 7, 'red', '00000000-0000-0000-0000-000000000000');

-- Insert default activity types
INSERT INTO activity_types (name, icon, color) VALUES
  ('Chamada', 'phone', 'blue'),
  ('Reunião', 'users', 'green'),
  ('Tarefa', 'check-square', 'orange'),
  ('Prazo', 'clock', 'red'),
  ('E-mail', 'mail', 'purple'),
  ('Almoço', 'coffee', 'brown');