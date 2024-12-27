import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';
import { googleApi } from '../../lib/google/api';

const CalendarSync = () => {
  const [syncing, setSyncing] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    loadGoogleApi();
  }, []);

  const loadGoogleApi = async () => {
    try {
      await googleApi.ensureApiLoaded();
      setApiLoaded(true);
    } catch (error) {
      console.error('Error loading Google API:', error);
      addToast('Erro ao carregar API do Google', 'error');
    }
  };

  const handleSync = async () => {
    if (!apiLoaded) {
      addToast('Aguarde o carregamento da API do Google', 'error');
      return;
    }

    setSyncing(true);
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      if (!auth2.isSignedIn.get()) {
        await auth2.signIn();
      }

      const accessToken = auth2.currentUser.get().getAuthResponse().access_token;
      
      // Fetch calendar events
      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
      });

      // Process calendar events
      const events = response.result.items;
      console.log('Calendar events:', events);
      
      addToast('Calendário sincronizado com sucesso!', 'success');
    } catch (error) {
      console.error('Error syncing calendar:', error);
      addToast('Erro ao sincronizar calendário', 'error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={syncing || !apiLoaded}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
    >
      <Calendar className="w-4 h-4" />
      {syncing ? 'Sincronizando...' : 'Sincronizar com Google Calendar'}
    </button>
  );
};

export default CalendarSync;