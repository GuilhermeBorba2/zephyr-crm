import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartPreviewProps {
  config: {
    chartType: string;
    metrics: string[];
    startDate: string;
    endDate: string;
    filters: Record<string, any>;
  };
  onChartTypeChange: (type: string) => void;
}

const CHART_TYPES = [
  { id: 'line', label: 'Linha' },
  { id: 'bar', label: 'Barras' },
  { id: 'pie', label: 'Pizza' }
];

const ChartPreview: React.FC<ChartPreviewProps> = ({ config, onChartTypeChange }) => {
  // Mock data for preview - replace with real data in production
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Fev', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Abr', value: 800 },
    { name: 'Mai', value: 500 }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Pré-visualização
        </h3>
        <div className="flex gap-2">
          {CHART_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => onChartTypeChange(type.id)}
              className={`
                px-3 py-1 text-sm font-medium rounded-md
                ${config.chartType === type.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }
              `}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {config.chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" />
            </LineChart>
          ) : config.chartType === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#3B82F6"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartPreview;