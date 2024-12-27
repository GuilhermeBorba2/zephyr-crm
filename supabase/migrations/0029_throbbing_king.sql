-- First, remove any duplicate activity types
DELETE FROM activity_types a
USING activity_types b
WHERE a.id > b.id 
AND a.name = b.name;

-- Add unique constraint to prevent future duplicates
ALTER TABLE activity_types
ADD CONSTRAINT activity_types_name_unique UNIQUE (name);

-- Reinsert default activity types with conflict handling
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