import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
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
    answer: "We are located at 8/26, Water Tank Road, MMDA Colony, Arumbakkam, Chennai - 600106. You are welcome to visit our store to experience our fragrances in person."
  },
  {
    question: "Are your perfumes really alcohol-free?",
    answer: "Yes, absolutely. All our attars and oud oils are 100% alcohol-free, making them suitable for prayers and sensitive skin. We stick to traditional extraction and blending methods."
  },
  {
    question: "How do I place an order online?",
    answer: "Browse our collection, add items to your bag, and proceed to checkout. The 'Confirm on WhatsApp' button will pre-fill a message with your order details. Send this to our business number, and we will confirm stock and payment details with you instantly."
  },
  {
    question: "Do you offer Cash on Delivery (COD) in Chennai?",
    answer: "Yes, for local orders within Chennai, we can arrange Cash on Delivery or simple UPI payments upon delivery. For outstation orders, we prefer UPI or Bank Transfer before dispatch."
  },
  {
    question: "How long does the scent last?",
    answer: "Our concentrated oils are designed for longevity. On skin, they typically last 6-8 hours, and on fabric, they can last upwards of 24 hours depending on the specific notes (Oud/Musk lasts longer than Citrus/Floral)."
  },
  {
    question: "Can I return a product if I don't like the smell?",
    answer: "Due to the personal nature of fragrance products, we generally do not accept returns once the seal is broken. We recommend visiting our Arumbakkam store to try testers before purchasing large quantities."
  }
];

const AccordionItem: React.FC<{ faq: { question: string, answer: string }, isOpen: boolean, onClick: () => void }> = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-800 py-5">
      <motion.button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left group"
        aria-expanded={isOpen}
      >
        <h3 className={`text-lg font-medium transition-colors ${isOpen ? 'text-brand-gold' : 'text-gray-300 group-hover:text-white'}`}>{faq.question}</h3>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-gold' : 'text-gray-500'}`}>
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
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 leading-relaxed font-light text-base pr-8">{faq.answer}</p>
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
      'Common questions about our location in Arumbakkam, our alcohol-free attars, and shipping policies.'
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
    <div className="bg-brand-dark min-h-screen">
      <div className="max-w-3xl mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-24 font-sans">
         <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <button onClick={() => navigate({ name: 'home' })} className="flex items-center space-x-2 text-sm text-gray-500 hover:text-white group mb-8 transition-colors">
              <ArrowLeftIcon />
              <span className="group-hover:underline">Back to Home</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-thin text-white font-serif mb-4">Frequently Asked <span className="italic text-brand-gold">Questions</span></h1>
            <p className="text-lg text-gray-400 font-light">Everything you need to know about Darul Attar.</p>
          </motion.div>
          
          <motion.div className="mt-12 bg-gray-900/20 p-2 sm:p-8 rounded-sm border border-gray-800/50" variants={itemVariants}>
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
            <p className="text-gray-400">Still have questions?</p>
            <button 
                onClick={() => navigate({ name: 'home', props: { section: 'contact' } })}
                className="mt-4 text-brand-gold border-b border-brand-gold pb-0.5 hover:text-white hover:border-white transition-all"
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