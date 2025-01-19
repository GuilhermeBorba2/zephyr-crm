import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';
import { supabase } from '../../lib/supabase';

declare global {
  interface Window {
    google: any;
  }
}

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink: string;
}

const CalendarSync = ({ onSync }: { onSync: (events: CalendarEvent[]) => void }) => {
  const [syncing, setSyncing] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    loadGoogleIdentityServices();
  }, []);

  const loadGoogleIdentityServices = () => {
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      setApiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setApiLoaded(true);
    script.onerror = () => addToast('Erro ao carregar a biblioteca do Google.', 'error');
    document.body.appendChild(script);
  };

  const saveEventsToDatabase = async (events: CalendarEvent[]) => {
    try {
      const { data, error } = await supabase
        .from('google_events')
        .upsert(events.map((event) => ({
          id: event.id,
          title: event.summary,
          start_time: event.start.dateTime || event.start.date,
          end_time: event.end.dateTime || event.end.date,
          link: event.htmlLink,
        })));

      if (error) throw error;

      addToast('Eventos sincronizados e salvos no banco de dados.', 'success');
    } catch (error) {
      console.error('Erro ao salvar eventos no banco:', error);
      addToast('Erro ao salvar eventos no banco.', 'error');
    }
  };

  const handleSync = () => {
    if (!apiLoaded) {
      addToast('Aguarde o carregamento da API do Google.', 'error');
      return;
    }

    setSyncing(true);
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      callback: async (response: any) => {
        if (response.error) {
          console.error('Erro ao obter token:', response.error);
          addToast('Erro ao autenticar no Google.', 'error');
          setSyncing(false);
          return;
        }

        try {
          const res = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`,
            {
              headers: {
                Authorization: `Bearer ${response.access_token}`,
              },
            }
          );

          const data = await res.json();
          if (data.items && data.items.length > 0) {
            const events = data.items.map((item: any) => ({
              id: item.id,
              summary: item.summary,
              start: item.start,
              end: item.end,
              htmlLink: item.htmlLink,
            }));
            onSync(events);
            await saveEventsToDatabase(events); // Salva os eventos no banco
          } else {
            addToast('Nenhum evento encontrado no calendário.', 'info');
          }
        } catch (error) {
          console.error('Erro ao sincronizar o calendário:', error);
          addToast('Erro ao sincronizar o calendário.', 'error');
        } finally {
          setSyncing(false);
        }
      },
    });

    tokenClient.requestAccessToken();
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
