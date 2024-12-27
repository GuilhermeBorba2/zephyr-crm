import React from 'react';
import Modal from '../common/Modal';
import ContactForm from '../contacts/ContactForm';
import { useToastStore } from '../../stores/toastStore';

interface NewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewContactModal: React.FC<NewContactModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const addToast = useToastStore(state => state.addToast);

  const handleSuccess = () => {
    addToast('Contato criado com sucesso!', 'success');
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Contato"
      maxWidth="max-w-3xl"
    >
      <ContactForm
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default NewContactModal;