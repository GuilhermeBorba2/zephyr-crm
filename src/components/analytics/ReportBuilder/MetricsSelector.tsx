import React from 'react';
import { Package, DollarSign, Users, TrendingUp } from 'lucide-react';

const AVAILABLE_METRICS = [
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'revenue', label: 'Receita', icon: DollarSign },
  { id: 'conversion_rate', label: 'Taxa de Conversão', icon: TrendingUp },
  { id: 'roi', label: 'ROI', icon: Package }
];

interface MetricsSelectorProps {
  selectedMetrics: string[];
  onChange: (metrics: string[]) => void;
}

const MetricsSelector: React.FC<MetricsSelectorProps> = ({ selectedMetrics, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Métricas
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {AVAILABLE_METRICS.map(metric => {
          const Icon = metric.icon;
          const isSelected = selectedMetrics.includes(metric.id);

          return (
            <button
              key={metric.id}
              onClick={() => {
                const newMetrics = isSelected
                  ? selectedMetrics.filter(m => m !== metric.id)
                  : [...selectedMetrics, metric.id];
                onChange(newMetrics);
              }}
              className={`
                flex items-center gap-2 p-3 rounded-lg border transition-colors
                ${isSelected
                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{metric.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsSelector;