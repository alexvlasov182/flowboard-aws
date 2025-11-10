import { useState } from 'react';
import { usePages } from '../../hooks/usePages';
import { Plus, FileText, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import PageModal from './PageModal';
import NewPageModal from './NewPageModal';
import DeletePageModal from '../../components/ui/DeletePageModal';
import { useDeletePage } from '../../hooks/useDeletePage';
import { useThemeStore } from '../../store/themeStore';

export default function PageList() {
  const { data: pagesData, isLoading, isError, refetch } = usePages();
  const user = useAuthStore((s) => s.user);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [deletePage, setDeletePage] = useState<any>(null);

  const navigate = useNavigate();

  const { mutate: deletePageMutate, isPending: isDeleting } = useDeletePage({
    onSuccess: () => refetch(),
  });

  if (isLoading) {
    return (
      <div className={`text-center py-20 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Loading pages...
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`text-center py-20 ${isDark ? 'text-red-400' : 'text-red-500'}`}>
        Error loading pages
      </div>
    );
  }

  // always ensure pagesData is an array
  const pages = Array.isArray(pagesData) ? pagesData : [];
  const userPages = pages.filter((p: any) => p.userId === user?.id);

  const handleDeleteConfirm = () => {
    if (!deletePage || isDeleting) return;
    deletePageMutate(deletePage.id);
    setDeletePage(null);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen py-16 px-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Pages
          </h1>

          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
          >
            <Plus size={18} /> New Page
          </button>
        </div>

        {userPages.length > 0 ? (
          <div className="space-y-3">
            {userPages.map((page: any) => (
              <motion.div
                key={page.id}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`relative block p-5 rounded-xl shadow-sm hover:shadow-md transition ${
                  isDark
                    ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {/* Clickable area for navigation */}
                <div onClick={() => navigate(`/pages/${page.id}`)} className="cursor-pointer pr-10">
                  <h2
                    className={`text-xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}
                  >
                    {page.title || 'Untitled'}
                  </h2>
                  <p
                    className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {page.content?.slice(0, 120) || 'No content yet...'}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletePage(page);
                  }}
                  className={`absolute top-5 right-5 p-2 rounded-full transition ${
                    isDark
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                      : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                  }`}
                  title="Delete page"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center mt-20 py-16 px-8"
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
              className={`text-center max-w-md mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Get started by creating your first page. Organize your thoughts, ideas, and projects
              all in one place.
            </p>
          </motion.div>
        )}
      </div>

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

      <DeletePageModal
        isOpen={!!deletePage}
        onClose={() => setDeletePage(null)}
        onConfirm={handleDeleteConfirm}
        pageTitle={deletePage?.title}
      />
    </div>
  );
}
