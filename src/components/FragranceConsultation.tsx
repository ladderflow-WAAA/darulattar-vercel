import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageState } from '../App';
import { useProducts, slugify } from '../contexts/ProductContext';
import { WhatsappIcon } from './icons/WhatsappIcon';

interface FragranceConsultationProps {
  navigate: (pageState: PageState) => void;
}

interface Option {
  id: string;
  label: string;
  desc: string;
  tag: string;
}

const occasions: Option[] = [
  { id: 'daily', label: 'Daily Office & Climate', desc: 'Light, crisp, non-overpowering freshness for humid weather', tag: 'Floral & Fresh' },
  { id: 'prayer', label: 'Devotional & Prayer', desc: 'Calming, reverent hydro-distilled Ruh Khus or White Musk', tag: 'Woody & Musk' },
  { id: 'evening', label: 'Evening Gathering', desc: 'Rich, commanding Assam Oudh and smoky resinous depth', tag: 'Woody & Musk' },
  { id: 'celebration', label: 'Bridal & Gifting', desc: 'Complex royal amber, golden saffron, and velvet Damask rose', tag: 'Gourmand & Spicy' },
];

const preferences: Option[] = [
  { id: 'woody', label: 'Deep Balsamic & Oudh', desc: 'Aged Assam agarwood, sandalwood warmth, and earthy resins', tag: 'Woody & Musk' },
  { id: 'fresh', label: 'Cooling Roots & Florals', desc: 'Kannauj vetiver root (Ruh Khus) and Taif rose dewdrops', tag: 'Floral & Fresh' },
  { id: 'spicy', label: 'Spiced Amber & Saffron', desc: 'Cardamom pods, Madagascar vanilla, and golden resin', tag: 'Gourmand & Spicy' },
  { id: 'musk', label: 'Clean Skin Warmth & Musk', desc: 'Soft white powdery musk and clean oceanic ambergris', tag: 'Best Sellers' },
];

export const FragranceConsultation: React.FC<FragranceConsultationProps> = ({ navigate }) => {
  const { products } = useProducts();
  const [selectedOccasion, setSelectedOccasion] = useState<string>('daily');
  const [selectedPreference, setSelectedPreference] = useState<string>('woody');

  // Match recommendation based on selected tags
  const recommendedCategory = occasions.find(o => o.id === selectedOccasion)?.tag || 'Best Sellers';
  const preferenceCategory = preferences.find(p => p.id === selectedPreference)?.tag || 'Woody & Musk';

  const matches = products.filter(p => 
    p.categories.includes(recommendedCategory) || p.categories.includes(preferenceCategory)
  ).slice(0, 3);

  const handleConsultWhatsApp = () => {
    const occLabel = occasions.find(o => o.id === selectedOccasion)?.label;
    const prefLabel = preferences.find(p => p.id === selectedPreference)?.label;
    const msg = `Salam Darul Attar,\n\nI used the Olfactory Consultation on your website:\n• Occasion: ${occLabel}\n• Preferred Profile: ${prefLabel}\n\nCould you suggest bespoke attar blends available at your Thousand Lights boutique?`;
    window.open(`https://wa.me/919578994377?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section className="py-24 sm:py-32 bg-brand-cream border-t border-gray-200/80 font-sans relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-gold-subtle border border-brand-gold/30 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-dark"></span>
            <span className="text-[11px] font-mono tracking-widest text-brand-gold-dark uppercase font-semibold">
              Bespoke Olfactory Navigator
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-brand-charcoal">
            Find Your <span className="font-editorial italic font-normal text-brand-gold-dark">Signature</span> Essence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-sans leading-relaxed">
            Every skin chemistry responds uniquely to pure concentrated perfume oils. Select your intended wear occasion and sensory profile to discover matching authentic extraits.
          </p>
        </div>

        {/* Interactive Matrix Selector */}
        <div className="bg-white p-8 sm:p-12 lg:p-16 rounded-3xl border border-gray-200/90 shadow-sm max-w-5xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Step 1: Occasion */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-brand-gold-dark font-semibold block mb-2">
                Phase 01 • Wear Occasion
              </span>
              <h3 className="text-xl font-serif text-brand-charcoal mb-4">When will you wear this attar?</h3>
              <div className="space-y-3">
                {occasions.map((occ) => {
                  const isSelected = occ.id === selectedOccasion;
                  return (
                    <button
                      key={occ.id}
                      onClick={() => setSelectedOccasion(occ.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
                        isSelected 
                          ? 'bg-brand-ivory border-brand-charcoal ring-1 ring-brand-charcoal/20 shadow-2xs' 
                          : 'bg-white border-gray-200/80 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-sm text-brand-charcoal">{occ.label}</p>
                      <p className="text-xs text-gray-500 font-sans mt-0.5">{occ.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Scent Preference */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-brand-gold-dark font-semibold block mb-2">
                Phase 02 • Scent Family
              </span>
              <h3 className="text-xl font-serif text-brand-charcoal mb-4">What note inspires you most?</h3>
              <div className="space-y-3">
                {preferences.map((pref) => {
                  const isSelected = pref.id === selectedPreference;
                  return (
                    <button
                      key={pref.id}
                      onClick={() => setSelectedPreference(pref.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
                        isSelected 
                          ? 'bg-brand-ivory border-brand-charcoal ring-1 ring-brand-charcoal/20 shadow-2xs' 
                          : 'bg-white border-gray-200/80 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-sm text-brand-charcoal">{pref.label}</p>
                      <p className="text-xs text-gray-500 font-sans mt-0.5">{pref.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Accordion Container */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-gray-500 font-semibold block">
                  Curated Match
                </span>
                <h4 className="text-2xl font-serif text-brand-charcoal">
                  Formulations for Your Profile
                </h4>
              </div>

              <button
                onClick={handleConsultWhatsApp}
                className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-brand-charcoal bg-brand-gold-subtle border border-brand-gold/60 hover:bg-brand-charcoal hover:text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-2xs"
              >
                <WhatsappIcon />
                <span>Discuss with Thousand Lights Concierge</span>
              </button>
            </div>

            {/* Matches Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {matches.length > 0 ? (
                matches.map((match) => (
                  <motion.div
                    key={match.id}
                    onClick={() => navigate({ name: 'product', props: { slug: slugify(match.name), name: match.name } })}
                    className="p-5 rounded-2xl bg-brand-ivory border border-gray-200/90 hover:border-brand-gold/80 cursor-pointer transition-all duration-300 hover:shadow-elevation-1 flex flex-col justify-between"
                    whileHover={{ y: -3 }}
                  >
                    <div>
                      <div className="w-full aspect-[4/5] bg-white rounded-xl overflow-hidden mb-4 border border-gray-100">
                        <img 
                          src={match.imageUrl} 
                          alt={match.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <p className="font-serif text-xl text-brand-charcoal font-medium">{match.name}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{match.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs font-mono">
                      <span className="text-brand-charcoal font-bold">
                        ₹{(match.variants?.[0]?.price ?? 0).toFixed(2)}
                      </span>
                      <span className="text-brand-gold-dark font-semibold">Inspect Notes →</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500 font-serif">
                  All our artisanal blends are tailored for warm climate longevity. Browse our catalog for specific distillations.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

