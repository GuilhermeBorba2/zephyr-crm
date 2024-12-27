-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  organization text,
  phones jsonb DEFAULT '[]'::jsonb,
  emails jsonb DEFAULT '[]'::jsonb,
  owner_id uuid REFERENCES auth.users(id),
  tags text[] DEFAULT '{}',
  visibility text NOT NULL DEFAULT 'private',
  google_contact_id text,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_visibility CHECK (visibility IN ('private', 'team', 'public'))
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    (visibility = 'team' AND owner_id = auth.uid()) OR
    visibility = 'public'
  );

CREATE POLICY "Users can insert their own contacts"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX contacts_user_id_idx ON contacts(user_id);
CREATE INDEX contacts_owner_id_idx ON contacts(owner_id);
CREATE INDEX contacts_visibility_idx ON contacts(visibility);
CREATE INDEX contacts_google_id_idx ON contacts(google_contact_id);
CREATE INDEX contacts_tags_idx ON contacts USING gin(tags);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();