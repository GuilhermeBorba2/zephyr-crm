import { supabase } from './supabase';

export const calendar = {
  async syncWithGoogle(accessToken: string) {
    try {
      // Get events from Google Calendar
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch calendar events');
      
      const { items } = await response.json();

      // Convert Google Calendar events to activities
      const activities = items.map((event: any) => ({
        title: event.summary,
        description: event.description,
        start_time: event.start.dateTime || event.start.date,
        end_time: event.end.dateTime || event.end.date,
        google_event_id: event.id
      }));

      // Sync with our database
      const { error } = await supabase
        .from('activities')
        .upsert(
          activities,
          { onConflict: 'google_event_id' }
        );

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error);
      throw error;
    }
  },

  async createGoogleEvent(activity: any, accessToken: string) {
    try {
      const event = {
        summary: activity.title,
        description: activity.description,
        start: {
          dateTime: activity.start_time,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: activity.end_time,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) throw new Error('Failed to create calendar event');
      
      const data = await response.json();
      
      // Update activity with Google Calendar ID
      await supabase
        .from('activities')
        .update({ google_event_id: data.id })
        .eq('id', activity.id);

      return data;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw error;
    }
  }
};