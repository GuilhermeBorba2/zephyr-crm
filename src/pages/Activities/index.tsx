import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ActivityForm from '../../components/activities/ActivityForm';
import ActivityList from '../../components/activities/ActivityList';
import CalendarSync from '../../components/activities/CalendarSync';
import Modal from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';

const ActivitiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    period: 'all',
    type: 'all'
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          type:activity_types(
            name,
            icon,
            color
          )
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (searchTerm && !activity.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (filters.type !== 'all' && activity.type !== filters.type) {
      return false;
    }

    if (filters.period !== 'all') {
      const today = new Date();
      const dueDate = new Date(activity.due_date);
      
      switch (filters.period) {
        case 'today':
          return dueDate.toDateString() === today.toDateString();
        case 'week':
          const weekAhead = new Date(today.setDate(today.getDate() + 7));
          return dueDate <= weekAhead;
        case 'month':
          const monthAhead = new Date(today.setMonth(today.getMonth() + 1));
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
          <CalendarSync />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nova Atividade
          </button>
        </div>
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