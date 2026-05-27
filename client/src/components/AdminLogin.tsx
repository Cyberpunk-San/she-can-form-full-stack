import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome Admin!');
      onLoginSuccess();
      onClose();
      setEmail('');
      setPassword('');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#f7f4ef] border-2 border-[#1e201e] p-8 max-w-md w-full indie-shadow-lg animate-slide-up">
        <div className="text-center mb-8 border-b border-dashed border-[#1e201e]/40 pb-5">
          <h2 className="font-serif-indie text-2xl font-bold text-[#1e201e]">Admin Login</h2>
          <p className="font-serif-indie italic text-sm text-neutral-600 mt-1">Access the administrative dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col space-y-1">
            <label className="font-mono-indie text-[10px] uppercase tracking-wider font-bold text-neutral-600">Email Address</label>
            <input
              type="email"
              placeholder="admin@shecan.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#1e201e] bg-white font-sans focus:outline-none focus:bg-white"
              required
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-mono-indie text-[10px] uppercase tracking-wider font-bold text-neutral-600">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#1e201e] bg-white font-sans focus:outline-none focus:bg-white"
              required
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e201e] hover:bg-neutral-800 text-white font-mono-indie text-xs tracking-widest uppercase font-bold py-3.5 border-2 border-[#1e201e] transition-all duration-200 indie-shadow indie-shadow-active disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full font-mono-indie text-xs tracking-wider uppercase text-neutral-500 hover:text-neutral-800 text-center py-2 transition-colors duration-200"
          >
            Cancel
          </button>
        </form>

        <div className="mt-6 p-4 bg-white/50 border border-dashed border-[#1e201e]/30">
          <p className="font-mono-indie text-[10px] text-neutral-500 text-center leading-relaxed">
            Demo Credentials:<br />
            Email: <span className="font-bold text-[#1e201e]">admin@shecan.org</span><br />
            Password: <span className="font-bold text-[#1e201e]">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;