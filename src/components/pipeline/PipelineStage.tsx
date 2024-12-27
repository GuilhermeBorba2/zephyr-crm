import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Lead } from '../../types/database.types';

interface PipelineStageProps {
  id: string;
  title: string;
  leads: Lead[];
  totalValue: number;
  color: string;
}

const PipelineStage: React.FC<PipelineStageProps> = ({
  id,
  title,
  leads,
  totalValue,
  color
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id
  });

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col h-full min-w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-sm ${
        isOver ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className={`p-4 border-t-4 ${color} rounded-t-lg`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {leads.length}
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          R$ {totalValue.toLocaleString('pt-BR')}
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {leads.map(lead => (
          <div 
            key={lead.id}
            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="font-medium text-gray-900 dark:text-white">
              {lead.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {lead.company}
            </div>
            {lead.value > 0 && (
              <div className="mt-1 text-sm font-medium text-green-600 dark:text-green-400">
                R$ {lead.value.toLocaleString('pt-BR')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineStage;