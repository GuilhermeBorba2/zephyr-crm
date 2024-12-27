import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import PipelineView from '../../components/pipeline/PipelineView';
import PipelineStageModal from '../../components/pipeline/PipelineStageModal';

const PipelinePage = () => {
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Pipeline de Vendas
        </h1>
        <button
          onClick={() => setIsStageModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Settings className="w-4 h-4" />
          Configurar Estágios
        </button>
      </div>

      <PipelineView />

      <PipelineStageModal
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
      />
    </div>
  );
};

export default PipelinePage;