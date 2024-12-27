-- Add new columns to campaigns table
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS objective text,
ADD COLUMN IF NOT EXISTS target_metrics jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS schedule jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS performance_data jsonb DEFAULT '{}'::jsonb,
ADD CONSTRAINT valid_objective CHECK (
  objective IS NULL OR 
  objective IN ('leads', 'conversions', 'engagement', 'awareness', 'sales')
);

-- Create campaign_attachments table for storing file references
CREATE TABLE IF NOT EXISTS campaign_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS for new table
ALTER TABLE campaign_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for campaign_attachments
CREATE POLICY "Users can manage their campaign attachments"
  ON campaign_attachments FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS campaigns_objective_idx ON campaigns(objective);
CREATE INDEX IF NOT EXISTS campaigns_owner_id_idx ON campaigns(owner_id);
CREATE INDEX IF NOT EXISTS campaign_attachments_campaign_id_idx ON campaign_attachments(campaign_id);