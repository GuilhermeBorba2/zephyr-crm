import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Input from '../common/Input';
import { useAuthStore } from '../../stores/authStore';

interface OpportunityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
}) => {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    potential_value: initialData?.potential_value || '',
    closing_probability: initialData?.closing_probability || 50,
    expected_closing_date: initialData?.expected_closing_date || '',
    status: initialData?.status || 'aberta',
    lead_id: initialData?.lead_id || '',
    description: initialData?.description || '',
    source: initialData?.source || '',
    tags: initialData?.tags || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Ajusta o payload para evitar valores inválidos
    const payload = {
      ...formData,
      lead_id: formData.lead_id || null, // Se vazio, define como null
      user_id: user?.id || null,         // Garantir o ID do usuário
    };

    try {
      const { error } = initialData
        ? await supabase
            .from('opportunities')
            .update(payload)
            .eq('id', initialData.id)
        : await supabase
            .from('opportunities')
            .insert([payload]);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar oportunidade:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        Nova Oportunidade
      </h2>

      {/* Informações Básicas */}
      <Input
        label="Título"
        value={formData.title}
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
        placeholder="Ex.: Negociação com Empresa XYZ"
        required
      />

      <Input
        label="Valor Potencial (R$)"
        type="number"
        value={formData.potential_value}
        onChange={(e) =>
          setFormData({
            ...formData,
            potential_value: parseFloat(e.target.value),
          })
        }
        placeholder="Ex.: 50000"
        required
      />

      {/* Projeções */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Probabilidade de Fechamento (%)
      </label>
      <input
        type="range"
        min="0"
        max="100"
        value={formData.closing_probability}
        onChange={(e) =>
          setFormData({
            ...formData,
            closing_probability: parseInt(e.target.value),
          })
        }
        className="w-full"
      />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {formData.closing_probability}%
      </span>

      <Input
        label="Data Prevista de Fechamento"
        type="date"
        value={formData.expected_closing_date}
        onChange={(e) =>
          setFormData({
            ...formData,
            expected_closing_date: e.target.value,
          })
        }
        required
      />

      {/* Detalhes Adicionais */}
      <Input
        label="Descrição"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder="Descreva os detalhes da oportunidade"
      />

      <Input
        label="Fonte da Oportunidade"
        value={formData.source}
        onChange={(e) =>
          setFormData({ ...formData, source: e.target.value })
        }
        placeholder="Ex.: Indicação, Marketing, Rede Social"
      />

      <Input
        label="Tags"
        value={formData.tags.join(', ')}
        onChange={(e) =>
          setFormData({
            ...formData,
            tags: e.target.value.split(',').map((tag) => tag.trim()),
          })
        }
        placeholder="Ex.: prioridade alta, cliente VIP"
      />

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="aberta">Em Aberto</option>
          <option value="ganha">Ganha</option>
          <option value="perdida">Perdida</option>
        </select>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default OpportunityForm;
