import React from 'react';
import { motion, type Variants } from 'motion/react';
import { PageState } from '../App';

interface AboutProps {
  navigate: (pageState: PageState) => void;
}

const About = React.forwardRef<HTMLElement, AboutProps>(({ navigate }, ref) => {
  const textContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const textItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section ref={ref} className="relative bg-white font-sans py-24 sm:py-32 overflow-hidden border-t border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Editorial Story Column */}
          <motion.div
            className="lg:col-span-7"
            variants={textContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 
              variants={textItemVariants} 
              className="text-3xl sm:text-5xl lg:text-6xl font-serif text-brand-charcoal leading-[1.12]"
            >
              Rooted in <span className="font-editorial italic font-normal text-brand-gold-dark">Tradition</span> &amp; Slow Distillation
            </motion.h2>

            <motion.div variants={textItemVariants} className="mt-8 space-y-6 text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
              <p>
                Darul Attar was established in Thousand Lights, Chennai with a steadfast commitment: preserving the venerable art of natural fragrance oil maceration and distillation without adulteration or alcohol.
              </p>
              <p>
                Every formulation is derived through traditional copper deg-bhapka techniques or supercritical botanical extraction. From rich heartwood Assam Oudh to sweet Damask Rose, our fragrances bond with your natural skin chemistry, releasing nuanced aromatic chords throughout the day.
              </p>
            </motion.div>
            
            {/* Artisanal Pillars */}
            <motion.div variants={textItemVariants} className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-semibold text-brand-charcoal">100%</p>
                <p className="text-xs text-gray-500 font-sans mt-1 uppercase tracking-wider">Non-Alcoholic</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-semibold text-brand-charcoal">0</p>
                <p className="text-xs text-gray-500 font-sans mt-1 uppercase tracking-wider">Synthetic Fillers</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-semibold text-brand-charcoal">144</p>
                <p className="text-xs text-gray-500 font-sans mt-1 uppercase tracking-wider">Greams Rd, Chennai</p>
              </div>
            </motion.div>

            <motion.div variants={textItemVariants} className="mt-10">
              <button
                onClick={() => navigate({ name: 'ourStory' })}
                className="inline-flex items-center space-x-2 text-xs tracking-[0.18em] uppercase font-bold text-brand-charcoal border-b-2 border-brand-gold-dark pb-1.5 hover:text-brand-gold-dark hover:border-brand-charcoal transition-colors duration-300"
              >
                <span>Discover Distillation Heritage</span>
                <span>→</span>
              </button>
            </motion.div>
          </motion.div>
          
          {/* Visual Showcase Frame */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-[4/5] bg-brand-ivory rounded-2xl overflow-hidden border border-gray-200/90 shadow-[0_20px_50px_-15px_rgba(17,24,39,0.1)]">
              <img 
                src="https://res.cloudinary.com/dy3jvbisa/image/upload/v1762523772/b67a73b3-c5cf-4046-93d3-f1777206b110_balhkq.jpg"
                alt="Artisanal glass vials of perfume oils and natural botanicals"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Corner Hallmark Tag */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-sm">
                <p className="text-[11px] font-mono tracking-wider uppercase font-semibold text-brand-gold-dark">
                  Boutique Distillation
                </p>
                <p className="text-xs text-gray-800 font-serif italic mt-0.5">
                  &ldquo;A drop of pure oud outlasts a bottle of standard spray.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
});

export default About;
