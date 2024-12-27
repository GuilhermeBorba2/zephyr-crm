import React, { useState, useEffect } from 'react';
import { Mail, Package, DollarSign, Users, FileText, Calendar, Upload } from 'lucide-react';
import { marketing } from '../../lib/marketing';
import { useToastStore } from '../../stores/toastStore';
import Input from '../common/Input';
import CurrencyInput from './CurrencyInput';
import type { Campaign } from '../../types/database.types';

interface CampaignEditorProps {
  initialData?: Campaign | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const OBJECTIVES = [
  { id: 'leads', label: 'Geração de Leads' },
  { id: 'conversions', label: 'Aumentar Conversões' },
  { id: 'engagement', label: 'Melhorar Engajamento' },
  { id: 'awareness', label: 'Aumentar Visibilidade' },
  { id: 'sales', label: 'Aumentar Vendas' }
];

const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: 'facebook' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
  { id: 'twitter', name: 'Twitter/X', icon: 'twitter' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube' },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok' }
];

const CampaignEditor: React.FC<CampaignEditorProps> = ({
  initialData,
  onSuccess,
  onCancel
}) => {
  const addToast = useToastStore(state => state.addToast);
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'email',
    objective: initialData?.objective || 'leads',
    status: initialData?.status || 'draft',
    start_date: initialData?.start_date?.split('T')[0] || '',
    end_date: initialData?.end_date?.split('T')[0] || '',
    budget: initialData?.budget || 0,
    content: initialData?.content || '',
    target_audience: initialData?.target_audience || [],
    platform: initialData?.platform || 'facebook',
    target_metrics: initialData?.target_metrics || {
      leads: 0,
      conversion_rate: 0,
      revenue: 0
    },
    attachments: initialData?.attachments || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        await marketing.updateCampaign(initialData.id, campaign);
        addToast('Campanha atualizada com sucesso!', 'success');
      } else {
        await marketing.createCampaign(campaign);
        addToast('Campanha criada com sucesso!', 'success');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving campaign:', error);
      addToast('Erro ao salvar campanha', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nome da Campanha"
        icon={FileText}
        value={campaign.name}
        onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo
          </label>
          <select
            value={campaign.type}
            onChange={(e) => setCampaign({ ...campaign, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="email">Email Marketing</option>
            <option value="social">Redes Sociais</option>
            <option value="ads">Anúncios</option>
            <option value="event">Evento</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Objetivo
          </label>
          <select
            value={campaign.objective}
            onChange={(e) => setCampaign({ ...campaign, objective: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            {OBJECTIVES.map(obj => (
              <option key={obj.id} value={obj.id}>{obj.label}</option>
            ))}
          </select>
        </div>

        {campaign.type === 'social' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plataforma
            </label>
            <select
              value={campaign.platform}
              onChange={(e) => setCampaign({ ...campaign, platform: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              {SOCIAL_PLATFORMS.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <CurrencyInput
          label="Orçamento"
          value={campaign.budget}
          onChange={(value) => setCampaign({ ...campaign, budget: value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Data de Início"
          icon={Calendar}
          value={campaign.start_date}
          onChange={(e) => setCampaign({ ...campaign, start_date: e.target.value })}
          required
        />

        <Input
          type="date"
          label="Data de Término"
          icon={Calendar}
          value={campaign.end_date}
          onChange={(e) => setCampaign({ ...campaign, end_date: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Métricas Alvo
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="number"
            label="Meta de Leads"
            icon={Users}
            value={campaign.target_metrics.leads}
            onChange={(e) => setCampaign({
              ...campaign,
              target_metrics: {
                ...campaign.target_metrics,
                leads: parseInt(e.target.value)
              }
            })}
          />
          <Input
            type="number"
            label="Taxa de Conversão (%)"
            icon={Package}
            value={campaign.target_metrics.conversion_rate}
            onChange={(e) => setCampaign({
              ...campaign,
              target_metrics: {
                ...campaign.target_metrics,
                conversion_rate: parseInt(e.target.value)
              }
            })}
          />
          <Input
            type="number"
            label="Meta de Receita"
            icon={DollarSign}
            value={campaign.target_metrics.revenue}
            onChange={(e) => setCampaign({
              ...campaign,
              target_metrics: {
                ...campaign.target_metrics,
                revenue: parseInt(e.target.value)
              }
            })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Público-Alvo
        </label>
        <textarea
          value={Array.isArray(campaign.target_audience) ? campaign.target_audience.join('\n') : ''}
          onChange={(e) => setCampaign({
            ...campaign,
            target_audience: e.target.value.split('\n').filter(Boolean)
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
          placeholder="Digite cada segmento em uma nova linha"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Conteúdo da Campanha
        </label>
        <textarea
          value={campaign.content}
          onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
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
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default CampaignEditor;