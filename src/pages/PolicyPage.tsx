import React, { useEffect } from 'react';
import { motion, type Variants } from 'motion/react';
import { PageState } from '../App';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { policyData } from '../data/policyContent';
import { setMetadata } from '../utils/metadata';

interface PolicyPageProps {
  navigate: (pageState: PageState) => void;
  pageType: keyof typeof policyData;
}

const PolicyPage: React.FC<PolicyPageProps> = ({ navigate, pageType }) => {
  const pageContent = policyData[pageType];

  useEffect(() => {
    if (pageContent) {
      setMetadata(
        `${pageContent.title} | Darul Attar Chennai`,
        `Read our ${pageContent.title}. Darul Attar is located in Thousand Lights, Chennai.`
      );
    }
  }, [pageContent]);

  if (!pageContent) {
    return (
      <div className="text-center py-40 bg-white min-h-screen text-gray-900 font-sans">
        <p className="text-xl text-gray-500 font-serif">Document not located.</p>
        <button 
          onClick={() => navigate({ name: 'home' })} 
          className="mt-4 text-brand-gold-dark font-semibold font-mono text-xs uppercase tracking-widest hover:underline"
        >
          Return to Atelier
        </button>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };
  
  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 pt-28 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <button 
              onClick={() => navigate({ name: 'home' })} 
              className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-gray-600 hover:text-black group mb-8 transition-colors font-semibold"
            >
              <ArrowLeftIcon />
              <span>Back to Atelier</span>
            </button>
            <h1 className="text-3xl sm:text-5xl font-serif text-brand-charcoal border-b border-gray-100 pb-6 font-normal">
              {pageContent.title}
            </h1>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-10 prose prose-lg max-w-none text-gray-700 font-sans leading-relaxed prose-headings:font-serif prose-headings:text-brand-charcoal prose-strong:text-black"
            dangerouslySetInnerHTML={{ __html: pageContent.content }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PolicyPage;
