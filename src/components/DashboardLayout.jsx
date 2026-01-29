import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import AdminDashboard from '../pages/AdminDashboard';
import TopicPage from '../pages/TopicPage';
import Profile from '../pages/Profile';

const DashboardLayout = () => {
    const { isAuthenticated } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            {isAuthenticated && (
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            )}

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-0">
                {/* Navbar */}
                <div className={`fixed top-0 left-0 right-0 z-30 ${isAuthenticated ? 'md:left-64' : ''}`}>
                    <Navbar showBrand={!isAuthenticated} />

                    {/* Mobile Sidebar Toggle - Only show if authenticated and on mobile */}
                    {isAuthenticated && (
                        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center">
                            <button onClick={() => setIsSidebarOpen(true)} className="mr-3 text-slate-600 hover:text-slate-900 transition-colors">
                                <Menu size={24} />
                            </button>
                            <span className="font-bold text-lg text-slate-900 tracking-tight">Topics</span>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin" element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="/topic/:topicSlug" element={<TopicPage />} />
                        <Route path="/topic/:topicSlug/:subSlug" element={<TopicPage />} />
                        <Route path="/topic/:topicSlug/:subSlug/:secondarySlug" element={<TopicPage />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default DashboardLayout;
