import { supabase } from './supabase';

export const reports = {
  async generateCustomReport(params: {
    startDate: Date;
    endDate: Date;
    metrics: string[];
    groupBy?: string;
    filters?: Record<string, any>;
  }) {
    try {
      const queries = params.metrics.map(metric => {
        let query = supabase
          .from('analytics')
          .select('*')
          .eq('metric_type', metric)
          .gte('date', params.startDate.toISOString())
          .lte('date', params.endDate.toISOString());

        if (params.filters) {
          Object.entries(params.filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }

        return query;
      });

      const results = await Promise.all(queries);
      const data = results.map((result, index) => ({
        metric: params.metrics[index],
        data: result.data || []
      }));

      if (params.groupBy) {
        return this.groupReportData(data, params.groupBy);
      }

      return data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('Falha ao gerar relatório');
    }
  },

  async exportData(data: any[], format: 'csv' | 'json' = 'json') {
    try {
      if (!data || !Array.isArray(data)) {
        throw new Error('Dados inválidos para exportação');
      }

      if (format === 'csv') {
        return this.convertToCSV(data);
      }

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Falha ao exportar dados');
    }
  },

  groupReportData(data: any[], groupBy: string) {
    return data.reduce((grouped, item) => {
      const key = item[groupBy];
      grouped[key] = grouped[key] || [];
      grouped[key].push(item);
      return grouped;
    }, {});
  },

  convertToCSV(data: any[]): string {
    if (!data.length) return '';

    // Get all possible headers from all objects
    const headers = Array.from(new Set(
      data.reduce((keys, obj) => {
        return keys.concat(Object.keys(obj));
      }, [])
    ));

    // Create CSV rows
    const rows = [
      headers.join(','), // Header row
      ...data.map(obj => 
        headers.map(header => {
          const value = obj[header];
          // Handle different value types
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          return value;
        }).join(',')
      )
    ];

    return rows.join('\n');
  }
};