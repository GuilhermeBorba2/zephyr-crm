-- Enable RLS for email_logs table
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for email_logs
CREATE POLICY "Anyone can insert email logs"
  ON email_logs FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view email logs"
  ON email_logs FOR SELECT
  TO authenticated
  USING (true);