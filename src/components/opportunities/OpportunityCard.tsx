import React from 'react';
import { Calendar, DollarSign, Percent } from 'lucide-react';
import type { Opportunity } from '../../types/database.types';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'Data não informada';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border dark:border-gray-700"
      role="article"
      aria-label={`Oportunidade ${opportunity.title}`}
    >
      {/* Título */}
      <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
        {opportunity.title || 'Título não informado'}
      </h4>

      {/* Empresa do Lead */}
      {opportunity.lead?.company && (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">
          Empresa: {opportunity.lead.company}
        </div>
      )}

      {/* Informações */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-green-500" />
          <span className="text-gray-700 dark:text-gray-300">
            {formatCurrency(opportunity.potential_value || 0)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Percent className="w-5 h-5 text-blue-500" />
          <span className="text-gray-700 dark:text-gray-300">
            {opportunity.closing_probability ?? '0'}% de probabilidade
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-yellow-500" />
          <span className="text-gray-700 dark:text-gray-300">
            Previsão: {formatDate(opportunity.expected_closing_date)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
