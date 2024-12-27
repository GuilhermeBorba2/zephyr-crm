import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ContactList from '../../components/contacts/ContactList';
import NewContactModal from '../../components/modals/NewContactModal';
import SearchInput from '../../components/common/SearchInput';
import { useToastStore } from '../../stores/toastStore';
import { googleContacts } from '../../lib/google/contacts';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name');

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      addToast('Erro ao carregar contatos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSync = async () => {
    try {
      await googleContacts.authorize();
    } catch (error) {
      console.error('Error syncing with Google:', error);
      addToast('Erro ao sincronizar com Google Contatos', 'error');
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Contatos
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoogleSync}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Sincronizar com Google
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Novo Contato
          </button>
        </div>
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por nome, organização ou etiqueta..."
        />
      </div>

      <ContactList
        contacts={filteredContacts}
        loading={loading}
        onRefresh={fetchContacts}
      />

      <NewContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchContacts}
      />
    </div>
  );
};

export default ContactsPage;