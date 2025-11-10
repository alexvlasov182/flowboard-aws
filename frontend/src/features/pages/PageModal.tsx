import { useState } from 'react';
import api from '../../lib/api';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Toast from '../../components/ui/Toast';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  page: any;
  onDeleted: () => void;
  onUpdated: () => void;
};

export default function PageModal({ isOpen, onClose, page, onDeleted, onUpdated }: Props) {
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await api.put(`/pages/${page.id}`, { title, content });
      setToast({ message: 'Page updated!', type: 'success' });
      onUpdated();
    } catch {
      setToast({ message: 'Failed to update', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/pages/${page.id}`);
      setToast({ message: 'Page deleted!', type: 'success' });
      onDeleted();
      onClose();
    } catch {
      setToast({ message: 'Failed to delete', type: 'error' });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-medium border-b border-gray-200 text-gray-700 focus:outline-none pb-2"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border-none focus:outline-none text-gray-700 min-h-[200px]"
          />
          <div className="flex justify-between pt-4">
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
            >
              Delete
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Page?"
        description="Are you sure you want to delete this page? This action cannot be undone."
        loading={loading}
      />

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type as 'success' | 'error' | 'info'}
          onClose={() => setToast({ message: '', type: 'info' })}
        />
      )}
    </>
  );
}
