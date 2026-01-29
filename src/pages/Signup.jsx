import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        const result = await signup({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        });

        if (result.success) {
            toast.success(result.message);
            navigate('/');
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Artistic Background (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 z-10 opacity-90" />
                <img
                    src="https://images.unsplash.com/photo-1519681393798-2f77f8e32a6e?q=80&w=2070&auto=format&fit=crop"
                    alt="Creative Design"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 animate-pulse-slow"
                />

                {/* Abstract Shapes */}
                <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/30 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />

                <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-display font-bold tracking-tight">BrainDocs</span>
                    </div>

                    <div className="max-w-xl space-y-6">
                        <h1 className="text-5xl font-display font-bold leading-tight">
                            Start your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
                                journey today.
                            </span>
                        </h1>
                        <p className="text-lg text-purple-100/80 font-light leading-relaxed">
                            Create a free account to unlock powerful documentation tools, collaborate with teams, and share your knowledge with the world.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-medium text-purple-200/60">
                        <span>© 2026 BrainDocs Inc.</span>
                        <div className="w-1 h-1 rounded-full bg-purple-400/40" />
                        <span>Privacy Policy</span>
                        <div className="w-1 h-1 rounded-full bg-purple-400/40" />
                        <span>Terms of Service</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
                {/* Mobile Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 lg:hidden -z-10" />

                <div className="w-full max-w-[480px] animate-fade-in my-auto">
                    <div className="bg-white/80 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-8 lg:p-0 rounded-3xl lg:rounded-none shadow-xl lg:shadow-none border border-white/50 lg:border-none">

                        {/* Mobile Logo */}
                        <div className="flex justify-center lg:hidden mb-8">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl text-white shadow-lg shadow-purple-600/30">
                                <BookOpen className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Create Account</h2>
                            <p className="text-slate-500">Sign up to get started with BrainDocs.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white outline-none transition-all duration-200"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white outline-none transition-all duration-200"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Password Group */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                            className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white outline-none transition-all duration-200"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white outline-none transition-all duration-200"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Creating Account...</span>
                                    </div>
                                ) : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-600">
                                Already have an account?{' '}
                                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
