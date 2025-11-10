import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export default function NewPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!user) return alert('You must be logged in');

    try {
      await api.post('/pages', {
        title,
        content,
        userId: user.id,
      });

      // Redirect to page list after creation
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to create page');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">New Page</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 border rounded mb-3"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full p-2 border rounded mb-3"
          rows={5}
        />
        <button
          onClick={handleCreate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white py-2 rounded"
        >
          Create Page
        </button>
      </div>
    </div>
  );
}
