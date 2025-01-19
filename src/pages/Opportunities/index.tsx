import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Opportunity } from '../../types/database.types';
import SearchInput from '../../components/common/SearchInput';
import OpportunityKanban from '../../components/opportunities/OpportunityKanban';
import NewOpportunityModal from '../../components/modals/NewOpportunityModal';
import { useOpportunityStore } from '../../stores/opportunityStore';

const OpportunitiesPage = () => {
  const [loading, setLoading] = useState(true);
  const { opportunities, setOpportunities } = useOpportunityStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para armazenar estatísticas calculadas
  const [stats, setStats] = useState({
    total: 0,
    abertas: 0,
    ganhas: 0,
    perdidas: 0,
    valorTotal: 0,
    probabilidadeMedia: 0,
  });

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`*, lead:leads(name, company)`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOpportunities(data || []);

      // Calcular estatísticas
      const total = data.length;
      const abertas = data.filter((opp) => opp.status === 'aberta').length;
      const ganhas = data.filter((opp) => opp.status === 'ganha').length;
      const perdidas = data.filter((opp) => opp.status === 'perdida').length;
      const valorTotal = data.reduce((sum, opp) => sum + (opp.potential_value || 0), 0);
      const probabilidadeMedia = total
        ? parseFloat((data.reduce((sum, opp) => sum + (opp.closing_probability || 0), 0) / total).toFixed(2))
        : 0;

      setStats({ total, abertas, ganhas, perdidas, valorTotal, probabilidadeMedia });
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter((opp) =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.lead?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderInsights = () => (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Resumo</h3>
      <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        <li>Total de Oportunidades: {stats.total}</li>
        <li>Em Aberto: {stats.abertas}</li>
        <li>Ganhas: {stats.ganhas}</li>
        <li>Perdidas: {stats.perdidas}</li>
        <li>
          Valor Total: {stats.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </li>
        <li>Probabilidade Média: {stats.probabilidadeMedia}%</li>
      </ul>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Pipeline de Oportunidades
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Oportunidade
        </button>
      </div>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar oportunidades..."
        />
      </div>
      {renderInsights()}
      <OpportunityKanban opportunities={filteredOpportunities} loading={loading} />

      <NewOpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOpportunities}
      />
    </div>
  );
};

export default OpportunitiesPage;
