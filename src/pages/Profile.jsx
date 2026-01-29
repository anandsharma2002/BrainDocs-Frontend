import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Shield, Edit2, Save, X, LogOut, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        avatar: user?.avatar || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await updateProfile(formData);

        if (result.success) {
            toast.success(result.message);
            setIsEditing(false);
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            bio: user?.bio || '',
            avatar: user?.avatar || ''
        });
        setIsEditing(false);
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
            toast.success('Logged out successfully');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Decorative Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 animate-fade-in">
                {/* Profile Header Card */}
                <div className="glass-panel rounded-3xl overflow-hidden mb-6">
                    {/* Cover Image/Gradient */}
                    <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-16 gap-6">

                            {/* Avatar Section */}
                            <div className="relative group">
                                <div className="p-1.5 bg-white rounded-full shadow-xl">
                                    <img
                                        src={user?.avatar}
                                        alt={user?.name}
                                        className="w-32 h-32 rounded-full border-4 border-white object-cover"
                                    />
                                </div>
                                {isEditing && (
                                    <div className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all">
                                        <Camera size={16} />
                                    </div>
                                )}
                            </div>

                            {/* Main Info - View Mode */}
                            {!isEditing && (
                                <div className="flex-1 min-w-0 pt-4 md:pt-0 pb-2">
                                    <h1 className="text-3xl font-display font-bold text-slate-900 truncate">{user?.name}</h1>
                                    <p className="text-slate-500 font-medium truncate">{user?.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user?.role === 'SuperAdmin'
                                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                                            }`}>
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
                                {!isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 font-medium transition-all shadow-sm"
                                        >
                                            <Edit2 size={18} />
                                            <span>Edit Profile</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100 hover:border-red-300 font-medium transition-all shadow-sm"
                                        >
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-all shadow-sm"
                                        >
                                            <X size={18} />
                                            <span>Cancel</span>
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70"
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    <span>Save Changes</span>
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Stats & Meta */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-lg font-display font-semibold text-slate-900 mb-4">About</h3>

                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Avatar URL</label>
                                        <input
                                            type="url"
                                            name="avatar"
                                            value={formData.avatar}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <Mail size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-400 font-medium">Email</p>
                                            <p className="text-sm font-semibold truncate" title={user?.email}>{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                            <Shield size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">Role</p>
                                            <p className="text-sm font-semibold">{user?.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">Member Since</p>
                                            <p className="text-sm font-semibold">{new Date(user?.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Bio & Activities */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-panel p-8 rounded-2xl h-full">
                            <h3 className="text-lg font-display font-semibold text-slate-900 mb-4">Bio</h3>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed"
                                    placeholder="Tell us a bit about yourself..."
                                />
                            ) : (
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        {user?.bio || <span className="text-slate-400 italic">No bio added yet. Click edit to introduce yourself!</span>}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
