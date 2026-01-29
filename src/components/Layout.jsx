import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Define routes that should strictly follow the dashboard layout (Sidebar + Navbar without brand)
    // or public routes (Navbar with brand, no Sidebar)

    const isAuthPage = ['/login', '/signup'].includes(location.pathname);
    const isPublicPage = ['/about', '/contact', '/'].includes(location.pathname) && !['/login', '/signup'].includes(location.pathname);
    // Note: Home '/' might be public or dashboard depending on auth state, but for layout we'll assume dashboard structure if logged in? 
    // Actually, following App.jsx logic: Sidebar is present for "/*" except login/signup/about/contact.

    // Simplification based on App.jsx analysis:
    // Public Layout: Navbar (with Brand) -> Content (fit min-h-screen)
    // Dashboard Layout: Sidebar + Navbar (No Brand) -> Content

    // We can infer layout type based on props or route, but let's replicate App.jsx logic cleanly here or just allow App.jsx to use this.
    // For now, let's make a "PublicLayout" and "DashboardLayout" wrapper or just manage it in App.jsx.
    // BUT, the user wants "Global UI designing theme".

    // This component will just be the "PublicLayout" equivalent for Login/Signup/Etc to ensure padding is correct.

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Navbar is always present as per user request */}
            <Navbar showBrand={!location.pathname.startsWith('/admin') && location.pathname !== '/'} />
            {/* Logic for showBrand can be refined later, for now defaulting to true mostly */}

            <main className="pt-16 min-h-screen flex flex-col">
                {children}
            </main>
        </div>
    );
};

export default Layout;
