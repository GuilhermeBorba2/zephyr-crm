import React from 'react';
import { Mail, Phone, Building2, Tag } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  organization?: string;
  emails: { type: string; email: string }[];
  phones: { type: string; number: string }[];
  tags?: string[];
}

interface ContactListProps {
  contacts: Contact[];
  loading: boolean;
  onRefresh: () => void;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  loading,
  onRefresh
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Nenhum contato encontrado
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map(contact => (
        <div
          key={contact.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {contact.name}
          </h3>

          <div className="space-y-3">
            {contact.organization && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Building2 className="w-4 h-4" />
                <span>{contact.organization}</span>
              </div>
            )}

            {contact.emails?.[0] && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <a
                  href={`mailto:${contact.emails[0].email}`}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {contact.emails[0].email}
                </a>
                <span className="text-xs text-gray-500">
                  ({contact.emails[0].type})
                </span>
              </div>
            )}

            {contact.phones?.[0] && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <a
                  href={`tel:${contact.phones[0].number}`}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {contact.phones[0].number}
                </a>
                <span className="text-xs text-gray-500">
                  ({contact.phones[0].type})
                </span>
              </div>
            )}

            {contact.tags && contact.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {contact.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;