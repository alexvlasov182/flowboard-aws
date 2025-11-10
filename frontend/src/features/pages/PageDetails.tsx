import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { usePages } from '../../hooks/usePages';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { debounce } from 'lodash';
import { useThemeStore } from '../../store/themeStore';

export default function PageDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPageById } = usePages();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [page, setPage] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getPageById(id);
        if (!data) throw new Error('Page not found');
        setPage({ title: data.title || '', content: data.content || '' });
      } catch (error) {
        console.error(error);
        setPage(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const saveChanges = async (updated: { title?: string; content?: string }) => {
    if (!id || !page) return;
    try {
      setStatus('saving');
      await api.put(`/pages/${id}`, { ...page, ...updated });
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1500);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const debouncedSave = useCallback(debounce(saveChanges, 1000), [id, page]);

  const handleChange = (field: 'title' | 'content', value: string) => {
    if (!page) return;
    const updatedPage = { ...page, [field]: value };
    setPage(updatedPage);
    debouncedSave({ [field]: value });
  };

  if (loading) {
    return <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading page...</p>;
  }

  if (!page) {
    return <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Page not found.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl mx-auto py-10"
    >
      <button
        onClick={() => navigate('/pages')}
        className={`flex items-center gap-2 text-sm transition ${
          isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <ArrowLeft size={16} /> Back to Pages
      </button>

      <input
        className={`w-full text-3xl font-semibold border-none focus:outline-none bg-transparent ${
          isDark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'
        }`}
        value={page.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="Untitled"
      />

      <textarea
        className={`w-full h-[60vh] rounded-lg p-4 shadow-sm focus:ring-2 focus:ring-brand-400 focus:outline-none transition-colors ${
          isDark
            ? 'bg-white/5 border-white/10 text-gray-100 placeholder-gray-500'
            : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
        }`}
        value={page.content}
        onChange={(e) => handleChange('content', e.target.value)}
        placeholder="Start writing your notes..."
      />

      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {status === 'saving' && '💾 Saving...'}
        {status === 'saved' && '✅ All changes saved'}
        {status === 'error' && '❌ Failed to save'}
      </div>
    </motion.div>
  );
}
