import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { BookOpen, FileText, Plus, User, ArrowRight, Zap, Shield, Layout } from 'lucide-react';

const Home = () => {
    const { isAuthenticated, user } = useAuth();
    const [topics, setTopics] = useState([]);
    const [stats, setStats] = useState({ totalTopics: 0, totalDocs: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchDashboardData = async () => {
        try {
            const res = await axios.get('/api/topics');
            const fetchedTopics = res.data;
            setTopics(fetchedTopics);

            // Calculate Stats
            let docCount = 0;
            fetchedTopics.forEach(t => {
                docCount += t.subheadings?.length || 0;
            });

            setStats({
                totalTopics: fetchedTopics.length,
                totalDocs: docCount
            });
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // --- LANDING PAGE (Unauthenticated) ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen">
                {/* Hero Section */}
                <div className="relative pt-20 pb-32 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-[-1]">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] animate-float"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="container-responsive text-center">
                        <div className="inline-block p-1 px-3 mb-6 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium animate-fade-in">
                            ✨ v2.0 is likely here
                        </div>
                        <h1 className="text-6xl md:text-7xl font-display font-bold text-slate-900 mb-8 tracking-tight leading-[1.1] animate-slide-up">
                            Document your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                genius ideas.
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            BrainDocs is the minimal, lightning-fast documentation hub for developers, writers, and teams. Organize your knowledge in seconds.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                                Get Started <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold transition-all hover:-translate-y-1">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="py-24 bg-white/50 backdrop-blur-3xl border-t border-slate-100">
                    <div className="container-responsive">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: Zap, title: "Lightning Fast", desc: "Built with modern tech for instant page loads and real-time updates." },
                                { icon: Shield, title: "Secure by Default", desc: "Enterprise-grade security with JWT authentication and protected routes." },
                                { icon: Layout, title: "Beautiful Design", desc: "Distraction-free interface designed for reading and writing." }
                            ].map((feature, idx) => (
                                <div key={idx} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                        <feature.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- DASHBOARD (Authenticated) ---
    return (
        <div className="min-h-screen pb-12">
            {/* Dashboard Header */}
            <div className="bg-white border-b border-slate-100 pt-8 pb-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                        <div>
                            <p className="text-slate-500 font-medium mb-2">Overview</p>
                            <h1 className="text-4xl font-display font-bold text-slate-900">
                                Welcome back, {user?.name.split(' ')[0]}! 👋
                            </h1>
                        </div>
                        <div className="flex gap-3">
                            <Link to="/admin" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                                <Plus size={18} /> New Topic
                            </Link>
                            <Link to="/profile" className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all hover:-translate-y-0.5 flex items-center gap-2">
                                <User size={18} /> Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-8 space-y-10">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Total Topics</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stats.totalTopics}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <FileText size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Total Documents</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stats.totalDocs}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-600/20 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                            <Zap size={100} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-blue-100 font-medium mb-1">Quick Tip</p>
                            <h3 className="text-lg font-bold leading-tight">
                                Use Markdown shortcuts to write faster documentation.
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Recent Topics</h2>
                        <Link to="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    {topics.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topics.slice(0, 6).map((topic) => (
                                <Link
                                    key={topic._id}
                                    to={`/topic/${topic.slug}`}
                                    className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2.5 bg-slate-50 group-hover:bg-blue-50 text-slate-500 group-hover:text-blue-600 rounded-xl transition-colors">
                                            <BookOpen size={20} />
                                        </div>
                                        {topic.isPublic ? (
                                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">Public</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">Private</span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {topic.title}
                                    </h3>

                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                                        {topic.description || "No description provided."}
                                    </p>

                                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
                                        {topic.owner?.avatar ? (
                                            <img src={topic.owner.avatar} alt="Owner" className="w-6 h-6 rounded-full" />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-slate-200" />
                                        )}
                                        <span className="text-xs text-slate-400 font-medium">
                                            {new Date(topic.createdAt || Date.now()).toLocaleDateString()}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
                            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">No topics yet</h3>
                            <p className="text-slate-500 mb-6">Create your first topic to get started.</p>
                            <Link to="/admin" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                                <Plus size={18} /> Create Topic
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Home;
