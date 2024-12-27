import { supabase } from '../supabase';

export const revenueAnalytics = {
  // ... existing methods ...

  async getOpportunitiesData() {
    try {
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      return opportunities || [];
    } catch (error) {
      console.error('Error getting opportunities data:', error);
      return [];
    }
  }
};