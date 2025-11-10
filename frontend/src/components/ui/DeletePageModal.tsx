import Modal from './Modal';
import type { FC } from 'react';

type DeletePageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pageTitle?: string;
};

const DeletePageModal: FC<DeletePageModalProps> = ({ isOpen, onClose, onConfirm, pageTitle }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Delete Page?</h2>

        <p className="text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">"{pageTitle || 'this page'}"</span>?
        </p>

        <p className="text-sm text-gray-500">This action cannot be undone.</p>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeletePageModal;
