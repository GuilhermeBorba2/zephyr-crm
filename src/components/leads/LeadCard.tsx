import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Building2, DollarSign, Tag, User } from 'lucide-react';
import EditLeadModal from '../modals/EditLeadModal';
import { Lead } from '../../constants/leadStatuses';
import { useCardCustomizationStore } from '../../stores/cardCustomizationStore';



const LeadCard: React.FC<{ lead: Lead; onRefresh: () => void }> = ({ lead, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const visibleFields = useCardCustomizationStore((state) => state.visibleFields);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: { ...lead },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isDragging ? 0.6 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };

  const leadValue = typeof lead.value === 'string' ? parseFloat(lead.value) : lead.value || 0;

  const renderField = (field: string) => {
    switch (field) {
      case 'title':
        return (
          <div className="font-medium text-gray-900 dark:text-white">
            {lead.name}
          </div>
        );
      case 'organization':
        return lead.company && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Building2 className="w-4 h-4" />
            <span>{lead.company}</span>
          </div>
        );
      case 'value':
        return leadValue > 0 && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
            <DollarSign className="w-4 h-4" />
            {leadValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        );
      case 'owner':
        return lead.user_id && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4" />
            <span>Proprietário</span>
          </div>
        );
      case 'tag':
        return lead.source && (
          <div className="flex items-center gap-2 text-sm">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
              {lead.source}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onDoubleClick={() => setIsModalOpen(true)}
        className="group relative p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all"
        title="Clique duas vezes para editar"
      >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Clique duas vezes para editar
        </div>

        <div className="space-y-2">
          {visibleFields.map((field) => (
            <React.Fragment key={field}>{renderField(field)}</React.Fragment>
          ))}
        </div>
      </div>

      <EditLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          onRefresh();
        }}
        lead={{
          ...lead,
          phone: lead.phone || '',
          status: lead.status || 'new',
          notes: lead.notes || '',
          company: lead.company || '',
          source: lead.source || 'other',
          user_id: lead.user_id || '',
        }}
      />
    </>
  );
};

export default LeadCard;
