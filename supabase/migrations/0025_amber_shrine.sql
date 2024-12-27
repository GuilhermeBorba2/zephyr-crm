-- First, update any invalid statuses to 'new'
UPDATE leads SET status = 'new' WHERE status NOT IN (
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

-- Then update the constraint
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