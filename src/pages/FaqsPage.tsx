import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import { PageState } from '../App';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { MinusIcon } from '../components/icons/MinusIcon';
import { setMetadata } from '../utils/metadata';

interface FaqsPageProps {
  navigate: (pageState: PageState) => void;
}

const faqs = [
  {
    question: "Where in Chennai is Darul Attar located?",
    answer: "We are located at #144 Aziz Mulk, 1st Street, Greams Road, Thousand Lights, Chennai - 600006. You are welcome to visit our store to experience our fragrances in person."
  },
  {
    question: "Are your perfumes alcohol-free?",
    answer: "Yes, all our attars and oud oils are 100% alcohol-free, suitable for prayer and daily wear."
  },
  {
    question: "How do I place an order online?",
    answer: "Add items to your bag and proceed to checkout using Direct Merchant UPI or click Order via WhatsApp for instant communication."
  },
  {
    question: "How long does the scent last?",
    answer: "Our concentrated oils typically last 6-8 hours on skin and over 24 hours on fabric depending on the specific profile (Oud and Musk base notes have the longest longevity)."
  },
  {
    question: "Do you provide tracking for delivery?",
    answer: "Yes, orders are shipped via Delhivery courier with real-time tracking updates."
  }
];

const AccordionItem: React.FC<{ faq: { question: string, answer: string }, isOpen: boolean, onClick: () => void }> = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 py-5">
      <motion.button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left group"
        aria-expanded={isOpen}
      >
        <h3 className={`text-base sm:text-lg font-serif font-bold transition-colors ${isOpen ? 'text-[#8C6D47]' : 'text-gray-900 group-hover:text-black'}`}>{faq.question}</h3>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#8C6D47]' : 'text-gray-500'}`}>
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
              open: { opacity: 1, height: 'auto', marginTop: '12px' },
              collapsed: { opacity: 0, height: 0, marginTop: '0px' },
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-gray-600 leading-relaxed font-normal text-sm pr-8">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqsPage: React.FC<FaqsPageProps> = ({ navigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    setMetadata(
      'FAQs | Darul Attar Chennai',
      'Common questions about our location in Thousand Lights, our alcohol-free attars, and shipping policies.'
    );
  }, []);

  const handleAccordionClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <div className="max-w-3xl mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-24">
         <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <button onClick={() => navigate({ name: 'home' })} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black group mb-8 transition-colors font-medium">
              <ArrowLeftIcon />
              <span className="group-hover:underline">Back to Home</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-thin text-gray-900 font-serif mb-4">Frequently Asked <span className="italic text-[#8C6D47]">Questions</span></h1>
            <p className="text-base text-gray-600 font-normal">Everything you need to know about Darul Attar.</p>
          </motion.div>
          
          <motion.div className="mt-12 bg-[#FAF8F5] p-4 sm:p-8 rounded-sm border border-gray-200 shadow-xs" variants={itemVariants}>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => handleAccordionClick(index)}
              />
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-gray-600 text-sm">Still have questions?</p>
            <button 
                onClick={() => navigate({ name: 'home', props: { section: 'contact' } })}
                className="mt-3 text-[#8C6D47] border-b border-[#8C6D47] pb-0.5 hover:text-black hover:border-black transition-all text-xs font-bold uppercase tracking-wider"
            >
                Contact Us Directly
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqsPage;