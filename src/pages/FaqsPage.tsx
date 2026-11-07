import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
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
    question: "Where in Chennai is the Darul Attar atelier located?",
    answer: "Our physical boutique is located at #144 Aziz Mulk, 1st Street, Greams Road, Thousand Lights, Chennai - 600006. Visitors are welcome for personal olfactory sampling seven days a week from 10:00 AM to 9:00 PM."
  },
  {
    question: "Are your attars and oud formulations 100% alcohol-free?",
    answer: "Yes, every oil in our catalog is 100% alcohol-free concentrated oil, completely compliant with devotional prayer requirements and gentle on sensitive skin."
  },
  {
    question: "How long do pure perfume oils last compared to commercial sprays?",
    answer: "Because our formulations contain zero alcohol carrier or evaporative water, they bind with skin lipids and body warmth. Most blends endure 8 to 12 hours on skin and over 24 hours on natural fabrics."
  },
  {
    question: "How do you dispatch orders across India?",
    answer: "All orders are dispatched via Delhivery insured logistics with live tracking notifications delivered via SMS and email. Standard transit within Chennai is 1-2 days; pan-India delivery is typically 3-5 business days."
  },
  {
    question: "Can I consult directly with a perfumer for bridal or custom gifting?",
    answer: "Yes. You can contact our Thousand Lights consultation desk directly on WhatsApp (+91 95789 94377) for custom tola presentations, velvet gift boxes, and curated fragrance samplers."
  }
];

const AccordionItem: React.FC<{ faq: { question: string, answer: string }, isOpen: boolean, onClick: () => void }> = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200/70 py-5 last:border-0">
      <motion.button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left group"
        aria-expanded={isOpen}
      >
        <h3 className={`text-base sm:text-lg font-serif font-normal transition-colors pr-4 ${isOpen ? 'text-brand-gold-dark' : 'text-brand-charcoal group-hover:text-black'}`}>
          {faq.question}
        </h3>
        <div className={`p-1.5 rounded-full transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-brand-gold-dark bg-brand-gold-subtle' : 'text-gray-400 bg-gray-100'}`}>
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
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-gray-600 leading-relaxed font-sans text-sm pr-8">
              {faq.answer}
            </p>
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
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-12 pt-28 pb-24">
         <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <button 
              onClick={() => navigate({ name: 'home' })} 
              className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-gray-600 hover:text-black mb-8 group transition-colors font-semibold"
            >
              <ArrowLeftIcon />
              <span>Back to Atelier</span>
            </button>
            <h1 className="text-3xl sm:text-5xl font-serif text-brand-charcoal mb-3">
              Frequently Asked <span className="font-editorial italic font-normal text-brand-gold-dark">Inquiries</span>
            </h1>
            <p className="text-base text-gray-600 font-normal leading-relaxed">
              Essential details regarding pure oil distillation, store hours in Thousand Lights, and nationwide delivery.
            </p>
          </motion.div>
          
          <motion.div className="mt-10 bg-brand-ivory p-6 sm:p-10 rounded-2xl border border-gray-200/80 shadow-2xs" variants={itemVariants}>
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
            <p className="text-gray-600 text-sm">Require bespoke assistance or bridal sampling?</p>
            <button 
              onClick={() => navigate({ name: 'home', props: { section: 'contact' } })}
              className="mt-3 text-brand-charcoal border-b-2 border-brand-gold-dark pb-1 hover:text-brand-gold-dark transition-colors text-xs font-mono font-bold uppercase tracking-widest inline-block"
            >
              Contact Thousand Lights Atelier
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqsPage;
