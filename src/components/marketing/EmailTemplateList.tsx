import React from 'react';
import { Mail, Pencil, Trash2 } from 'lucide-react';
import { emailTemplates } from '../../lib/email/templates';
import { useToastStore } from '../../stores/toastStore';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

interface EmailTemplateListProps {
  templates: EmailTemplate[];
  onEdit: (template: EmailTemplate) => void;
  onRefresh: () => void;
}

const EmailTemplateList: React.FC<EmailTemplateListProps> = ({
  templates,
  onEdit,
  onRefresh
}) => {
  const addToast = useToastStore(state => state.addToast);

  const handleDelete = async (template: EmailTemplate) => {
    if (!confirm(`Tem certeza que deseja excluir o template "${template.name}"?`)) {
      return;
    }

    try {
      await emailTemplates.deleteTemplate(template.id);
      addToast('Template excluído com sucesso!', 'success');
      onRefresh();
    } catch (error) {
      console.error('Error deleting template:', error);
      addToast('Erro ao excluir template', 'error');
    }
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Nenhum template encontrado
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map(template => (
        <div
          key={template.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                {template.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(template)}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                title="Editar template"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(template)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Excluir template"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {template.subject}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
              {template.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailTemplateList;