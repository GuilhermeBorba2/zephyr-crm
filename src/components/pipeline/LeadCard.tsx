import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Lead } from '../../types/database.types';

interface LeadCardProps {
  lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: lead.id
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-shadow cursor-move"
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
  );
}

export default LeadCard;