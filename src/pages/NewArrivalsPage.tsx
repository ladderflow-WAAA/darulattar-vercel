import React, { useEffect } from 'react';
import { motion } from 'motion/react';
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
    <div className="bg-white min-h-screen flex flex-col justify-center relative overflow-hidden font-sans text-gray-900">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 text-center z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="text-[#8C6D47] mx-auto w-12 h-12 mb-8">
            <SparkleIcon />
          </div>
          <h1 className="text-5xl md:text-7xl font-thin text-gray-900 font-serif mb-6">
            Curating <span className="italic text-[#8C6D47]">Excellence</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto font-normal leading-relaxed">
            Our perfumers are selecting seasonal ingredients for our next batch. New authentic Ouds arriving soon at our Thousand Lights store.
          </p>
          
          <motion.button
            onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
            className="mt-12 bg-black hover:bg-gray-800 text-white py-4 px-10 tracking-widest text-xs font-bold uppercase transition-all duration-300 rounded-sm shadow-xs"
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