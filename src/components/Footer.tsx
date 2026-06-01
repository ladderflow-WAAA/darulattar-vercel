import React from 'react';
import { Logo } from './Logo';
import { InstagramIcon } from './icons/InstagramIcon';
import { WhatsappIcon } from './icons/WhatsappIcon';
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const linkHover = { color: '#C0A080', x: 5, transition: { duration: 0.2 } };

  return (
    <motion.footer 
      className="bg-[#050505] border-t border-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <button onClick={() => navigate({ name: 'home' })} aria-label="Darul Attar Home" className="block w-32">
                <Logo className="w-full h-auto" />
            </button>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              Purveyors of fine, alcohol-free attars and oud oils. Deeply rooted in tradition, crafted for the modern connoisseur in Chennai.
            </p>
            <div className="flex space-x-4">
                <a href="https://instagram.com/darulattar" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-gold transition"><InstagramIcon /></a>
                <a href="https://wa.me/919578994377" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-gold transition"><WhatsappIcon /></a>
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-serif text-white text-lg mb-6">Collections</h4>
            <ul className="space-y-3 text-sm text-gray-400">
                <li><motion.button onClick={() => navigate({ name: 'category', props: { category: 'Woody & Musk' } })} whileHover={linkHover}>Oud & Musk</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'category', props: { category: 'Floral & Fresh' } })} whileHover={linkHover}>French Florals</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'category', props: { category: 'Best Sellers' } })} whileHover={linkHover}>Best Sellers</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'home', props: { section: 'collection' } })} whileHover={linkHover}>All Attars</motion.button></li>
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-serif text-white text-lg mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
                <li><motion.button onClick={() => navigate({ name: 'home', props: { section: 'contact' } })} whileHover={linkHover}>Contact Us</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'shipping' })} whileHover={linkHover}>Shipping Policy</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'privacy' })} whileHover={linkHover}>Privacy Policy</motion.button></li>
                <li><motion.button onClick={() => navigate({ name: 'faqs' })} whileHover={linkHover}>FAQs</motion.button></li>
            </ul>
          </motion.div>

          {/* Contact / Location */}
          <motion.div variants={itemVariants}>
            <h4 className="font-serif text-white text-lg mb-6">Visit Us</h4>
            <address className="not-italic text-sm text-gray-400 space-y-3">
                <p className="font-semibold text-gray-200">Darul Attar</p>
                <p>8/26, Water Tank Road,<br/> MMDA Colony, Arumbakkam</p>
                <p>Chennai - 600106</p>
                <p className="pt-2"><a href="tel:+919578994377" className="hover:text-brand-gold transition">+91 95789 94377</a></p>
                <p><a href="mailto:contact@darulattar.com" className="hover:text-brand-gold transition">contact@darulattar.com</a></p>
            </address>
          </motion.div>

        </div>
        
        {/* Trust Badges */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-900"
        >
          <div className="flex flex-wrap justify-center gap-8 text-gray-500 text-xs">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>100% Authentic Products</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Alcohol-Free Formulations</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Secure Payments (UPI / Cash)</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Ready for Store Pickup</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="mt-8 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p>© {new Date().getFullYear()} Darul Attar. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <span>Site by</span>
            <a href="https://ladderflow.xyz" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-gold transition font-bold font-mono">LADDERFLOW</a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;