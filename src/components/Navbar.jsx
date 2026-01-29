import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Menu, X, User, LogOut, Home, Info, Mail } from 'lucide-react';
import clsx from 'clsx';

const Navbar = ({ showBrand = true }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsProfileDropdownOpen(false);
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    {showBrand ? (
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
                            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-600/30">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <span className="hidden sm:inline">BrainDocs</span>
                        </Link>
                    ) : (
                        <div className="flex items-center">
                            {/* Empty placeholder or Page Title can go here if needed, but for now just empty to keep layout or use justify-end */}
                        </div>
                    )}

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                            <Home size={18} />
                            Home
                        </Link>
                        <Link to="/about" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                            <Info size={18} />
                            About
                        </Link>
                        <Link to="/contact" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                            <Mail size={18} />
                            Contact
                        </Link>
                    </div>

                    {/* Auth Buttons / User Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <img
                                        src={user?.avatar}
                                        alt={user?.name}
                                        className="w-8 h-8 rounded-full border-2 border-blue-500"
                                    />
                                    <span className="font-medium text-slate-700">{user?.name}</span>
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 transition-colors"
                                        >
                                            <User size={18} />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white">
                    <div className="px-4 py-4 space-y-3">
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Home size={18} />
                            Home
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Info size={18} />
                            About
                        </Link>
                        <Link
                            to="/contact"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Mail size={18} />
                            Contact
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <div className="border-t border-slate-200 pt-3 mt-3">
                                    <div className="flex items-center gap-2 px-3 py-2 mb-2">
                                        <img
                                            src={user?.avatar}
                                            alt={user?.name}
                                            className="w-8 h-8 rounded-full border-2 border-blue-500"
                                        />
                                        <span className="font-medium text-slate-700">{user?.name}</span>
                                    </div>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <User size={18} />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full px-3 py-2 text-center text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full px-3 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
