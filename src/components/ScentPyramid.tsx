import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageState } from '../App';

interface ScentPyramidProps {
  navigate: (pageState: PageState) => void;
}

interface PyramidTier {
  id: 'top' | 'heart' | 'base';
  title: string;
  subTitle: string;
  duration: string;
  description: string;
  botanicals: {
    name: string;
    origin: string;
    note: string;
  }[];
  suggestedBlends: string[];
}

const tiers: PyramidTier[] = [
  {
    id: 'top',
    title: 'Top Accords',
    subTitle: 'The Olfactory Greeting',
    duration: '0 – 30 Minutes',
    description: 'The immediate sensory impression upon skin contact. Light, volatile botanicals that awaken the senses before yielding to the deeper core.',
    botanicals: [
      { name: 'Taif Damask Rose', origin: 'Saudi Highlands', note: 'Velvety, citrus-kissed dew' },
      { name: 'Calabrian Bergamot', origin: 'Southern Italy', note: 'Bright sparkling green rind' },
      { name: 'Kashmir Saffron', origin: 'Pampore Valleys', note: 'Warm bittersweet crimson strand' },
    ],
    suggestedBlends: ['Floral & Fresh', 'Taif Rose Extrait'],
  },
  {
    id: 'heart',
    title: 'Heart Chords',
    subTitle: 'The Emotional Core',
    duration: '30 Min – 4 Hours',
    description: 'The true personality and sillage of the attar. These substantive floral and spice accords emerge as the natural skin warmth activates the oil.',
    botanicals: [
      { name: 'Kannauj Ruh Khus', origin: 'Uttar Pradesh, India', note: 'Earthy, cooling monsoon vetiver root' },
      { name: 'Jasmine Sambac', origin: 'Madurai, Tamil Nadu', note: 'Indolic nighttime blossom' },
      { name: 'Mysore Sandalwood Accord', origin: 'Southern India', note: 'Buttery, serene balsamic timber' },
    ],
    suggestedBlends: ['Woody & Musk', 'Majuma Heritage'],
  },
  {
    id: 'base',
    title: 'Base Foundations',
    subTitle: 'The Enduring Memory',
    duration: '4 – 24+ Hours',
    description: 'Heavy, slow-evaporating resinous molecules that anchor the fragrance. In traditional pure attars, these aged oils bond with clothing and pulse points for days.',
    botanicals: [
      { name: 'Wild Assam Agarwood', origin: 'Upper Assam Forest', note: 'Smoky, deep balsamic resin' },
      { name: 'White Ambergris Accord', origin: 'Arabian Sea Shore', note: 'Warm oceanic salinity, clean skin warmth' },
      { name: 'Aged Deer Musk Accord', origin: 'Himalayan Foothills', note: 'Rich powdery persistence, animalic depth' },
    ],
    suggestedBlends: ['Pure Assam Oud', 'Woody & Musk'],
  },
];

export const ScentPyramid: React.FC<ScentPyramidProps> = ({ navigate }) => {
  const [activeTierId, setActiveTierId] = useState<'top' | 'heart' | 'base'>('base');

  const activeTier = tiers.find(t => t.id === activeTierId) || tiers[2];

  return (
    <section className="py-24 sm:py-32 bg-white relative border-t border-gray-100 font-sans overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Editorial Heading */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center space-x-2.5 px-3 py-1 rounded-full bg-brand-gold-subtle border border-brand-gold/30 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-dark"></span>
            <span className="text-[11px] font-mono tracking-widest text-brand-gold-dark uppercase font-semibold">
              The Art of Distillation
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-brand-charcoal leading-[1.1]">
            The Architecture of <span className="font-editorial italic font-normal text-brand-gold-dark">Scent</span> Evolution
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-sans leading-relaxed">
            Unlike commercial alcohol perfumes that flash away rapidly, pure concentrated perfume oils evolve gradually over hours. Explore how our raw botanicals transition from opening greeting to lingering foundation.
          </p>
        </div>

        {/* Interactive Pyramid Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Visual Pyramid Selector */}
          <div className="lg:col-span-5 space-y-4">
            {tiers.map((tier) => {
              const isSelected = tier.id === activeTierId;
              return (
                <motion.div
                  key={tier.id}
                  onClick={() => setActiveTierId(tier.id)}
                  whileHover={{ x: 4 }}
                  className={`p-6 sm:p-7 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden ${
                    isSelected
                      ? 'bg-brand-ivory border-brand-gold/80 shadow-elevation-1 ring-1 ring-brand-gold/40'
                      : 'bg-white border-gray-200/80 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-widest font-semibold text-brand-gold-dark">
                      {tier.duration}
                    </span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-brand-charcoal text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tier.id.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif text-brand-charcoal font-normal">
                    {tier.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-sans mt-0.5">
                    {tier.subTitle}
                  </p>

                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <motion.div
                      layoutId="pyramidActiveLine"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold-dark"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Detailed Accord Display */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTier.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-brand-ivory p-8 sm:p-12 rounded-3xl border border-gray-200/90 shadow-sm relative"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/70 pb-6 mb-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-brand-gold-dark font-semibold">
                      Phase Characteristics
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-serif text-brand-charcoal font-normal mt-1">
                      {activeTier.title} &mdash; <span className="font-editorial italic text-brand-gold-dark">{activeTier.subTitle}</span>
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-gray-400 block uppercase">Retention Span</span>
                    <span className="text-sm font-mono font-bold text-brand-charcoal">{activeTier.duration}</span>
                  </div>
                </div>

                <p className="text-gray-700 font-sans leading-relaxed text-sm sm:text-base mb-8">
                  {activeTier.description}
                </p>

                {/* Botanical Provenance List */}
                <h5 className="text-xs font-mono uppercase tracking-widest text-gray-800 font-semibold mb-4">
                  Signature Raw Ingredients:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {activeTier.botanicals.map((botanical) => (
                    <div 
                      key={botanical.name}
                      className="p-4 bg-white rounded-xl border border-gray-200/70 shadow-2xs space-y-1"
                    >
                      <p className="font-serif text-base text-brand-charcoal font-medium">{botanical.name}</p>
                      <p className="text-[11px] font-mono text-brand-gold-dark font-semibold">{botanical.origin}</p>
                      <p className="text-xs text-gray-500 font-sans leading-snug">{botanical.note}</p>
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="pt-4 border-t border-gray-200/70 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-gray-500 font-sans">
                    Explore oils featuring dominant {activeTier.id} accords in our collection.
                  </span>
                  <button
                    onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
                    className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-charcoal bg-white border border-gray-300 hover:border-black px-5 py-2.5 rounded-full transition-all duration-300 shadow-2xs hover:shadow-xs"
                  >
                    <span>View Formulations</span>
                    <span>→</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

