import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

interface StageItemProps {
  stage: {
    id: string;
    name: string;
    color: string;
  };
  onNameChange: (value: string) => void;
  onColorClick: () => void;
  onDelete: () => void;
}

const StageItem: React.FC<StageItemProps> = ({
  stage,
  onNameChange,
  onColorClick,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
    >
      <div {...attributes} {...listeners}>
        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
      </div>
      
      <div className="flex-1">
        <input
          type="text"
          value={stage.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3 py-1.5 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div
        className="w-8 h-8 rounded-md cursor-pointer border border-gray-200"
        style={{ backgroundColor: stage.color }}
        onClick={onColorClick}
      />

      <button
        onClick={onDelete}
        className="p-1 text-gray-400 hover:text-red-500"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default StageItem;