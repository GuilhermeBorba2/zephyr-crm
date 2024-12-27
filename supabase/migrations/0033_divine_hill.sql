-- Add soft delete column to email_templates
ALTER TABLE email_templates
ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Update RLS policies to exclude deleted templates
DROP POLICY IF EXISTS "Staff can manage email templates" ON email_templates;

CREATE POLICY "Staff can view active email templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Staff can manage email templates"
  ON email_templates FOR ALL
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS email_templates_deleted_at_idx ON email_templates(deleted_at);