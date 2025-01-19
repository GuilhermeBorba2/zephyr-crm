import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import LeadCard from './LeadCard';
import { Lead } from '../../constants/leadStatuses';
import { LeadStatus } from '../../constants/leadStatuses';
import { Settings } from 'lucide-react';
import CardCustomizationModal from './CardCustomizationModal';
import { LEAD_STATUS_CONFIG} from '../../constants/leadStatuses';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  leads: { id: string; value: number | string; status: LeadStatus; name: string; created_at: string; email: string; phone: string }[];
  onRefresh: () => void;
}

interface LeadsKanbanProps {
  leads: { id: string; value: number | string; status: LeadStatus; name: string; created_at: string; email: string; phone: string }[];
  loading: boolean;
  onRefresh: () => void;
}


const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, color, leads, onRefresh }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  const totalValue = leads.reduce((sum: number, lead: { value: number | string }) => {
    const value = typeof lead.value === 'string' ? parseFloat(lead.value) : (lead.value || 0);
    return sum + value;
  }, 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-[220px] bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-transform duration-200 ${
        isOver ? 'ring-4 ring-blue-400 scale-105 shadow-lg' : ''
      }`}
    >
      <div className={`p-2 border-t-4 ${color} rounded-t-lg`}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {leads.length}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>

      <div className="p-2 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        <SortableContext items={leads.map(lead => lead.id)} strategy={horizontalListSortingStrategy}>
          {leads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onRefresh={onRefresh}
              className="transition-transform duration-200 ease-in-out hover:scale-105"
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

 
const LeadsKanban: React.FC<LeadsKanbanProps> = ({ leads, loading, onRefresh }) => {
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[220px] h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsCustomizeOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-md"
        >
          <Settings className="w-4 h-4" />
          Personalizar Cartões
        </button>
      </div>

      <div className="flex flex-wrap gap-4 pb-4">
        {LEAD_STATUS_CONFIG.map(stage => (
          <KanbanColumn
            key={stage.id}
            id={stage.id}
            title={stage.title}
            color={stage.color}
            leads={leads.filter(lead => lead.status === stage.id)}
            onRefresh={onRefresh}
          />
        ))}
      </div>

      <CardCustomizationModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
      />
    </>
  );
};

export default LeadsKanban;
