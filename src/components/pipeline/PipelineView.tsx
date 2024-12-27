import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { supabase } from '../../lib/supabase';
import PipelineStage from './PipelineStage';
import LeadCard from './LeadCard';
import { useToastStore } from '../../stores/toastStore';

const PipelineView = () => {
  const [stages, setStages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    loadPipeline();
  }, []);

  const loadPipeline = async () => {
    try {
      const [stagesResult, leadsResult] = await Promise.all([
        supabase.from('pipeline_stages').select('*').order('order_index'),
        supabase.from('leads').select('*')
      ]);

      if (stagesResult.error) throw stagesResult.error;
      if (leadsResult.error) throw leadsResult.error;

      setStages(stagesResult.data || []);
      setLeads(leadsResult.data || []);
    } catch (error) {
      console.error('Error loading pipeline:', error);
      addToast('Erro ao carregar pipeline', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ stage_id: over.id })
        .eq('id', active.id);

      if (error) throw error;

      setLeads(leads.map(lead => 
        lead.id === active.id ? { ...lead, stage_id: over.id } : lead
      ));
    } catch (error) {
      console.error('Error updating lead stage:', error);
      addToast('Erro ao atualizar estágio do lead', 'error');
    }
  };

  if (loading) {
    return <div>Carregando pipeline...</div>;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-4">
        {stages.map(stage => {
          const stageLeads = leads.filter(lead => lead.stage_id === stage.id);
          const totalValue = stageLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);

          return (
            <PipelineStage
              key={stage.id}
              id={stage.id}
              title={stage.name}
              leads={stageLeads}
              totalValue={totalValue}
              color={stage.color}
            />
          );
        })}
      </div>
    </DndContext>
  );
};

export default PipelineView;