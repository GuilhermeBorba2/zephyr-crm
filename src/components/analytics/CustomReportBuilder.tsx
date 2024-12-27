import React, { useState } from 'react';
import { FileDown, Filter, BarChart2 } from 'lucide-react';
import { reports } from '../../lib/reports';
import { useToastStore } from '../../stores/toastStore';

const CustomReportBuilder = () => {
  const addToast = useToastStore(state => state.addToast);
  const [config, setConfig] = useState({
    startDate: '',
    endDate: '',
    metrics: [],
    groupBy: '',
    filters: {}
  });

  const handleExport = async (format: 'json' | 'csv' = 'json') => {
    try {
      if (!config.startDate || !config.endDate) {
        addToast('Selecione um período para exportar', 'error');
        return;
      }

      if (!config.metrics.length) {
        addToast('Selecione pelo menos uma métrica', 'error');
        return;
      }

      const data = await reports.generateCustomReport({
        startDate: new Date(config.startDate),
        endDate: new Date(config.endDate),
        metrics: config.metrics,
        groupBy: config.groupBy,
        filters: config.filters
      });

      const exportedData = await reports.exportData(data, format);
      const blob = new Blob(
        [exportedData], 
        { type: format === 'csv' ? 'text/csv' : 'application/json' }
      );
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      addToast('Relatório exportado com sucesso!', 'success');
    } catch (error) {
      console.error('Error exporting report:', error);
      addToast('Erro ao exportar relatório', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Relatório Personalizado
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('json')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <BarChart2 className="w-4 h-4" />
            Gerar Relatório
          </button>
          <button 
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <FileDown className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Período */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={config.startDate}
              onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={config.endDate}
              onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Filtros */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtros
            </label>
          </div>
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              + Adicionar Filtro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomReportBuilder;