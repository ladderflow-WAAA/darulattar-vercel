import React from 'react';
import { motion, Variants } from 'framer-motion';
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
    <section ref={ref} className="relative h-screen bg-brand-dark overflow-hidden flex items-center justify-start text-left text-white">
      <div className="absolute inset-0 z-0 opacity-40 overflow-hidden">
      <img
        className="absolute left-1/2 min-w-full min-h-full w-auto h-auto object-cover transform -translate-x-1/2 opacity-90"
        // position is controlled via inline top so it's easy to tweak (e.g. '62%')
        style={{ top: '67%', transform: 'translate(-50%, -50%)', opacity: 0.9 }}
        src="https://res.cloudinary.com/dy3jvbisa/image/upload/v1762525463/hero_kes4cm.png"
        alt="Hero background"
      />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>

      <motion.div 
        className="relative z-10 flex flex-col items-start max-w-3xl px-8 sm:px-12 lg:px-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tighter"
          variants={itemVariants}
        >
          Scent, Rooted<br/> in <span className="italic text-brand-gold">Tradition</span>
        </motion.h1>
        <motion.p 
          className="mt-6 text-lg md:text-xl max-w-2xl text-gray-300 font-light"
          variants={itemVariants}
        >
          Explore our collection of traditional attars, crafted with<br/> care and quality ingredients.
        </motion.p>
        <motion.div variants={itemVariants}>
          <motion.button 
            onClick={onDiscoverClick}
            className="mt-10 bg-brand-gold text-brand-dark py-4 px-12 tracking-widest text-sm font-bold uppercase"
            whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            Explore The Collection
          </motion.button>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
});

export default Home;
