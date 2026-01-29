import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData);

        if (result.success) {
            toast.success(result.message);
            navigate('/');
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    return (
        // Adjusted height to account for fixed navbar (assuming Navbar is ~4rem/64px)
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-white h-auto lg:h-[calc(100vh-4rem)] overflow-hidden">

            {/* Left Side - Artistic Background (Desktop) 
                Changed to 60% width for better balance as requested previously
            */}
            <div className="hidden lg:flex lg:w-7/12 relative bg-slate-900 overflow-hidden order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-900/90 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                    alt="Abstract Technology"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay animate-pulse-slow"
                />

                {/* Abstract Shapes */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/30 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

                <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-display font-bold tracking-tight">BrainDocs</span>
                    </div>

                    <div className="max-w-xl space-y-6">
                        <h1 className="text-5xl font-display font-bold leading-tight">
                            Document your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                                genius ideas.
                            </span>
                        </h1>
                        <p className="text-lg text-blue-100/80 font-light leading-relaxed">
                            Join thousands of developers and writers who use BrainDocs to organize their knowledge.
                        </p>
                    </div>

                    <div className="text-sm text-blue-200/60 font-medium">
                        © 2026 BrainDocs Inc.
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-5/12 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto order-1 lg:order-2 bg-white">
                <div className="w-full max-w-md animate-fade-in">

                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Welcome Back</h2>
                        <p className="text-slate-500">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all duration-200"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all duration-200"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                    tabIndex="-1"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
