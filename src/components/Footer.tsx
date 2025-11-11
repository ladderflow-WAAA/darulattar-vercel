
import React from 'react';
import { Logo } from './Logo';
import { InstagramIcon } from './icons/InstagramIcon';
import { WhatsappIcon } from './icons/WhatsappIcon';
// Fix: Use 'import type' for Variants to fix type resolution issues with framer-motion.
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { PageState } from '../App';

interface FooterProps {
  navigate: (pageState: PageState) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {

  const containerVariants: Variants = {
    hidden: {},
    visible: {
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
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const linkHover = {
    color: '#C0A080',
    transition: { duration: 0.2 }
  }

  return (
    <motion.footer 
      className="bg-black border-t border-gray-800/50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 py-16">
        <motion.div className="grid grid-cols-1 lg:grid-cols-4 gap-12" variants={containerVariants}>
          {/* Logo and mission */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <button onClick={() => navigate({ name: 'home' })} aria-label="Darul Attar Home">
                <Logo />
            </button>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed font-light">
              Offering traditional, oil-based attars crafted with quality ingredients and a respect for the art of perfumery.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <h4 className="font-semibold tracking-wider text-white uppercase font-sans">Shop</h4>
              <ul className="mt-4 space-y-3 text-sm font-light">
                <li><motion.button onClick={() => navigate({ name: 'home', props: { section: 'collection' } })} className="text-gray-400" whileHover={linkHover}>All Perfumes</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'category', props: { category: 'Best Sellers' } })} className="text-gray-400" whileHover={linkHover}>Best Sellers</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'newArrivals' })} className="text-gray-400" whileHover={linkHover}>New Arrivals</motion.button></li>
              </ul>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h4 className="font-semibold tracking-wider text-white uppercase font-sans">About</h4>
              <ul className="mt-4 space-y-3 text-sm font-light">
                <li><motion.button onClick={() => navigate({ name: 'ourStory' })} className="text-gray-400" whileHover={linkHover}>Our Story</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'blog' })} className="text-gray-400" whileHover={linkHover}>Blog</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'home', props: { section: 'contact' } })} className="text-gray-400" whileHover={linkHover}>Contact Us</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'faqs' })} className="text-gray-400" whileHover={linkHover}>FAQs</motion.button></li>
              </ul>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h4 className="font-semibold tracking-wider text-white uppercase font-sans">Support</h4>
              <ul className="mt-4 space-y-3 text-sm font-light">
                <li><motion.button onClick={() => navigate({ name: 'terms' })} className="text-gray-400" whileHover={linkHover}>Terms of Service</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'privacy' })} className="text-gray-400" whileHover={linkHover}>Privacy Policy</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'shipping' })} className="text-gray-400" whileHover={linkHover}>Shipping & Returns</motion.button></li>
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col sm:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-sm text-gray-500 font-light">&copy; {new Date().getFullYear()} Darul Attar. All Rights Reserved.</p>
          <div className="flex space-x-5 mt-4 sm:mt-0">
            <motion.a href="https://instagram.com/darulattar" target="_blank" rel="noopener noreferrer" className="text-gray-400" whileHover={{color: '#C0A080', scale: 1.1}}><InstagramIcon /></motion.a>
            <motion.a href="https://wa.me/919578994377" target="_blank" rel="noopener noreferrer" className="text-gray-400" whileHover={{color: '#C0A080', scale: 1.1}}><WhatsappIcon /></motion.a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;