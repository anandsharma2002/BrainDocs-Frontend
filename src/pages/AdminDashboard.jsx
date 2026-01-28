import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [topics, setTopics] = useState([]);
    const [newTopic, setNewTopic] = useState({ title: '', slug: '', description: '' });
    const [newSub, setNewSub] = useState({ topicId: '', title: '', slug: '', content: '' });
    const [newSec, setNewSec] = useState({ topicId: '', subheadingId: '', title: '', slug: '', content: '' });

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/topics');
            setTopics(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/topics', newTopic);
            setNewTopic({ title: '', slug: '', description: '' });
            fetchTopics();
            toast.success('Topic Created Successfully!');
        } catch (err) {
            toast.error('Error: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleCreateSub = async (e) => {
        e.preventDefault();
        if (!newSub.topicId) return toast.error('Please select a parent topic');
        try {
            await axios.post(`http://localhost:5000/api/topics/${newSub.topicId}/subheadings`, {
                title: newSub.title,
                slug: newSub.slug,
                content: []
            });
            setNewSub(prev => ({ ...prev, title: '', slug: '' }));
            fetchTopics();
            toast.success('Subheading Added Successfully!');
        } catch (err) {
            toast.error('Error: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleCreateSec = async (e) => {
        e.preventDefault();
        if (!newSec.topicId || !newSec.subheadingId) return toast.error('Please select topic and subheading');

        try {
            await axios.post(`http://localhost:5000/api/topics/${newSec.topicId}/subheadings/${newSec.subheadingId}/secondary`, {
                title: newSec.title,
                slug: newSec.slug,
                content: []
            });
            setNewSec(prev => ({ ...prev, title: '', slug: '' }));
            fetchTopics();
            toast.success('Secondary Heading Added Successfully!');
        } catch (err) {
            toast.error('Error: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
                <div className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                    Content Management
                </div>
            </div>

            {/* Create Topic */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-800">Create Main Topic</h2>
                </div>
                <form onSubmit={handleCreateTopic} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">Topic Title</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                value={newTopic.title}
                                onChange={e => setNewTopic({ ...newTopic, title: e.target.value })}
                                required
                                placeholder="e.g. React Fundamentals"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">Route</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                value={newTopic.slug}
                                onChange={e => setNewTopic({ ...newTopic, slug: e.target.value })}
                                required
                                placeholder="e.g. react-fundamentals"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                        Create Topic
                    </button>
                </form>
            </div>

            {/* Create Subheading */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-800">Add Subheading (Level 2)</h2>
                </div>
                <form onSubmit={handleCreateSub} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700">Parent Topic</label>
                        <select
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800"
                            value={newSub.topicId}
                            onChange={e => setNewSub({ ...newSub, topicId: e.target.value })}
                            required
                        >
                            <option value="">Select a topic...</option>
                            {topics.map(t => (
                                <option key={t._id} value={t._id}>{t.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">Subheading Title</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                value={newSub.title}
                                onChange={e => setNewSub({ ...newSub, title: e.target.value })}
                                required
                                placeholder="e.g. Hooks"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">Route</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                value={newSub.slug}
                                onChange={e => setNewSub({ ...newSub, slug: e.target.value })}
                                required
                                placeholder="e.g. hooks"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                        Add Subheading
                    </button>
                </form>
            </div>

            {/* Create Secondary Heading */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-800">Add Secondary Heading (Level 3)</h2>
                </div>
                <form onSubmit={handleCreateSec} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">Select Topic</label>
                            <select
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800"
                                value={newSec.topicId}
                                onChange={e => setNewSec({ ...newSec, topicId: e.target.value, subheadingId: '' })}
                                required
                            >
                                <option value="">Select a topic...</option>
                                {topics.map(t => (
                                    <option key={t._id} value={t._id}>{t.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">Select Subheading</label>
                            <select
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                value={newSec.subheadingId}
                                onChange={e => setNewSec({ ...newSec, subheadingId: e.target.value })}
                                required
                                disabled={!newSec.topicId}
                            >
                                <option value="">Select a subheading...</option>
                                {newSec.topicId && topics.find(t => t._id === newSec.topicId)?.subheadings.map(sub => (
                                    <option key={sub._id} value={sub._id}>{sub.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">Secondary Title</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                value={newSec.title}
                                onChange={e => setNewSec({ ...newSec, title: e.target.value })}
                                required
                                placeholder="e.g. useState Hook"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700">Route</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                value={newSec.slug}
                                onChange={e => setNewSec({ ...newSec, slug: e.target.value })}
                                required
                                placeholder="e.g. use-state-hook"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                        Add Secondary Heading
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
