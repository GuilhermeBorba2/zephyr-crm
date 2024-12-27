import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FilterBuilderProps {
  filters: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
}

const FILTER_TYPES = [
  { id: 'channel', label: 'Canal', options: ['Email', 'Redes Sociais', 'Google Ads'] },
  { id: 'team', label: 'Equipe', options: ['Vendas', 'Marketing', 'Suporte'] },
  { id: 'conversion', label: 'Tipo de Conversão', options: ['Lead', 'Venda', 'Clique'] },
  { id: 'budget', label: 'Orçamento', type: 'range' },
  { id: 'roi', label: 'ROI', type: 'range' }
];

const FilterBuilder: React.FC<FilterBuilderProps> = ({ filters, onChange }) => {
  const [selectedType, setSelectedType] = useState('');

  const addFilter = () => {
    if (!selectedType) return;

    const filterType = FILTER_TYPES.find(t => t.id === selectedType);
    if (!filterType) return;

    onChange({
      ...filters,
      [selectedType]: filterType.type === 'range' ? { min: 0, max: 100 } : []
    });
    setSelectedType('');
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Selecione um filtro...</option>
          {FILTER_TYPES.filter(type => !filters[type.id]).map(type => (
            <option key={type.id} value={type.id}>{type.label}</option>
          ))}
        </select>
        <button
          onClick={addFilter}
          disabled={!selectedType}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      <div className="space-y-3">
        {Object.entries(filters).map(([key, value]) => {
          const filterType = FILTER_TYPES.find(t => t.id === key);
          if (!filterType) return null;

          return (
            <div key={key} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[100px]">
                {filterType.label}
              </span>

              {filterType.type === 'range' ? (
                <div className="flex-1 flex items-center gap-4">
                  <input
                    type="number"
                    value={(value as any).min}
                    onChange={(e) => onChange({
                      ...filters,
                      [key]: { ...value, min: Number(e.target.value) }
                    })}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Min"
                  />
                  <span>até</span>
                  <input
                    type="number"
                    value={(value as any).max}
                    onChange={(e) => onChange({
                      ...filters,
                      [key]: { ...value, max: Number(e.target.value) }
                    })}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Max"
                  />
                </div>
              ) : (
                <select
                  multiple
                  value={value as string[]}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                    onChange({ ...filters, [key]: selected });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {filterType.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}

              <button
                onClick={() => removeFilter(key)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBuilder;