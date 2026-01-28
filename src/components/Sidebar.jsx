import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ChevronDown, ChevronRight, BookOpen, Plus, X } from 'lucide-react';
import clsx from 'clsx';

const socket = io('http://localhost:5000');

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [topics, setTopics] = useState([]);
    const [expanded, setExpanded] = useState({}); // Main topic expansion
    const [subExpanded, setSubExpanded] = useState({}); // Subheading expansion for secondary headers
    const location = useLocation();

    useEffect(() => {
        fetchTopics();

        socket.on('topics_updated', (updatedTopics) => {
            setTopics(updatedTopics);
        });

        return () => {
            socket.off('topics_updated');
        };
    }, []);

    const fetchTopics = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/topics');
            setTopics(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleSubExpand = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        setSubExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-50 w-72 bg-white/90 backdrop-blur-xl border-r border-slate-200 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] flex flex-col transition-transform duration-300 ease-in-out transform",
                isOpen ? "translate-x-0" : "-translate-x-full",
                "md:translate-x-0 md:static md:inset-auto md:flex"
            )}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
                    <Link to="/" className="text-2xl font-extrabold flex items-center gap-3 text-slate-800 tracking-tight" onClick={() => window.innerWidth < 768 && toggleSidebar()}>
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-600/30">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        BrainDocs
                    </Link>
                    <button onClick={toggleSidebar} className="md:hidden text-gray-500 dark:text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto  space-y-2">
                    {topics.map(topic => (
                        <div key={topic._id} className="mx-2 my-2">
                            <div className={clsx(
                                "rounded-xl transition-all duration-300 border overflow-hidden",
                                expanded[topic._id]
                                    ? "bg-white border-slate-200 shadow-md shadow-slate-200/50"
                                    : "bg-white border-transparent shadow-sm hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5"
                            )}>
                                <div
                                    className={clsx(
                                        "flex items-center justify-between p-3.5 cursor-pointer select-none bg-gradient-to-br from-white to-slate-50",
                                        location.pathname.includes(topic.slug) && !expanded[topic._id] && "text-blue-600 font-semibold"
                                    )}
                                >
                                    <Link
                                        to={`/topic/${topic.slug}`}
                                        className="flex-1 font-medium truncate text-slate-700 hover:text-slate-900"
                                        onClick={() => window.innerWidth < 768 && toggleSidebar()}
                                    >
                                        {topic.title}
                                    </Link>
                                    <div onClick={() => toggleExpand(topic._id)} className="p-1 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors">
                                        {topic.subheadings.length > 0 && (
                                            expanded[topic._id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />
                                        )}
                                    </div>
                                </div>

                                {expanded[topic._id] && (
                                    <div className="pb-2 px-2">
                                        <div className="space-y-0.5">
                                            {topic.subheadings.map(sub => (
                                                <div key={sub._id}>
                                                    <div className="flex items-center">
                                                        <Link
                                                            to={`/topic/${topic.slug}/${sub.slug}`}
                                                            className={clsx(
                                                                "flex-1 block py-2 px-3 text-sm rounded-lg transition-all duration-200",
                                                                location.pathname.includes(`/topic/${topic.slug}/${sub.slug}`)
                                                                    ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                                                                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/50"
                                                            )}
                                                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                                                        >
                                                            {sub.title}
                                                        </Link>
                                                        {sub.secondaryHeadings && sub.secondaryHeadings.length > 0 && (
                                                            <div
                                                                onClick={(e) => toggleSubExpand(e, sub._id)}
                                                                className="p-1 px-2 cursor-pointer text-slate-500 hover:text-blue-600 transition-colors"
                                                            >
                                                                {subExpanded[sub._id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Secondary Headings List */}
                                                    {sub.secondaryHeadings && sub.secondaryHeadings.length > 0 && subExpanded[sub._id] && (
                                                        <div className="ml-4 pl-3 border-l border-slate-200 space-y-1 mt-1 mb-2">
                                                            {sub.secondaryHeadings.map(sec => (
                                                                <Link
                                                                    key={sec._id}
                                                                    to={`/topic/${topic.slug}/${sub.slug}/${sec.slug}`}
                                                                    className={clsx(
                                                                        "block py-1.5 px-3 text-xs rounded-md transition-all duration-200",
                                                                        location.pathname === `/topic/${topic.slug}/${sub.slug}/${sec.slug}`
                                                                            ? "text-blue-600 font-semibold bg-blue-50/50"
                                                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                                                                    )}
                                                                    onClick={() => window.innerWidth < 768 && toggleSidebar()}
                                                                >
                                                                    {sec.title}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <Link to="/admin" onClick={() => window.innerWidth < 768 && toggleSidebar()} className="flex items-center justify-center p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200 font-semibold text-sm w-full">
                        <Plus size={18} className="mr-2" /> New Topic
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
