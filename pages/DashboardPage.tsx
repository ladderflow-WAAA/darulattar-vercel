import React, { useEffect } from 'react';
import { PageState } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { useToasts } from '../contexts/ToastContext';
import { motion } from 'framer-motion';

interface DashboardPageProps {
  navigate: (pageState: PageState) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const { addToast } = useToasts();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      addToast('You must be logged in to view this page.', 'error');
      navigate({ name: 'home' });
    }
  }, [isAuthenticated, isLoading, navigate, addToast]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-brand-dark min-h-screen">
      <div className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-16 pt-40 pb-24 font-sans">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <h1 className="text-4xl md:text-5xl font-thin text-white font-serif">
                Welcome, <span className="text-brand-gold italic">{user.email}</span>
            </h1>
            <p className="mt-4 text-lg text-gray-400">
                This is your personal dashboard. More features coming soon!
            </p>

             <div className="mt-12 p-8 bg-black border border-gray-800">
                <h2 className="text-2xl font-serif text-white">Account Details</h2>
                <div className="mt-4 space-y-2 text-gray-300">
                    <p><strong>User ID:</strong> {user.id}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            </div>

            <motion.button
                onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
                className="mt-8 bg-brand-gold text-brand-dark py-3 px-8 tracking-widest text-sm font-bold uppercase"
                whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF' }}
                whileTap={{ scale: 0.95 }}
                >
                Shop Now
            </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;