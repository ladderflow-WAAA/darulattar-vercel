import React, { useEffect } from 'react';
import { PageState } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { useToasts } from '../contexts/ToastContext';
import { motion } from 'motion/react';
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-xl text-gray-500 font-serif">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-24">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="flex items-center space-x-6 mb-12">
                <div className="w-24 h-24 rounded-full bg-[#FAF8F5] flex items-center justify-center text-4xl font-serif text-[#8C6D47] border-2 border-[#C0A080] select-none shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-thin text-gray-900 font-serif font-bold">
                        Hello, <span className="text-[#8C6D47] italic">{user.name}</span>
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">{user.email}</p>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 bg-[#FAF8F5] border border-gray-200 rounded-sm shadow-xs">
                    <h2 className="text-xl font-serif text-gray-900 font-bold mb-4 border-b border-gray-200 pb-2">My Activity</h2>
                    <p className="text-gray-600 mb-4 text-sm">You have access to leave reviews on our exclusive attar collection.</p>
                    <button onClick={() => navigate({ name: 'home', props: { section: 'collection' } })} className="text-[#8C6D47] text-xs font-bold uppercase tracking-wider hover:underline transition">
                        Browse &amp; Review Scents &rarr;
                    </button>
                </div>
                
                <div className="p-8 bg-[#FAF8F5] border border-gray-200 rounded-sm shadow-xs">
                    <h2 className="text-xl font-serif text-gray-900 font-bold mb-4 border-b border-gray-200 pb-2">Need Help?</h2>
                    <p className="text-gray-600 mb-4 text-sm">Have questions about your recent order?</p>
                    <a href="https://wa.me/919578994377" target="_blank" rel="noopener noreferrer" className="text-gray-900 text-xs font-bold uppercase tracking-wider hover:text-[#8C6D47] transition border-b border-gray-400 hover:border-[#8C6D47] pb-0.5">
                        Chat with Support &rarr;
                    </a>
                </div>
            </div>

            <div className="mt-12 text-center">
                <button
                    onClick={logout}
                    className="border border-red-300 text-red-700 px-6 py-2 text-xs hover:bg-red-50 transition uppercase tracking-widest font-semibold rounded-sm"
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