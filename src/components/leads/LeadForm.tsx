import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useToastStore } from '../../stores/toastStore';
import LeadInfoSection from './form/LeadInfoSection';
import CorporateInfoSection from './form/CorporateInfoSection';
import InterestInfoSection from './form/InterestInfoSection';
import SourceInfoSection from './form/SourceInfoSection';

interface LeadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSuccess, onCancel, initialData }) => {
  const user = useAuthStore(state => state.user);
  const addToast = useToastStore(state => state.addToast);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
    position: initialData?.position || '',
    cnpj: initialData?.cnpj || '',
    corporate_name: initialData?.corporate_name || '',
    corporate_email: initialData?.corporate_email || '',
    corporate_phone: initialData?.corporate_phone || '',
    corporate_responsible: initialData?.corporate_responsible || '',
    responsible_position: initialData?.responsible_position || '',
    product_interest: initialData?.product_interest || '',
    needs: initialData?.needs || '',
    budget: initialData?.budget || '',
    source: initialData?.source || 'other',
    campaign: initialData?.campaign || '',
    notes: initialData?.notes || '',
    service: initialData?.service || 'Consultoria',
    value: initialData?.value || 0, // Default value of 0
    status: 'new'
  });

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        service: formData.service || 'Consultoria',
        value: Number(formData.value) || 0, // Ensure value is a number
        user_id: user?.id
      };

      const { error } = initialData
        ? await supabase
            .from('leads')
            .update(dataToSave)
            .eq('id', initialData.id)
        : await supabase
            .from('leads')
            .insert([dataToSave]);

      if (error) throw error;
      
      onSuccess();
      addToast(initialData ? 'Lead atualizado com sucesso!' : 'Lead criado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      addToast('Erro ao salvar lead', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LeadInfoSection
        data={formData}
        onChange={handleFieldChange}
      />

      <CorporateInfoSection
        data={formData}
        onChange={handleFieldChange}
      />

      <InterestInfoSection
        data={formData}
        onChange={handleFieldChange}
      />

      <SourceInfoSection
        data={formData}
        onChange={handleFieldChange}
      />

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;