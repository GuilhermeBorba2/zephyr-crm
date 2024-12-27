import { supabase } from '../supabase';

export const googleContacts = {
  async authorize() {
    const config = {
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/contacts',
      response_type: 'token'
    };

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(config)}`;
    window.location.href = authUrl;
  },

  async syncContacts(accessToken: string) {
    try {
      const response = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch contacts');
      
      const data = await response.json();
      return data.connections;
    } catch (error) {
      console.error('Error syncing contacts:', error);
      throw error;
    }
  },

  async importContact(accessToken: string, contact: any) {
    try {
      const response = await fetch('https://people.googleapis.com/v1/people:createContact', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
      });

      if (!response.ok) throw new Error('Failed to import contact');
      return await response.json();
    } catch (error) {
      console.error('Error importing contact:', error);
      throw error;
    }
  }
};