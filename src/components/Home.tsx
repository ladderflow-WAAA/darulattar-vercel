import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { PageState } from '../App';

interface HomeProps {
  navigate: (pageState: PageState) => void;
  onDiscoverClick: () => void;
}

// Magnetic button helper for luxury tactile interaction
const MagneticButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}> = ({ children, onClick, className = '', variant = 'primary' }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 200, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.25);
    y.set((clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseStyle = variant === 'primary'
    ? 'bg-brand-charcoal text-white hover:bg-brand-gold-dark hover:text-white shadow-elevation-2 hover:shadow-luxury border border-brand-charcoal'
    : 'bg-white/80 backdrop-blur-md text-brand-charcoal border border-gray-300 hover:border-brand-gold-dark hover:text-brand-gold-dark shadow-elevation-1';

  return (
    <motion.button
      ref={buttonRef}
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`relative px-8 py-4 rounded-full text-xs tracking-[0.18em] font-semibold uppercase transition-all duration-300 select-none ${baseStyle} ${className}`}
    >
      {children}
    </motion.button>
  );
};

const Home: React.FC<HomeProps> = React.forwardRef<HTMLElement, HomeProps>(({ navigate, onDiscoverClick }, ref) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Subtle parallax on hero background
  const backgroundY = useTransform(scrollY, [0, 600], ['0%', '18%']);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

  // Subtle geometric dust particles data (strictly geometric/abstract light circles)
  const ambientParticles = [
    { top: '18%', left: '12%', size: 4, duration: 6, delay: 0 },
    { top: '32%', left: '78%', size: 6, duration: 8, delay: 1.2 },
    { top: '65%', left: '22%', size: 5, duration: 7, delay: 0.8 },
    { top: '75%', left: '84%', size: 3, duration: 9, delay: 2 },
    { top: '48%', left: '92%', size: 4, duration: 6.5, delay: 1.5 },
  ];

  return (
    <header 
      ref={ref} 
      className="relative min-h-[92vh] lg:min-h-screen bg-brand-cream overflow-hidden flex flex-col justify-between pt-24 pb-12"
    >
      {/* Background Layer with Parallax & Light Treatment */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <img
          className="w-full h-full object-cover object-[center_20%] opacity-25 filter brightness-[1.05] contrast-[1.02]"
          src="https://res.cloudinary.com/dy3jvbisa/image/upload/v1762525463/hero_kes4cm.png"
          alt="Artisanal perfume oils and distillations"
          loading="eager"
        />
        {/* Editorial Light Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cream via-brand-cream/85 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-cream via-transparent to-brand-cream/40"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 ambient-glow-gold rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] ambient-glow-warm rounded-full blur-3xl pointer-events-none"></div>
      </motion.div>

      {/* Floating Geometric Light Particles (Micro-Interaction) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {ambientParticles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-brand-gold/40"
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main Hero Editorial Typography & Composition */}
      <motion.div 
        style={{ opacity: contentOpacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 my-auto pt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Craft Mark */}
        <div className="inline-flex items-center space-x-3 mb-6 px-3.5 py-1.5 rounded-full bg-brand-gold-subtle border border-brand-gold/30">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-dark animate-pulse"></span>
          <span className="text-[11px] font-sans font-semibold tracking-[0.2em] text-brand-gold-dark uppercase">
            100% Alcohol-Free • Greams Road, Chennai
          </span>
        </div>

        {/* Editorial Heading with One-Word Font Alternation */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.08] text-brand-charcoal tracking-tight">
          Pure Concentrated <br className="hidden sm:inline" />
          <span className="font-editorial italic font-normal text-brand-gold-dark">Oud</span> &amp; Artisanal Attars
        </h1>
        
        {/* Clear Sub-lead Copy */}
        <p className="mt-8 text-base sm:text-xl max-w-2xl text-gray-700 font-sans font-normal leading-relaxed">
          Distilled essences of wild Assam Agarwood, Kannauj hydro-distilled Ruh Khus, and enduring amber compositions. Handcrafted for longevity, purity, and daily reverence.
        </p>
        
        {/* Interactive Magnetic CTA Cluster */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton onClick={onDiscoverClick} variant="primary">
            Explore Collection
          </MagneticButton>
          
          <MagneticButton 
            onClick={() => navigate({ name: 'home', props: { section: 'contact' } })}
            variant="secondary"
          >
            Visit Boutique
          </MagneticButton>
        </div>
      </motion.div>

      {/* Hallmarks Bottom Strip */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 w-full pt-12">
        <div className="border-t border-brand-gold/25 pt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-brand-gold-dark font-semibold">01 • Formulation</span>
            <p className="text-xs text-gray-800 font-medium">100% Pure Oil Base</p>
            <p className="text-[11px] text-gray-500">Zero alcohol or evaporative fillers</p>
          </div>
          
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-brand-gold-dark font-semibold">02 • Provenance</span>
            <p className="text-xs text-gray-800 font-medium">Authentic Distillation</p>
            <p className="text-[11px] text-gray-500">Assam woods &amp; Kannauj copper degs</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-brand-gold-dark font-semibold">03 • Longevity</span>
            <p className="text-xs text-gray-800 font-medium">Enduring Sillage</p>
            <p className="text-[11px] text-gray-500">Substantive base notes on skin</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-brand-gold-dark font-semibold">04 • Boutique</span>
            <p className="text-xs text-gray-800 font-medium">Thousand Lights</p>
            <p className="text-[11px] text-gray-500">Bespoke olfactory sampling in store</p>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Home;
