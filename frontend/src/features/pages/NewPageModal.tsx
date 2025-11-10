import { useState } from 'react';
import api from '../../lib/api';
import Modal from '../../components/ui/Modal';
import { useAuthStore } from '../../store/authStore';
import Toast from '../../components/ui/Toast';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function NewPageModal({ isOpen, onClose, onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const user = useAuthStore((s) => s.user);

  const handleCreate = async () => {
    if (!user) return setToast({ message: 'You must be logged in', type: 'error' });
    if (!title.trim()) return setToast({ message: 'Please enter a title', type: 'error' });

    try {
      setLoading(true);
      await api.post('/pages', { title, content, userId: user.id });
      setToast({ message: 'Page created successfully!', type: 'success' });
      onCreated();
      onClose();
    } catch {
      setToast({ message: 'Failed to create page', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Create New Page</h2>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Page title..."
            className="w-full text-xl font-medium border-b border-gray-200 focus:outline-none pb-2"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your notes..."
            className="w-full border-none focus:outline-none text-gray-700 min-h-[200px]"
          />
          <div className="flex justify-end pt-4">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              {loading ? 'Creating...' : 'Create Page'}
            </button>
          </div>
        </div>
      </Modal>

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
