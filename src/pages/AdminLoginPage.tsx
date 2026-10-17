import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const AdminLoginPage: React.FC = () => {
  const { login, isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true });
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 font-sans text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-gray-900 font-bold">Admin Portal</h1>
          <p className="text-gray-500 mt-2 text-sm">Darul Attar Store Management</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#FAF8F5] border border-gray-200 rounded-sm p-8 space-y-6 shadow-md">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 rounded-sm px-4 py-2.5 focus:outline-none focus:border-[#C0A080] transition text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 rounded-sm px-4 py-2.5 focus:outline-none focus:border-[#C0A080] transition text-sm"
              required
            />
          </div>
          {error && <p className="text-red-600 text-xs font-semibold">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-sm transition disabled:opacity-50 uppercase tracking-widest text-xs shadow-xs"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
