import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

// Very simple editor: load page, allow editing title & content, save.
export default function PageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (id && id !== 'new') {
      api
        .get(`/api/pages/${id}`)
        .then((res) => {
          const payload = res.data?.data ?? res.data;
          setTitle(payload.title || '');
          setContent(payload.content || '');
        })
        .catch(console.error);
    }
  }, [id]);

  const handleSave = async () => {
    try {
      if (id === 'new') {
        await api.post('/api/pages', { title, content, userId: 1 });
      } else {
        await api.put(`/api/pages/${id}`, { title, content });
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full text-2xl font-semibold mb-4 p-2 border-b"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        className="w-full p-4 border rounded mb-4"
      />
      <div className="flex gap-2">
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={() => navigate(-1)} className="bg-gray-200 text-black">
          Cancel
        </Button>
      </div>
    </div>
  );
}
