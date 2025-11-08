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
    <section ref={ref} className="relative bg-brand-dark font-sans py-24 sm:py-32 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 variants={textItemVariants} className="text-5xl md:text-6xl font-thin text-white font-serif">
              Our <span className="italic text-brand-gold">Philosophy</span>
            </motion.h2>
            <motion.p variants={textItemVariants} className="mt-6 text-lg text-gray-300 leading-relaxed font-light">
              Darul Attar was born from a passion for the traditional art of perfumery. We are dedicated to sourcing quality ingredients, from precious resins to aromatic woods and blossoms, to create authentic attars.
            </motion.p>
            <motion.p variants={textItemVariants} className="mt-4 text-lg text-gray-300 leading-relaxed font-light">
              Our approach is rooted in <strong className="font-normal text-gray-200">patience</strong> and <strong className="font-normal text-gray-200">respect</strong> for our materials. We believe in allowing ingredients to blend and mature, developing complexity and depth over time. We invite you to experience our attars, crafted with respect for tradition.
            </motion.p>
            <motion.div variants={textItemVariants}>
              <motion.button
                onClick={() => navigate({ name: 'ourStory' })}
                className="mt-10 inline-block text-brand-gold font-sans tracking-widest text-sm font-medium border-b-2 border-brand-gold pb-1"
                whileHover={{ color: '#FFFFFF', borderColor: '#FFFFFF', y: -2 }}
                transition={{ duration: 0.3 }}
              >
                READ OUR STORY
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div
            className="relative w-full aspect-square lg:aspect-[4/5]"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
             <img 
               src="https://res.cloudinary.com/dy3jvbisa/image/upload/v1762523772/b67a73b3-c5cf-4046-93d3-f1777206b110_balhkq.jpg"
               alt="Perfume ingredients"
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default About;