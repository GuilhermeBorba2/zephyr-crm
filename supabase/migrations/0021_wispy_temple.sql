-- Update the valid_status constraint for leads table
ALTER TABLE leads DROP CONSTRAINT IF EXISTS valid_status;
ALTER TABLE leads ADD CONSTRAINT valid_status CHECK (
  status IN (
    'new',
    'qualified', 
    'contacted',
    'needs_defined',
    'costs_estimated',
    'proposal_sent',
    'negotiation',
    'won',
    'lost'
  )
);