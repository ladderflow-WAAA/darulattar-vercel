import React, { useEffect } from 'react';
import { PageState } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { useToasts } from '../contexts/ToastContext';
import { motion } from 'framer-motion';
import { setMetadata } from '../utils/metadata';

interface DashboardPageProps {
  navigate: (pageState: PageState) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const { addToast } = useToasts();

  useEffect(() => {
    setMetadata('My Account | Darul Attar', 'Manage your profile and view your favorite scents.');
    if (!isLoading && !isAuthenticated) {
      addToast('Please log in to access your dashboard.', 'error');
      navigate({ name: 'home' });
    }
  }, [isAuthenticated, isLoading, navigate, addToast]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-dark">
        <div className="text-xl text-gray-400 font-serif">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-brand-dark min-h-screen">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-24 font-sans">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="flex items-center space-x-6 mb-12">
                {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full border-2 border-brand-gold" />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-serif text-brand-gold border-2 border-brand-gold">
                        {user.name.charAt(0)}
                    </div>
                )}
                <div>
                    <h1 className="text-3xl md:text-4xl font-thin text-white font-serif">
                        Hello, <span className="text-brand-gold italic">{user.name}</span>
                    </h1>
                    <p className="text-gray-400 mt-1">{user.email}</p>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 bg-black/50 border border-gray-800 rounded-sm">
                    <h2 className="text-xl font-serif text-white mb-4 border-b border-gray-700 pb-2">My Activity</h2>
                    <p className="text-gray-400 mb-4">You have access to leave reviews on our exclusive attar collection.</p>
                    <button onClick={() => navigate({ name: 'home', props: { section: 'collection' } })} className="text-brand-gold text-sm font-bold uppercase tracking-wider hover:text-white transition">
                        Browse & Review Scents →
                    </button>
                </div>
                
                <div className="p-8 bg-black/50 border border-gray-800 rounded-sm">
                    <h2 className="text-xl font-serif text-white mb-4 border-b border-gray-700 pb-2">Need Help?</h2>
                    <p className="text-gray-400 mb-4">Have questions about your recent WhatsApp order?</p>
                    <a href="https://wa.me/919578994377" target="_blank" rel="noopener noreferrer" className="text-white text-sm font-bold uppercase tracking-wider hover:text-brand-gold transition border-b border-white hover:border-brand-gold pb-0.5">
                        Chat with Support →
                    </a>
                </div>
            </div>

            <div className="mt-12 text-center">
                <button
                    onClick={logout}
                    className="border border-red-900/50 text-red-700 px-6 py-2 text-sm hover:bg-red-900/10 hover:text-red-500 transition uppercase tracking-widest"
                >
                    Sign Out
                </button>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;