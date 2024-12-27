import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Search } from 'lucide-react';
import { useCardCustomizationStore } from '../../stores/cardCustomizationStore';
import { useToastStore } from '../../stores/toastStore';

interface CardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CardCustomizationModal: React.FC<CardCustomizationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { visibleFields, setVisibleFields } = useCardCustomizationStore();
  const addToast = useToastStore(state => state.addToast);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFields, setSelectedFields] = useState(visibleFields);

  const availableFields = [
    { id: 'title', label: 'Título', group: 'Lead' },
    { id: 'person', label: 'Pessoa vinculada', group: 'Lead' },
    { id: 'organization', label: 'Organização vinculada', group: 'Lead' },
    { id: 'value', label: 'Valor', group: 'Lead' },
    { id: 'owner', label: 'Proprietário', group: 'Lead' },
    { id: 'tag', label: 'Etiqueta', group: 'Lead' }
  ];

  const handleToggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleSave = () => {
    setVisibleFields(selectedFields);
    addToast('Configurações salvas com sucesso!', 'success');
    onClose();
  };

  const filteredFields = availableFields.filter(field =>
    field.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Personalizar cartões de negócios"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Selecione campos a serem exibidos em um cartão de negócios para Pipeline. 
          Esta configuração se aplica apenas à sua visualização.
        </p>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar campos..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
              VISÍVEL NO CARTÃO DO NEGÓCIO ({selectedFields.length}/6)
            </h4>
            <div className="space-y-1">
              {filteredFields.map(field => (
                <label
                  key={field.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.id)}
                    onChange={() => handleToggleField(field.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {field.label}
                  </span>
                  <span className="text-xs text-gray-500">({field.group})</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSelectedFields([])}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Padrão
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
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
    </Modal>
  );
};

export default CardCustomizationModal;