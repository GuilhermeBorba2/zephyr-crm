import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { supabase } from '../../lib/supabase';
import LeadsKanban from '../../components/leads/LeadsKanban';
import SearchInput from '../../components/common/SearchInput';
import NewLeadModal from '../../components/modals/NewLeadModal';
import { useToastStore } from '../../stores/toastStore';
import { isValidLeadStatus } from '../../constants/leadStatuses';

const LeadsPage = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      addToast('Erro ao carregar leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const newStatus = over.id as string;
    if (!isValidLeadStatus(newStatus)) {
      addToast('Status inválido', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', active.id);

      if (error) throw error;

      setLeads(leads.map(lead => 
        lead.id === active.id ? { ...lead, status: newStatus } : lead
      ));
      
      addToast('Lead atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Error updating lead:', error);
      addToast('Erro ao atualizar lead', 'error');
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Leads
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Novo Lead
        </button>
      </div>

      <div className="mb-6">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar leads..."
        />
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <LeadsKanban leads={filteredLeads} loading={loading} onRefresh={fetchLeads} />
      </DndContext>

      <NewLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLeads}
      />
    </div>
  );
};

export default LeadsPage;