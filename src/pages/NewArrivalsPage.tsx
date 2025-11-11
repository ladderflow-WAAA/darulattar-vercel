import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageState } from '../App';
import { SparkleIcon } from '../components/icons/SparkleIcon';
import { setMetadata } from '../utils/metadata';

interface NewArrivalsPageProps {
  navigate: (pageState: PageState) => void;
}

const NewArrivalsPage: React.FC<NewArrivalsPageProps> = ({ navigate }) => {
  useEffect(() => {
    setMetadata(
      'New Arrivals - Latest Attar & Oud | Darul Attar',
      'Discover the latest additions to our collection of handcrafted Arabic attars and premium oud oils. Be the first to experience our new, long-lasting fragrances.'
    );
  }, []);

  return (
    <div className="bg-brand-dark min-h-screen">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 text-center pt-40 pb-24 font-sans flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)'}}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="text-brand-gold mx-auto w-16 h-16 mb-6">
            <SparkleIcon />
          </div>
          <h1 className="text-4xl md:text-5xl font-thin text-white font-serif">
            Coming Soon
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
            Our new collection of exquisite attars is being carefully curated. Please check back soon for our latest arrivals.
          </p>
          <motion.button
            onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
            className="mt-12 bg-brand-gold text-brand-dark py-4 px-10 tracking-widest text-sm font-bold uppercase"
            whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF' }}
            whileTap={{ scale: 0.95 }}
          >
            Explore The Collection
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;