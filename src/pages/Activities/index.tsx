import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ActivityForm from '../../components/activities/ActivityForm';
import ActivityList from '../../components/activities/ActivityList';
import CalendarSync from '../../components/activities/CalendarSync';
import Modal from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';

interface Activity {
  id: string;
  title: string;
  description: string;
  due_date: string;
  type: {
    name: string;
    icon: string;
    color: string;
  };
}

interface Filter {
  status: string;
  period: string;
  type: string;
}

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink: string;
}

const ActivitiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filter>({
    status: 'all',
    period: 'all',
    type: 'all',
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          id,
          title,
          description,
          due_date,
          activity_types!inner (
            name,
            icon,
            color
          )
        `)
        .order('due_date', { ascending: true });
  
      if (error) throw error;
  
      const mappedData = data.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        due_date: activity.due_date,
        type: {
          name: activity.activity_types.name,
          icon: activity.activity_types.icon,
          color: activity.activity_types.color,
        },
      }));
  
      setActivities(mappedData || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((activity) => {
    if (searchTerm && !activity.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (filters.type !== 'all' && activity.type.name !== filters.type) {
      return false;
    }

    if (filters.period !== 'all') {
      const today = new Date();
      const dueDate = new Date(activity.due_date);

      switch (filters.period) {
        case 'today':
          return dueDate.toDateString() === today.toDateString();
        case 'week':
          const weekAhead = new Date(today);
          weekAhead.setDate(today.getDate() + 7);
          return dueDate <= weekAhead;
        case 'month':
          const monthAhead = new Date(today);
          monthAhead.setMonth(today.getMonth() + 1);
          return dueDate <= monthAhead;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Atividades
        </h1>
        <div className="flex items-center gap-4">
          {/* Passa onSync para CalendarSync */}
          <CalendarSync onSync={(syncedEvents) => setEvents(syncedEvents)} />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nova Atividade
          </button>
        </div>
      </div>

      {/* Lista de eventos do Google Calendar */}
      <div>
        <h2 className="text-lg font-semibold text-white">Eventos do Google Calendar</h2>
        {events.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {events.map((event) => (
              <li key={event.id} className="py-4">
                <p className="font-medium text-gray-900 dark:text-white">{event.summary}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(event.start.dateTime ?? event.start.date ?? '').toLocaleString()} -{' '}
                  {new Date(event.end.dateTime ?? event.end.date ?? '').toLocaleString()}
                </p>
                <a
                  href={event.htmlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Ver no Google Calendar
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum evento sincronizado.</p>
        )}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Pesquisar atividades..."
          />
        </div>

        <select
          value={filters.period}
          onChange={(e) => setFilters({ ...filters, period: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">Todos os períodos</option>
          <option value="today">Hoje</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mês</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">Todos os tipos</option>
          <option value="call">Chamada</option>
          <option value="meeting">Reunião</option>
          <option value="task">Tarefa</option>
          <option value="deadline">Prazo</option>
          <option value="email">E-mail</option>
          <option value="lunch">Almoço</option>
        </select>
      </div>

      <ActivityList activities={filteredActivities} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Atividade"
      >
        <ActivityForm
          onSuccess={() => {
            fetchActivities();
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ActivitiesPage;
