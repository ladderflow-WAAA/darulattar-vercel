
import React, { useEffect } from 'react';
// Fix: Use 'import type' for Variants to fix type resolution issues with framer-motion.
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
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
        `${pageContent.title} | Darul Attar`,
        `Read the ${pageContent.title.toLowerCase()} for Darul Attar. Understand our terms, policies, and the story behind our natural attar oils.`
      );
    }
  }, [pageContent]);


  if (!pageContent) {
    return (
      <div className="text-center py-40">
        <p className="text-xl text-gray-500">Content not found.</p>
        <button onClick={() => navigate({ name: 'home' })} className="mt-4 text-brand-gold hover:underline">
          Go back home
        </button>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };
  
  return (
    <div className="bg-brand-dark min-h-screen">
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 pt-40 pb-24 font-sans">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <button onClick={() => navigate({ name: 'home' })} className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white group mb-8">
              <ArrowLeftIcon />
              <span className="group-hover:underline">Back to Home</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-thin text-white font-serif border-b border-gray-800 pb-6">{pageContent.title}</h1>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-8 prose prose-invert prose-p:text-gray-300 prose-h2:text-white prose-strong:text-gray-200 prose-a:text-brand-gold"
            dangerouslySetInnerHTML={{ __html: pageContent.content }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PolicyPage;