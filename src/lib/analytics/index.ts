import { consultantAnalytics } from './consultant';
import { revenueAnalytics } from './revenue';
import { leadAnalytics } from './leads';

export const analytics = {
  getConsultantPerformance: consultantAnalytics.getPerformance,
  getRevenueData: revenueAnalytics.getData,
  getLeadConversionRate: leadAnalytics.getConversionRate,
  getAverageOpportunityValue: revenueAnalytics.getAverageValue,
  getSalesCycle: revenueAnalytics.getSalesCycle,
  getConversionData: leadAnalytics.getConversionData,
  getPerformanceData: consultantAnalytics.getTeamPerformance,

  async exportData(format: 'json' | 'csv' = 'json') {
    try {
      // Fetch all relevant data
      const [
        revenue,
        conversion,
        performance,
        leads,
        opportunities
      ] = await Promise.all([
        this.getRevenueData(),
        this.getConversionData(),
        this.getPerformanceData(),
        leadAnalytics.getLeadsData(),
        revenueAnalytics.getOpportunitiesData()
      ]);

      const exportData = {
        summary: {
          totalLeads: leads?.length || 0,
          totalOpportunities: opportunities?.length || 0,
          totalRevenue: revenue?.reduce((sum, item) => sum + (item.value || 0), 0) || 0,
          averageConversion: conversion?.reduce((sum, item) => sum + (item.rate || 0), 0) / (conversion?.length || 1)
        },
        metrics: {
          revenue: revenue || [],
          conversion: conversion || [],
          performance: performance || []
        },
        data: {
          leads: leads || [],
          opportunities: opportunities || []
        },
        exportedAt: new Date().toISOString()
      };

      if (format === 'csv') {
        return this.convertToCSV(exportData);
      }

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      throw new Error('Falha ao exportar dados analíticos');
    }
  },

  convertToCSV(data: any): string {
    // Convert nested data to flat CSV format
    const rows = [];
    
    // Add summary
    rows.push(['Resumo']);
    Object.entries(data.summary).forEach(([key, value]) => {
      rows.push([key, value]);
    });
    rows.push([]);

    // Add metrics
    rows.push(['Métricas']);
    Object.entries(data.metrics).forEach(([category, items]) => {
      rows.push([category.toUpperCase()]);
      if (Array.isArray(items)) {
        const headers = Object.keys(items[0] || {});
        rows.push(headers);
        items.forEach(item => {
          rows.push(headers.map(header => item[header]));
        });
      }
      rows.push([]);
    });

    // Convert rows to CSV string
    return rows.map(row => row.join(',')).join('\n');
  }
};