import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus } from 'lucide-react';
import { usePages } from '../../hooks/usePages';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import NewPageModal from '../pages/NewPageModal';
import PageModal from '../pages/PageModal';
import { useNavigate } from 'react-router-dom';

export default function MainDashboard() {
  const navigate = useNavigate();
  const { data: pagesData, isLoading, isError, refetch } = usePages();
  const user = useAuthStore((s) => s.user);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);

  // ensure pagesData is always an array
  const pages = Array.isArray(pagesData) ? pagesData : [];
  const userPages = pages.filter((p: any) => p.userId === user?.id);
  const totalPages = userPages.length;
  const recentPages = userPages.slice(-3).reverse();

  if (isLoading) {
    return (
      <div className={`text-center py-20 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Loading dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`text-center py-20 ${isDark ? 'text-red-400' : 'text-red-500'}`}>
        Error loading data
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-16 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, {user?.name} 👋
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              You have{' '}
              <span className={`font-semibold ${isDark ? 'text-brand-400' : 'text-brand-600'}`}>
                {totalPages}
              </span>{' '}
              {totalPages === 1 ? 'page' : 'pages'} in your workspace.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
          >
            <Plus size={18} /> New Page
          </button>
        </div>

        {/* Recent Pages */}
        <h2 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Recent Pages
        </h2>

        {recentPages.length > 0 ? (
          <div className="space-y-3">
            {recentPages.map((page: any) => (
              <motion.div
                key={page.id}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => setSelectedPage(page)}
                className={`block p-5 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer ${
                  isDark
                    ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <h2
                  className={`text-xl font-semibold mb-1 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {page.title || 'Untitled'}
                </h2>
                <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {page.content?.slice(0, 120) || 'No content yet...'}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center mt-20 py-16 px-8 text-center"
          >
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-full blur-2xl opacity-50 ${
                  isDark ? 'bg-brand-500/20' : 'bg-brand-100'
                }`}
              ></div>
              <div className="relative p-6 rounded-2xl">
                <FileText
                  size={48}
                  className={isDark ? 'text-gray-600' : 'text-gray-400'}
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <h3
              className={`text-2xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}
            >
              No pages yet
            </h3>
            <p
              className={`text-center max-w-md mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              You don't have any pages yet. Start creating to organize your thoughts and projects.
            </p>
          </motion.div>
        )}

        {/* Link to All Pages */}
        {totalPages > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/pages')}
              className={`inline-flex items-center font-medium group ${
                isDark
                  ? 'text-brand-400 hover:text-brand-300'
                  : 'text-brand-600 hover:text-brand-700'
              }`}
            >
              <span>All pages</span>
              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedPage && (
        <PageModal
          page={selectedPage}
          isOpen={!!selectedPage}
          onClose={() => setSelectedPage(null)}
          onDeleted={() => {
            setSelectedPage(null);
            refetch();
          }}
          onUpdated={() => refetch()}
        />
      )}

      {showNewModal && (
        <NewPageModal
          isOpen={showNewModal}
          onClose={() => setShowNewModal(false)}
          onCreated={() => refetch()}
        />
      )}
    </div>
  );
}
