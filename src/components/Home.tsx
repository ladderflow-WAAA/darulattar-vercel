import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { PageState } from '../App';

interface HomeProps {
  navigate: (pageState: PageState) => void;
  onDiscoverClick: () => void;
}

const Home: React.FC<HomeProps> = React.forwardRef<HTMLElement, HomeProps>(({ navigate, onDiscoverClick }, ref) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <header ref={ref} className="relative h-screen bg-white overflow-hidden flex items-center justify-start text-left text-gray-900">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
            className="absolute inset-0 w-full h-full object-cover object-[center_0%] opacity-30"
            src="https://res.cloudinary.com/dy3jvbisa/image/upload/v1762525463/hero_kes4cm.png"
            alt="Luxury perfume oils background"
        />
        {/* Crisp Light Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/40"></div>
      </div>

      <motion.div 
        className="relative z-10 flex flex-col items-start max-w-4xl px-8 sm:px-12 lg:px-16 mt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span 
            variants={itemVariants}
            className="text-brand-gold font-sans tracking-[0.2em] text-sm uppercase mb-4 font-bold"
        >
            EST. 2024 • Thousand Lights, Chennai
        </motion.span>

        <motion.h1 
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-950"
          variants={itemVariants}
        >
          Authentic Oud &amp; Premium <br/>
          <span className="italic text-brand-gold">Attar Shop in Chennai</span>
        </motion.h1>
        
        <motion.p 
          className="mt-6 text-lg md:text-xl max-w-2xl text-gray-700 font-normal leading-relaxed"
          variants={itemVariants}
        >
          Experience the tradition of pure, alcohol-free fragrances. We bring you handcrafted long-lasting musk and rose scents, right here in MMDA Colony.
        </motion.p>
        
        <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4">
          <motion.button 
            onClick={onDiscoverClick}
            className="bg-black text-white hover:bg-brand-gold hover:text-black py-4 px-10 tracking-widest text-sm font-bold uppercase shadow-lg transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Shop Collection
          </motion.button>
          
          <motion.button 
            onClick={() => navigate({ name: 'home', props: { section: 'contact' } })}
            className="border-2 border-black text-black py-4 px-10 tracking-widest text-sm font-bold uppercase hover:bg-black hover:text-white transition-colors duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Visit Our Store
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-brand-gold"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </motion.div>
    </header>
  );
});

export default Home;