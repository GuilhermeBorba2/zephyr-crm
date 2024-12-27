import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Input from '../common/Input';
import { useToastStore } from '../../stores/toastStore';
import { useAuthStore } from '../../stores/authStore';

interface ActivityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  leadId?: string;
  clientId?: string;
}

interface ActivityType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  onSuccess,
  onCancel,
  leadId,
  clientId
}) => {
  const user = useAuthStore(state => state.user);
  const addToast = useToastStore(state => state.addToast);
  const [loading, setLoading] = useState(false);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type_id: '',
    due_date: '',
    due_time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  });

  useEffect(() => {
    fetchActivityTypes();
  }, []);

  const fetchActivityTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setActivityTypes(data || []);
      
      // Set default type if available
      if (data?.length > 0) {
        setFormData(prev => ({ ...prev, type_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching activity types:', error);
      addToast('Erro ao carregar tipos de atividade', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine date and time
      const dueDate = new Date(formData.due_date);
      const [hours, minutes] = formData.due_time.split(':');
      dueDate.setHours(parseInt(hours), parseInt(minutes));

      const { error } = await supabase
        .from('activities')
        .insert([{
          title: formData.title,
          description: formData.description,
          type_id: formData.type_id,
          due_date: dueDate.toISOString(),
          lead_id: leadId,
          client_id: clientId,
          user_id: user?.id
        }]);

      if (error) throw error;
      
      addToast('Atividade criada com sucesso!', 'success');
      onSuccess();
    } catch (error) {
      console.error('Error creating activity:', error);
      addToast('Erro ao criar atividade', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Título"
        icon={FileText}
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tipo
        </label>
        <select
          value={formData.type_id}
          onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        >
          {activityTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="Data"
          icon={Calendar}
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          required
        />

        <Input
          type="time"
          label="Hora"
          icon={Clock}
          value={formData.due_time}
          onChange={(e) => setFormData({ ...formData, due_time: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Atividade'}
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;