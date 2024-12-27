-- Add platform column to campaigns table
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS platform text,
ADD CONSTRAINT valid_platform CHECK (
  platform IS NULL OR 
  platform IN ('facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'tiktok')
);

-- Update existing social media campaigns with default platform
UPDATE campaigns 
SET platform = 'facebook' 
WHERE type = 'social' AND platform IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS campaigns_platform_idx ON campaigns(platform);