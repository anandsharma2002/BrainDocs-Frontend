import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import TopicPage from './pages/TopicPage';

import { Toaster } from 'react-hot-toast';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-slate-900 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      <Toaster position="top-right" toastOptions={{
        className: 'font-medium text-sm',
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          padding: '12px 20px',
          borderRadius: '12px',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#f0fdf4',
          },
        },
      }} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="mr-4 text-slate-600 hover:text-slate-900 transition-colors">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-slate-900 tracking-tight">BrainDocs</span>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/topic/:topicSlug" element={<TopicPage />} />
            <Route path="/topic/:topicSlug/:subSlug" element={<TopicPage />} />
            <Route path="/topic/:topicSlug/:subSlug/:secondarySlug" element={<TopicPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
