import { supabase } from '../supabase';

export const emailTemplates = {
  async getTemplates() {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .is('deleted_at', null)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }
  },

  async createTemplate(template: { name: string; subject: string; content: string }) {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating email template:', error);
      throw error;
    }
  },

  async updateTemplate(id: string, template: { name?: string; subject?: string; content?: string }) {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .update(template)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating email template:', error);
      throw error;
    }
  },

  async deleteTemplate(id: string) {
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting email template:', error);
      throw error;
    }
  }
};