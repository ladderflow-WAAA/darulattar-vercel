import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { PageState } from '../App';
import { faqs } from '../data/policyContent';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { MinusIcon } from '../components/icons/MinusIcon';

interface FaqsPageProps {
  navigate: (pageState: PageState) => void;
}

const AccordionItem: React.FC<{ faq: { question: string, answer: string }, isOpen: boolean, onClick: () => void }> = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-800 py-6">
      <motion.button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-medium text-gray-200">{faq.question}</h3>
        <div className="text-gray-400">
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </div>
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto', marginTop: '16px' },
              collapsed: { opacity: 0, height: 0, marginTop: '0px' },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqsPage: React.FC<FaqsPageProps> = ({ navigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleAccordionClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
            <h1 className="text-4xl md:text-5xl font-thin text-white font-serif">Frequently Asked Questions</h1>
            <p className="mt-4 text-lg text-gray-400">Find answers to common questions about our products, shipping, and policies.</p>
          </motion.div>
          
          <motion.div className="mt-12" variants={itemVariants}>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => handleAccordionClick(index)}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqsPage;
