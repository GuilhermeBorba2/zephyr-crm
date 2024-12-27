import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import Modal from '../common/Modal';
import { supabase } from '../../lib/supabase';
import { useToastStore } from '../../stores/toastStore';
import StageItem from './StageItem';
import ColorPicker from './ColorPicker';

const PipelineStageModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<any>(null);
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    if (isOpen) loadStages();
  }, [isOpen]);

  const loadStages = async () => {
    try {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setStages(data || []);
    } catch (error) {
      console.error('Error loading stages:', error);
      addToast('Erro ao carregar estágios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setStages(items => {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);

      const newItems = [...items];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);

      return newItems.map((item, index) => ({
        ...item,
        order_index: index
      }));
    });
  };

  const handleAddStage = () => {
    setStages(prev => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        name: 'Novo Estágio',
        color: '#E5E7EB',
        order_index: prev.length
      }
    ]);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('pipeline_stages')
        .upsert(stages);

      if (error) throw error;
      
      addToast('Estágios salvos com sucesso!', 'success');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving stages:', error);
      addToast('Erro ao salvar estágios', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gerenciar Estágios do Pipeline"
    >
      <div className="space-y-6">
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          <SortableContext items={stages} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {stages.map((stage) => (
                <StageItem
                  key={stage.id}
                  stage={stage}
                  onNameChange={(value) => {
                    setStages(stages.map(s =>
                      s.id === stage.id ? { ...s, name: value } : s
                    ));
                  }}
                  onColorClick={() => setSelectedStage(stage)}
                  onDelete={() => {
                    setStages(stages.filter(s => s.id !== stage.id));
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          onClick={handleAddStage}
          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Adicionar Estágio
        </button>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>

      {selectedStage && (
        <ColorPicker
          color={selectedStage.color}
          onChange={(color) => {
            setStages(stages.map(s =>
              s.id === selectedStage.id ? { ...s, color } : s
            ));
          }}
          onClose={() => setSelectedStage(null)}
        />
      )}
    </Modal>
  );
};

export default PipelineStageModal;