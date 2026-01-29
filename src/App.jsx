import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import DashboardLayout from './components/DashboardLayout';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#FDFDFD] text-slate-900 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
        <Toaster position="top-right" toastOptions={{
          className: 'font-medium text-sm',
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            padding: '12px 20px',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#f0fdf4',
            },
          },
        }} />

        <Routes>
          {/* Public routes without dashboard layout */}
          <Route path="/login" element={<><Navbar /><div className="pt-16"><Login /></div></>} />
          <Route path="/signup" element={<><Navbar /><div className="pt-16"><Signup /></div></>} />
          <Route path="/about" element={<><Navbar /><div className="pt-16"><About /></div></>} />
          <Route path="/contact" element={<><Navbar /><div className="pt-16"><Contact /></div></>} />

          {/* Dashboard Layout for all other routes */}
          <Route path="/*" element={<DashboardLayout />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
