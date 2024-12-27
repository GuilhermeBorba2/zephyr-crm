import React, { useState } from 'react';
import { FileDown, Filter } from 'lucide-react';
import MetricsSelector from './MetricsSelector';
import FilterBuilder from './FilterBuilder';
import ChartPreview from './ChartPreview';
import { useToastStore } from '../../../stores/toastStore';
import { reports } from '../../../lib/reports';

const ReportBuilder = () => {
  const addToast = useToastStore(state => state.addToast);
  const [config, setConfig] = useState({
    startDate: '',
    endDate: '',
    metrics: [],
    groupBy: '',
    filters: {},
    chartType: 'line'
  });

  const handleExport = async (format: 'pdf' | 'excel' | 'json' | 'png' = 'pdf') => {
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
      const mimeTypes = {
        pdf: 'application/pdf',
        excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        json: 'application/json',
        png: 'image/png'
      };

      const blob = new Blob([exportedData], { type: mimeTypes[format] });
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Relatório Personalizado
        </h2>
        <div className="flex gap-2">
          <select
            onChange={(e) => handleExport(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Exportar como...</option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="json">JSON</option>
            <option value="png">Imagem</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data Inicial
          </label>
          <input
            type="date"
            value={config.startDate}
            onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <MetricsSelector
        selectedMetrics={config.metrics}
        onChange={(metrics) => setConfig({ ...config, metrics })}
      />

      <FilterBuilder
        filters={config.filters}
        onChange={(filters) => setConfig({ ...config, filters })}
      />

      <ChartPreview
        config={config}
        onChartTypeChange={(type) => setConfig({ ...config, chartType: type })}
      />
    </div>
  );
};

export default ReportBuilder;