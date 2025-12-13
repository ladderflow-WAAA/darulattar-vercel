import React from 'react';
import { motion, Variants } from 'framer-motion';
import { PageState } from '../App';

interface AboutProps {
  navigate: (pageState: PageState) => void;
}

const About = React.forwardRef<HTMLElement, AboutProps>(({ navigate }, ref) => {
  const textContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const textItemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section ref={ref} className="relative bg-brand-dark font-sans py-24 sm:py-32 overflow-hidden border-t border-gray-900">
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span variants={textItemVariants} className="text-brand-gold text-sm tracking-widest uppercase font-semibold">Our Story</motion.span>
            <motion.h2 variants={textItemVariants} className="text-4xl md:text-5xl font-thin text-white font-serif mt-4 mb-8">
              Rooted in <span className="italic text-brand-gold">Tradition</span>
            </motion.h2>
            <motion.div variants={textItemVariants} className="space-y-6 text-lg text-gray-400 font-light leading-relaxed">
                <p>
                  Darul Attar began with a simple passion: to bring high-quality, authentic fragrances to our community in Chennai. We believe that a scent is more than just a perfume; it is a memory, a comfort, and a personal signature.
                </p>
                <p>
                  We source our ingredients with care, focusing on alcohol-free formulations that respect both modern needs and ancient perfumery traditions. From the depth of Oud to the freshness of floral notes, our collection in Arumbakkam is curated to offer you a genuine olfactory experience.
                </p>
            </motion.div>
            
            <motion.div variants={textItemVariants}>
              <motion.button
                onClick={() => navigate({ name: 'ourStory' })}
                className="mt-10 inline-block text-brand-gold font-sans tracking-widest text-sm font-bold border-b-2 border-brand-gold pb-1 hover:text-white hover:border-white transition-all"
              >
                READ MORE
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="relative w-full aspect-square lg:aspect-[4/5] bg-gray-900 overflow-hidden rounded-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
             <img 
               src="https://res.cloudinary.com/dy3jvbisa/image/upload/v1762523772/b67a73b3-c5cf-4046-93d3-f1777206b110_balhkq.jpg"
               alt="Traditional perfume bottles and ingredients"
               className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700 grayscale-[20%]"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default About;