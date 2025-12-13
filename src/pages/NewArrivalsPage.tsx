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
      'New Arrivals - Latest Oud & Musk | Darul Attar Chennai',
      'Discover the newest additions to our handcrafted attar collection. Sourced for the discerning nose in Chennai.'
    );
  }, []);

  return (
    <div className="bg-brand-dark min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-800 blur-[150px] rounded-full"></div>
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-gold blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 text-center z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="text-brand-gold mx-auto w-12 h-12 mb-8 animate-pulse">
            <SparkleIcon />
          </div>
          <h1 className="text-5xl md:text-7xl font-thin text-white font-serif mb-6">
            Curating <span className="italic text-gray-500">Excellence</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-lg mx-auto font-light leading-relaxed">
            Our master perfumers are currently selecting the finest seasonal ingredients for our next batch. New authentic Ouds arriving soon at our Arumbakkam store.
          </p>
          
          <motion.button
            onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
            className="mt-12 bg-transparent border border-brand-gold text-brand-gold py-4 px-10 tracking-widest text-sm font-bold uppercase hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Current Collection
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;