import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface PipelineControlsProps {
  onCustomizeCards: () => void;
}

const PipelineControls: React.FC<PipelineControlsProps> = ({
  onCustomizeCards
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <Settings className="w-3.5 h-3.5" />
        Pipeline
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <button
              onClick={() => {
                onCustomizeCards();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Personalizar cartões de negócios
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PipelineControls;