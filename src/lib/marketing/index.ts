import { campaignApi } from './api';
import type { Campaign } from '../../types/database.types';

export const marketing = {
  async createCampaign(campaignData: Partial<Campaign>) {
    try {
      return await campaignApi.create(campaignData);
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  async updateCampaign(id: string, campaignData: Partial<Campaign>) {
    try {
      return await campaignApi.update(id, campaignData);
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  async updateCampaignStatus(id: string, status: string) {
    try {
      return await campaignApi.updateStatus(id, status);
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw new Error('Failed to update campaign status');
    }
  },

  async getCampaigns() {
    try {
      return await campaignApi.getAll();
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  async generateReport() {
    try {
      const campaigns = await this.getCampaigns();
      // Aqui você pode implementar a lógica de geração do relatório
      // Por exemplo, usando uma biblioteca como jsPDF
      return JSON.stringify(campaigns, null, 2);
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
};