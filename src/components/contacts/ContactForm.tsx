import React, { useState } from 'react';
import { Plus, Trash2, User, Building2, Mail, Phone, Tag, Users } from 'lucide-react';
import Input from '../common/Input';
import { useAuthStore } from '../../stores/authStore';
import { useToastStore } from '../../stores/toastStore';
import { supabase } from '../../lib/supabase';

interface ContactFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

interface PhoneNumber {
  type: 'work' | 'home' | 'mobile';
  number: string;
}

interface EmailAddress {
  type: 'work' | 'personal';
  email: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSuccess,
  onCancel,
  initialData
}) => {
  const user = useAuthStore(state => state.user);
  const addToast = useToastStore(state => state.addToast);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    organization: initialData?.organization || '',
    phones: initialData?.phones || [{ type: 'mobile', number: '' }],
    emails: initialData?.emails || [{ type: 'personal', email: '' }],
    owner_id: initialData?.owner_id || user?.id,
    tags: initialData?.tags || [],
    visibility: initialData?.visibility || 'private'
  });

  const handleAddPhone = () => {
    setFormData(prev => ({
      ...prev,
      phones: [...prev.phones, { type: 'mobile', number: '' }]
    }));
  };

  const handleAddEmail = () => {
    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, { type: 'personal', email: '' }]
    }));
  };

  const handlePhoneChange = (index: number, field: keyof PhoneNumber, value: string) => {
    setFormData(prev => ({
      ...prev,
      phones: prev.phones.map((phone, i) => 
        i === index ? { ...phone, [field]: value } : phone
      )
    }));
  };

  const handleEmailChange = (index: number, field: keyof EmailAddress, value: string) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => 
        i === index ? { ...email, [field]: value } : email
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Nome é obrigatório', 'error');
      return;
    }

    setLoading(true);

    try {
      const { error } = initialData
        ? await supabase
            .from('contacts')
            .update({
              ...formData,
              updated_at: new Date().toISOString()
            })
            .eq('id', initialData.id)
        : await supabase
            .from('contacts')
            .insert([{
              ...formData,
              user_id: user?.id
            }]);

      if (error) throw error;
      
      addToast(
        initialData ? 'Contato atualizado com sucesso!' : 'Contato criado com sucesso!',
        'success'
      );
      onSuccess();
    } catch (error) {
      console.error('Error saving contact:', error);
      addToast('Erro ao salvar contato', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nome"
        icon={User}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <Input
        label="Organização"
        icon={Building2}
        value={formData.organization}
        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
      />

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Telefones
        </label>
        {formData.phones.map((phone, index) => (
          <div key={index} className="flex items-center gap-4">
            <select
              value={phone.type}
              onChange={(e) => handlePhoneChange(index, 'type', e.target.value as PhoneNumber['type'])}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="mobile">Celular</option>
              <option value="work">Trabalho</option>
              <option value="home">Casa</option>
            </select>
            
            <div className="flex-1">
              <Input
                icon={Phone}
                value={phone.number}
                onChange={(e) => handlePhoneChange(index, 'number', e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>

            {formData.phones.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    phones: prev.phones.filter((_, i) => i !== index)
                  }));
                }}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddPhone}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" />
          Adicionar telefone
        </button>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          E-mails
        </label>
        {formData.emails.map((email, index) => (
          <div key={index} className="flex items-center gap-4">
            <select
              value={email.type}
              onChange={(e) => handleEmailChange(index, 'type', e.target.value as EmailAddress['type'])}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="personal">Pessoal</option>
              <option value="work">Trabalho</option>
            </select>
            
            <div className="flex-1">
              <Input
                type="email"
                icon={Mail}
                value={email.email}
                onChange={(e) => handleEmailChange(index, 'email', e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            {formData.emails.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    emails: prev.emails.filter((_, i) => i !== index)
                  }));
                }}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddEmail}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" />
          Adicionar e-mail
        </button>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Etiquetas
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Pressione Enter para adicionar"
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = e.currentTarget.value.trim();
                if (value && !formData.tags.includes(value)) {
                  setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, value]
                  }));
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded"
            >
              <Tag className="w-3 h-3" />
              {tag}
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    tags: prev.tags.filter((_, i) => i !== index)
                  }));
                }}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Visibilidade
        </label>
        <select
          value={formData.visibility}
          onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="private">Apenas eu</option>
          <option value="team">Minha equipe</option>
          <option value="public">Todos</option>
        </select>
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
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;