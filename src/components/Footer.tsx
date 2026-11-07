import React from 'react';
import { Logo } from './Logo';
import { InstagramIcon } from './icons/InstagramIcon';
import { WhatsappIcon } from './icons/WhatsappIcon';
import { motion, type Variants } from 'motion/react';
import { PageState } from '../App';

interface FooterProps {
  navigate: (pageState: PageState) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.footer 
      className="bg-brand-ivory border-t border-gray-200/80 font-sans"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Brand Atelier Summary */}
          <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
            <button 
              onClick={() => navigate({ name: 'home' })} 
              aria-label="Darul Attar Home" 
              className="block w-36 focus:outline-none"
            >
              <Logo className="w-full h-auto" />
            </button>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Artisanal purveyors of 100% alcohol-free concentrated perfume oils and pure Assam Oud. Rooted in traditional Indian and Arabian distillation traditions, tailored for Chennai.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <a 
                href="https://instagram.com/darulattar" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram profile"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:text-brand-gold-dark hover:border-brand-gold-dark transition-colors shadow-2xs"
              >
                <InstagramIcon />
              </a>
              <a 
                href="https://wa.me/919578994377" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp consultation"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:text-brand-gold-dark hover:border-brand-gold-dark transition-colors shadow-2xs"
              >
                <WhatsappIcon />
              </a>
            </div>
          </motion.div>

          {/* Fragrance Portfolios */}
          <motion.div className="lg:col-span-3" variants={itemVariants}>
            <h4 className="font-serif text-brand-charcoal text-lg mb-5 font-normal tracking-wide">
              Fragrance Portfolios
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <button 
                  onClick={() => navigate({ name: 'category', props: { category: 'Woody & Musk' } })} 
                  className="hover:text-brand-gold-dark hover:translate-x-1 transition-all inline-block"
                >
                  Pure Oudh &amp; Musk
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate({ name: 'category', props: { category: 'Floral & Fresh' } })} 
                  className="hover:text-brand-gold-dark hover:translate-x-1 transition-all inline-block"
                >
                  Taif Rose &amp; French Florals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate({ name: 'category', props: { category: 'Best Sellers' } })} 
                  className="hover:text-brand-gold-dark hover:translate-x-1 transition-all inline-block"
                >
                  Signature Best Sellers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate({ name: 'home', props: { section: 'collection' } })} 
                  className="hover:text-brand-gold-dark hover:translate-x-1 transition-all inline-block"
                >
                  Catalog of Concentrated Oils
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Boutique Services & Policies */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <h4 className="font-serif text-brand-charcoal text-lg mb-5 font-normal tracking-wide">
              Information
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <button 
                  onClick={() => navigate({ name: 'ourStory' })} 
                  className="hover:text-brand-gold-dark hover:translate-x-1 transition-all inline-block"
                >
                  Distillation Heritage
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate({ name: 'home', props: { section: 'contact' } })} 
                  className="hover:text-brand-gold-dark hover:translate-x-1 transition-all inline-block"
                >
                  Store Consultation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate({ name: 'shipping' })} 
                  className="hover:text-brand-gold-dark hover:translate-x-1 transition-all inline-block"
                >
                  Shipping &amp; Delivery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate({ name: 'privacy' })} 
                  className="hover:text-brand-gold-dark hover:translate-x-1 transition-all inline-block"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate({ name: 'faqs' })} 
                  className="hover:text-brand-gold-dark hover:translate-x-1 transition-all inline-block"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Location Desk */}
          <motion.div className="lg:col-span-3" variants={itemVariants}>
            <h4 className="font-serif text-brand-charcoal text-lg mb-5 font-normal tracking-wide">
              Thousand Lights Atelier
            </h4>
            <address className="not-italic text-sm text-gray-600 space-y-2 leading-relaxed">
              <p className="font-medium text-brand-charcoal">Darul Attar</p>
              <p>#144 Aziz Mulk, 1st Street, Greams Road,</p>
              <p>Thousand Lights, Chennai - 600006</p>
              <p className="pt-2 font-mono">
                <a href="tel:+919578994377" className="hover:text-brand-gold-dark transition text-gray-800 font-medium">
                  +91 95789 94377
                </a>
              </p>
              <p>
                <a href="mailto:contact@darulattar.com" className="hover:text-brand-gold-dark transition text-gray-800 font-medium">
                  contact@darulattar.com
                </a>
              </p>
            </address>
          </motion.div>

        </div>
        
        {/* Trust Badges Strip */}
        <motion.div
          variants={itemVariants}
          className="mt-14 pt-8 border-t border-gray-200/70"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-gray-700">
            <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-white/70 border border-gray-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>100% Alcohol-Free Pure Oil</span>
            </div>
            <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-white/70 border border-gray-200/60">
              <span className="w-2 h-2 rounded-full bg-brand-gold-dark"></span>
              <span>Direct Assam &amp; Kannauj Distillation</span>
            </div>
            <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-white/70 border border-gray-200/60">
              <span className="w-2 h-2 rounded-full bg-gray-900"></span>
              <span>Expedited Delhivery Dispatch</span>
            </div>
            <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-white/70 border border-gray-200/60">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>Walk-in Olfactory Bar in Chennai</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Sign-off */}
        <motion.div 
          className="mt-8 pt-8 border-t border-gray-200/70 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p>© {new Date().getFullYear()} Darul Attar. Crafted in Chennai, India.</p>
          <p className="text-[11px] text-gray-400">All fragrances 100% Concentrated Botanical &amp; Resinous Oils</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
