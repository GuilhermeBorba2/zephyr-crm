-- First, update any existing leads to use valid statuses
UPDATE leads 
SET status = 'new' 
WHERE status NOT IN (
  'new',
  'contacted',
  'qualified', 
  'needs_defined',
  'costs_estimated',
  'proposal_sent',
  'negotiation',
  'won',
  'lost'
);

-- Drop and recreate the constraint with the correct values
ALTER TABLE leads DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE leads ADD CONSTRAINT valid_status CHECK (
  status IN (
    'new',
    'contacted',
    'qualified',
    'needs_defined',
    'costs_estimated',
    'proposal_sent',
    'negotiation',
    'won',
    'lost'
  )
);

-- Create an index on the status column for better performance
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);