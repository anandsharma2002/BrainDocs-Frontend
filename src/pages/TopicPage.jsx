import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import clsx from 'clsx';
import { Plus, Save, Edit, Trash2, Type, Code, Image, Video, FileText, Copy, Check } from 'lucide-react';

import toast from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';
import { API_URL } from '../config/api';

const TopicPage = () => {
    // ... existing hooks
    const { topicSlug, subSlug, secondarySlug } = useParams();
    const navigate = useNavigate();

    const handleImageUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        const toastId = toast.loading('Uploading image...');

        try {
            const res = await axios.post(`${API_URL}/api/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Backend now returns full Supabase URL
            const fullUrl = res.data.filePath;
            updateBlock(index, 'value', fullUrl);
            toast.success('Image uploaded successfully!', { id: toastId });
        } catch (err) {
            console.error(err);
            toast.error('Image upload failed', { id: toastId });
        }
    };

    // Data State
    const [topic, setTopic] = useState(null);
    const [activeItem, setActiveItem] = useState(null); // The actual object being edited (Sub or Secondary)
    const [loading, setLoading] = useState(true);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [blocks, setBlocks] = useState([]); // Array of { type: 'text'|'code'|..., content: '' }
    const [metadata, setMetadata] = useState({ title: '', description: '', slug: '', titleLevel: 'h1' });
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [topicSlug, subSlug, secondarySlug]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/topics`);

            // Case-insensitive matching
            const foundTopic = res.data.find(t => t.slug.toLowerCase() === topicSlug?.toLowerCase());

            if (foundTopic) {
                setTopic(foundTopic);

                let current = null;
                // Determine active item
                // Determine active item robustly to handle duplicate sub slugs
                if (subSlug) {
                    // 1. Filter ALL subheadings that match the subSlug (case-insensitive)
                    const subCandidates = foundTopic.subheadings.filter(s => s.slug.toLowerCase() === subSlug?.toLowerCase());

                    if (secondarySlug) {
                        // 2. If looking for a secondary page, find the sub candidate that ACTUALLY contains it
                        for (const sub of subCandidates) {
                            const sec = sub.secondaryHeadings.find(s => s.slug.toLowerCase() === secondarySlug?.toLowerCase());
                            if (sec) {
                                current = sec;
                                break;
                            }
                        }
                    } else {
                        // 3. If just looking for a sub page (no secondary), take the first match
                        current = subCandidates[0];
                    }
                }

                if (current) {
                    setActiveItem(current);
                    setBlocks(current.content || []);
                    setMetadata({
                        title: current.title,
                        description: current.description || '',
                        slug: current.slug,
                        titleLevel: current.titleLevel || 'h1'
                    });
                } else {
                    // If we have a subSlug but couldn't find it, activeItem remains null -> "Content not found"
                    // But if we only have topicSlug (no subSlug), we set null to trigger Main Topic view fallback
                    if (!subSlug) {
                        setActiveItem(null);
                    } else {
                        setActiveItem(null); // Explicitly null if subSlug exists but not found
                    }
                }
            } else {
                setTopic(null);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load topic.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!activeItem || !topic) return;

        const toastId = toast.loading('Saving changes...');

        try {
            let url = '';
            if (secondarySlug) {
                // Find parent sub by ID logic (most robust)
                const sub = topic.subheadings.find(s => s.secondaryHeadings.some(sec => sec._id === activeItem._id));
                if (!sub) throw new Error("Parent subheading not found");

                url = `${API_URL}/api/topics/${topic._id}/subheadings/${sub._id}/secondary/${activeItem._id}`;
            } else {
                url = `${API_URL}/api/topics/${topic._id}/subheadings/${activeItem._id}`;
            }

            // Ensure blocks is clean
            const cleanBlocks = blocks.map(b => ({ type: b.type, value: b.value, level: b.level }));

            await axios.put(url, {
                content: cleanBlocks,
                title: metadata.title,
                description: metadata.description,
                slug: metadata.slug,
                titleLevel: metadata.titleLevel
            });

            setIsEditing(false);
            toast.success('Content saved successfully!', { id: toastId });
            fetchData(); // Refresh

        } catch (err) {
            toast.error('Error saving content: ' + err.message, { id: toastId });
        }
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!topic) return;
        const type = secondarySlug ? 'Secondary Heading' : subSlug ? 'Subheading' : 'Topic';
        const toastId = toast.loading(`Deleting ${type}...`);

        try {
            if (secondarySlug) {
                const sub = topic.subheadings.find(s => s.secondaryHeadings.some(sec => sec._id === activeItem._id));
                await axios.delete(`${API_URL}/api/topics/${topic._id}/subheadings/${sub._id}/secondary/${activeItem._id}`);
                toast.success('Deleted successfully', { id: toastId });
                navigate(`/topic/${topicSlug}/${subSlug}`);
            } else if (subSlug) {
                await axios.delete(`${API_URL}/api/topics/${topic._id}/subheadings/${activeItem._id}`);
                toast.success('Deleted successfully', { id: toastId });
                navigate(`/topic/${topicSlug}`);
            } else {
                await axios.delete(`${API_URL}/api/topics/${topic._id}`);
                toast.success('Deleted successfully', { id: toastId });
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete', { id: toastId });
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    const addBlock = (type) => {
        setBlocks([...blocks, { type, value: '', level: type === 'title' ? 'h2' : undefined }]);
        setShowAddMenu(false);
    };

    const updateBlock = (index, field, value) => {
        const newBlocks = [...blocks];
        if (typeof field === 'string' && value === undefined) {
            // Legacy support: updateBlock(index, value) -> updates 'value'
            newBlocks[index].value = field;
        } else {
            // New support: updateBlock(index, 'level', 'h1')
            newBlocks[index][field] = value;
        }
        setBlocks(newBlocks);
    };

    const removeBlock = (index) => {
        const newBlocks = blocks.filter((_, i) => i !== index);
        setBlocks(newBlocks);
    };

    // Render Block (Edit Mode)
    const renderEditBlock = (block, index) => {
        return (
            <div key={index} className="group relative mb-6 p-4 border border-slate-200 rounded-lg bg-white hover:border-blue-400 transition-colors shadow-sm">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button onClick={() => removeBlock(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Remove Block">
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 select-none">
                    {block.type === 'text' && <FileText size={14} />}
                    {block.type === 'paragraph' && <Type size={14} />}
                    {block.type === 'code' && <Code size={14} />}
                    {block.type === 'image' && <Image size={14} />}
                    {block.type === 'video' && <Video size={14} />}
                    {block.type === 'title' && <Type size={14} />}
                    {block.type} Block
                </div>

                {block.type === 'title' && (
                    <div>
                        <div className="flex gap-2 mb-2">
                            {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => updateBlock(index, 'level', level)}
                                    className={clsx(
                                        "px-2 py-1 text-xs font-bold rounded uppercase transition-colors",
                                        (block.level || 'h2') === level
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                    )}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            className={clsx(
                                "w-full font-bold p-2 border-b border-slate-200 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-300",
                                block.level === 'h1' ? 'text-4xl' :
                                    block.level === 'h2' ? 'text-3xl' :
                                        block.level === 'h3' ? 'text-2xl' :
                                            block.level === 'h4' ? 'text-xl' :
                                                'text-lg'
                            )}
                            value={block.value}
                            onChange={(e) => updateBlock(index, e.target.value)}
                            placeholder={`Section Title (${block.level || 'h2'})...`}
                        />
                    </div>
                )}

                {(block.type === 'text' || block.type === 'paragraph') && (
                    <textarea
                        className="w-full p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y min-h-[120px]"
                        rows={4}
                        value={block.value}
                        onChange={(e) => updateBlock(index, e.target.value)}
                        placeholder="Type your content here..."
                    />
                )}

                {block.type === 'code' && (
                    <div className="font-mono text-sm">
                        <textarea
                            className="w-full p-4 bg-[#1e293b] text-blue-100 rounded-lg outline-none border border-slate-700 focus:border-blue-500 transition-all resize-y min-h-[150px]"
                            rows={6}
                            value={block.value}
                            onChange={(e) => updateBlock(index, e.target.value)}
                            placeholder="// Write your code here"
                        />
                    </div>
                )}

                {(block.type === 'image' || block.type === 'video') && (
                    <div className="space-y-4">
                        <div className="flex gap-2 items-center">
                            {block.type === 'image' ? (
                                <div className="w-full">
                                    {!block.value ? (
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Image className="w-8 h-8 mb-3 text-slate-400" />
                                                <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-slate-500">PNG, JPG or GIF (MAX. 5MB)</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, index)} />
                                        </label>
                                    ) : (
                                        <div className="relative group/img">
                                            <img src={block.value} alt="Preview" className="max-h-64 rounded-lg border border-slate-200 shadow-sm mx-auto" />
                                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg cursor-pointer">
                                                <div className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                                                    <Edit size={16} /> Change Image
                                                </div>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, index)} />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    className="flex-1 p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={block.value}
                                    onChange={(e) => updateBlock(index, e.target.value)}
                                    placeholder={`Paste ${block.type} URL here...`}
                                />
                            )}
                        </div>
                        {block.type === 'video' && block.value && (
                            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center min-h-[200px] relative">
                                <div className="aspect-video w-full max-w-lg bg-black">
                                    <iframe
                                        src={block.value.includes('watch?v=') ? block.value.replace("watch?v=", "embed/") : block.value}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allowFullScreen
                                        title="Video content"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Render Block (View Mode)
    const renderViewBlock = (block, index) => {
        switch (block.type) {
            case 'title':
                const Level = block.level || 'h2'; // Default to h2 if undefined
                const sizeClasses = {
                    h1: "text-4xl md:text-5xl border-b-2 border-slate-100 pb-4 mt-12 mb-6",
                    h2: "text-3xl md:text-4xl mt-10 mb-5 border-b border-slate-100 pb-2",
                    h3: "text-2xl md:text-3xl mt-8 mb-4",
                    h4: "text-xl md:text-2xl mt-6 mb-3",
                    h5: "text-lg md:text-xl mt-4 mb-2 uppercase tracking-wide text-slate-500",
                    h6: "text-base md:text-lg mt-4 mb-2 uppercase tracking-wider text-slate-400 font-bold"
                };
                return <Level key={index} className={clsx("font-bold text-slate-900", sizeClasses[Level])}>{block.value}</Level>;
            case 'text':
            case 'paragraph':
                return <div key={index} className="text-slate-600 leading-8 mb-6 whitespace-pre-wrap text-lg">{block.value}</div>;
            case 'code':
                return <CodeBlock key={index} code={block.value} />;
            case 'image':
                return (
                    <div key={index} className="mb-10">
                        <img src={block.value} alt="Content" className="rounded-xl shadow-lg mx-auto max-h-[600px] border border-slate-100" />
                    </div>
                );
            case 'video':
                // Simple generic video embed or link
                return (
                    <div key={index} className="mb-10 aspect-video bg-black rounded-xl overflow-hidden shadow-xl ring-1 ring-slate-900/5">
                        <iframe
                            src={block.value.includes('watch?v=') ? block.value.replace("watch?v=", "embed/") : block.value}
                            className="w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                            title="Video content"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderViewMode = () => {
        const TitleTag = metadata.titleLevel || 'h1';
        const titleClasses = {
            h1: "text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 tracking-tight leading-tight",
            h2: "text-3xl md:text-5xl font-bold mb-5 text-slate-900 tracking-tight",
            h3: "text-2xl md:text-4xl font-bold mb-4 text-slate-900",
            h4: "text-xl md:text-3xl font-bold mb-3 text-slate-900",
            h5: "text-lg md:text-2xl font-bold mb-2 text-slate-900 uppercase tracking-wide",
            h6: "text-base md:text-xl font-bold mb-2 text-slate-800 uppercase tracking-widest"
        };

        return (
            <div className="animate-in fade-in duration-500">
                <TitleTag className={titleClasses[TitleTag]}>
                    {metadata.title}
                </TitleTag>
                {metadata.description && (
                    <p className="text-sm text-slate-500 mb-8 font-normal leading-relaxed border-l-2 border-indigo-500 pl-4 py-1">
                        {metadata.description}
                    </p>
                )}

                <div className="prose prose-slate prose-lg md:prose-xl max-w-none">
                    {blocks.length > 0 ? (
                        blocks.map((block, i) => renderViewBlock(block, i))
                    ) : (
                        <div className="p-12 text-center text-slate-300 italic">
                            Page content is empty.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading content...</div>;

    // Main Topic Fallback
    if (!subSlug) {
        return (
            <div className="p-8 md:p-12 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-500">
                <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl text-blue-600 shadow-inner">
                    <img src="https://cdn-icons-png.flaticon.com/512/2666/2666505.png" alt="Topic" className="w-20 h-20 opacity-90 drop-shadow-sm" />
                </div>
                <h1 className="text-5xl font-extrabold text-slate-900 mb-6 capitalize tracking-tight">{topicSlug?.replace(/-/g, ' ')}</h1>
                <p className="text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
                    Select a sub-topic from the sidebar to start exploring.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl text-left">
                    {topic?.subheadings?.map(sub => (
                        <div key={sub._id} className="group p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-100 transition-all cursor-pointer relative overflow-hidden" onClick={() => navigate(`/topic/${topic.slug}/${sub.slug}`)}>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10 group-hover:text-blue-700 transition-colors">{sub.title}</h3>
                            <div className="text-sm text-slate-400 font-medium relative z-10">{sub.content?.length || 0} sections</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!activeItem) return <div className="min-h-screen flex items-center justify-center text-slate-400">Content not found.</div>;

    return (
        <div className="p-8 md:p-12 max-w-5xl mx-auto relative min-h-screen pb-40">
            {/* Breadcrumbs */}
            <div className="mb-10 flex items-center justify-between text-sm font-medium text-slate-500 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                    <span onClick={() => navigate(`/topic/${topicSlug}`)} className="hover:text-blue-600 transition-colors cursor-pointer capitalize">{topicSlug}</span>
                    <span className="text-slate-300">/</span>
                    <span onClick={() => !secondarySlug && navigate(`/topic/${topicSlug}/${subSlug}`)} className={clsx("capitalize", !secondarySlug ? "text-slate-900 font-semibold" : "hover:text-slate-900 transition-colors cursor-pointer")}>
                        {subSlug?.replace(/-/g, ' ')}
                    </span>
                    {secondarySlug && (
                        <>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-900 font-semibold capitalize">{secondarySlug?.replace(/-/g, ' ')}</span>
                        </>
                    )}
                </div>

                {!isEditing && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Page"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Page"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 mb-8">
                        <div className="flex items-center gap-3 mb-6 text-blue-800 font-semibold">
                            <div className="p-2 bg-blue-100 rounded-lg"><Edit size={18} /></div>
                            Editing Page Metadata
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Page Title</label>
                                <div className="flex gap-2 mb-2">
                                    {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setMetadata({ ...metadata, titleLevel: level })}
                                            className={clsx(
                                                "px-2 py-1 text-xs font-bold rounded uppercase transition-colors",
                                                (metadata.titleLevel || 'h1') === level
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                            )}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    className={clsx(
                                        "w-full font-bold bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none text-slate-900 p-2 transition-colors placeholder:text-slate-300",
                                        metadata.titleLevel === 'h1' ? 'text-4xl' :
                                            metadata.titleLevel === 'h2' ? 'text-3xl' :
                                                metadata.titleLevel === 'h3' ? 'text-2xl' :
                                                    metadata.titleLevel === 'h4' ? 'text-xl' :
                                                        'text-lg'
                                    )}
                                    value={metadata.title}
                                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                                    placeholder="Page Title"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Route Slug</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-mono text-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                        value={metadata.slug}
                                        onChange={(e) => setMetadata({ ...metadata, slug: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                        value={metadata.description}
                                        onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                                        placeholder="Brief page description..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {blocks.length > 0 ? (
                            blocks.map((block, i) => renderEditBlock(block, i))
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400 flex flex-col items-center gap-4">
                                <Plus size={48} className="text-slate-300" />
                                <div>
                                    <p className="font-medium text-slate-500">No content blocks yet</p>
                                    <p className="text-sm">Click the + button below to start adding content</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                renderViewMode()
            )}

            {/* Floating Action Buttons */}
            <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-50">
                {isEditing && showAddMenu && (
                    <div className="mb-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 flex flex-col gap-1 border border-slate-100 animate-in slide-in-from-bottom-5 fade-in duration-200 min-w-[200px] overflow-hidden">
                        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Add Block</div>
                        <button onClick={() => addBlock('title')} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors text-left group">
                            <span className="p-2 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 rounded-lg text-slate-500 transition-colors"><Type size={18} /></span>
                            <span className="font-medium">Section Title</span>
                        </button>
                        <button onClick={() => addBlock('paragraph')} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors text-left group">
                            <span className="p-2 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 rounded-lg text-slate-500 transition-colors"><FileText size={18} /></span>
                            <span className="font-medium">Paragraph</span>
                        </button>
                        <button onClick={() => addBlock('code')} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors text-left group">
                            <span className="p-2 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 rounded-lg text-slate-500 transition-colors"><Code size={18} /></span>
                            <span className="font-medium">Code Block</span>
                        </button>
                        <button onClick={() => addBlock('image')} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors text-left group">
                            <span className="p-2 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 rounded-lg text-slate-500 transition-colors"><Image size={18} /></span>
                            <span className="font-medium">Image</span>
                        </button>
                        <button onClick={() => addBlock('video')} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors text-left group">
                            <span className="p-2 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 rounded-lg text-slate-500 transition-colors"><Video size={18} /></span>
                            <span className="font-medium">Video Embed</span>
                        </button>
                    </div>
                )}

                <div className="flex gap-3 items-center">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setShowAddMenu(!showAddMenu)}
                                className={clsx(
                                    "p-4 rounded-full shadow-xl transition-all text-white hover:scale-105 active:scale-95",
                                    showAddMenu ? "bg-slate-800 rotate-45" : "bg-blue-600 hover:bg-blue-700"
                                )}
                                title="Add Block"
                            >
                                <Plus size={24} strokeWidth={3} />
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                            >
                                <Save size={20} /> Save
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => { setIsEditing(true); setShowAddMenu(true); }}
                            className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                            title="Add Content"
                        >
                            <Plus size={24} strokeWidth={3} />
                        </button>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={`Delete ${secondarySlug ? 'Secondary Heading' : subSlug ? 'Subheading' : 'Topic'}?`}
                message="Are you sure you want to delete this item? This action cannot be undone and all content within it will be lost."
            />
        </div>
    );
};

const CodeBlock = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mb-8 rounded-xl overflow-hidden bg-[#0f172a] shadow-xl border border-slate-800 group relative">
            <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b]/50 border-b border-slate-700/50">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono tracking-wide">CODE</span>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
                        title="Copy Code"
                    >
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        <span className="text-[10px] font-medium uppercase tracking-wider">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                </div>
            </div>
            <pre className="p-6 text-sm md:text-base text-blue-50 overflow-x-auto font-mono leading-relaxed">
                <code>{code}</code>
            </pre>
        </div>
    );
};

export default TopicPage;
