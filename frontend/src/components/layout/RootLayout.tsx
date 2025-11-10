import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, FileText, Home, Sun, Moon, Menu, X } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import React, { useState } from 'react';

type RootLayoutProps = {
  children?: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return <>{children || <Outlet />}</>;

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/pages', label: 'Pages', icon: <FileText size={20} /> },
  ];

  const isDark = theme === 'dark';

  const Sidebar = () => (
    <aside
      className={`flex flex-col h-full ${isDark ? 'bg-[#191919] border-[#2f2f2f]' : 'bg-[#f7f6f3] border-gray-200'} border-r transition-colors duration-200`}
    >
      {/* Header */}
      <div className={`px-4 py-3 border-b ${isDark ? 'border-[#2f2f2f]' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-md ${isDark ? 'bg-white/10' : 'bg-gray-900'} flex items-center justify-center`}
            >
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-white'}`}>F</span>
            </div>
            <div>
              <h1 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                FlowBoard
              </h1>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 hover:bg-white/5 rounded"
          >
            <X size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className={`px-3 py-2 mx-3 mt-2 rounded-md ${isDark ? 'bg-white/5' : 'bg-white/50'}`}>
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} flex items-center justify-center`}
          >
            <span className={`text-xs font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}>
            {user.name || user.email}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group
                ${
                  isActive
                    ? isDark
                      ? 'bg-white/10 text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                    : isDark
                      ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                }`}
            >
              <span className={`${isActive ? (isDark ? 'text-white' : 'text-gray-900') : ''}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className={`p-3 border-t ${isDark ? 'border-[#2f2f2f]' : 'border-gray-200'} space-y-2`}>
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-all
            ${
              isDark
                ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
            }`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={clearAuth}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-all
            ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div
      className={`flex h-screen overflow-hidden ${isDark ? 'bg-[#191919] text-gray-100' : 'bg-white text-gray-800'} transition-colors duration-200`}
    >
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-50 md:hidden">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div
          className={`md:hidden sticky top-0 z-30 px-4 py-3 border-b backdrop-blur-lg ${isDark ? 'bg-[#191919]/80 border-[#2f2f2f]' : 'bg-white/80 border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-md ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
            >
              <Menu size={20} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
            </button>
            <h1 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              FlowBoard
            </h1>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page Content */}
        <div className="px-4 md:px-12 lg:px-20 py-8 md:py-12 max-w-[1200px] mx-auto">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
