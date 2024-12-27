import { supabase } from '../supabase';

export const leadAnalytics = {
  // ... existing methods ...

  async getLeadsData() {
    try {
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      return leads || [];
    } catch (error) {
      console.error('Error getting leads data:', error);
      return [];
    }
  }
};