export const LEAD_STATUSES = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  NEEDS_DEFINED: 'needs_defined',
  COSTS_ESTIMATED: 'costs_estimated',
  PROPOSAL_SENT: 'proposal_sent',
  NEGOTIATION: 'negotiation',
  WON: 'won',
  LOST: 'lost'
} as const;

export type LeadStatus = typeof LEAD_STATUSES[keyof typeof LEAD_STATUSES];

export const LEAD_STATUS_CONFIG = [
  { id: LEAD_STATUSES.NEW, title: 'Novo Lead', color: 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800' },
  { id: LEAD_STATUSES.CONTACTED, title: 'Contatado', color: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20' },
  { id: LEAD_STATUSES.QUALIFIED, title: 'Qualificado', color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' },
  { id: LEAD_STATUSES.NEEDS_DEFINED, title: 'Necessidades Definidas', color: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20' },
  { id: LEAD_STATUSES.COSTS_ESTIMATED, title: 'Custos Estimados', color: 'border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/20' },
  { id: LEAD_STATUSES.PROPOSAL_SENT, title: 'Proposta Enviada', color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' },
  { id: LEAD_STATUSES.NEGOTIATION, title: 'Em Negociação', color: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20' },
  { id: LEAD_STATUSES.WON, title: 'Ganho', color: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20' },
  { id: LEAD_STATUSES.LOST, title: 'Perdido', color: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' }
] as const;

export const isValidLeadStatus = (status: string): status is LeadStatus => {
  return Object.values(LEAD_STATUSES).includes(status as LeadStatus);
};

type LeadsStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export interface Lead {
  id: string;
  name: string;
  company?: string;
  value?: number | string;
  user_id?: string;
  source?: "referral" | "campaign" | "organic" | "other";
  created_at: string;
  email: string;
  phone: string;
  status: LeadsStatus;
  notes?: string;
}