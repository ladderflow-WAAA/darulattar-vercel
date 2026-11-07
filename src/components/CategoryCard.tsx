import React from 'react';
import { motion } from 'motion/react';
import { PageState } from '../App';

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  description?: string;
  navigate: (pageState: PageState) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageUrl, description, navigate }) => {
  return (
    <motion.button 
      onClick={() => navigate({ name: 'category', props: { category: title } })}
      className="group relative block w-full aspect-[3/4] overflow-hidden rounded-xl border border-gray-200/90 hover:border-brand-gold/60 shadow-[0_4px_20px_-2px_rgba(17,24,39,0.06)] hover:shadow-[0_20px_40px_-10px_rgba(140,109,71,0.2)] transition-all duration-500 text-left cursor-pointer"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {/* Background Imagery with Smooth Zoom */}
      <div className="absolute inset-0 bg-brand-charcoal overflow-hidden">
        <img
          src={imageUrl}
          alt={`Explore ${title} Attar Collection in Chennai`}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108 opacity-80 group-hover:opacity-95"
          loading="lazy"
        />
      </div>
      
      {/* Gradient Veil */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300" />
      
      {/* Editorial Content Overlay */}
      <div className="relative h-full flex flex-col justify-end p-6 z-10">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-brand-gold font-semibold mb-1 transform translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          Collection
        </span>
        
        <h3 className="text-2xl sm:text-3xl font-serif font-normal text-white group-hover:text-brand-gold-light transition-colors duration-300">
          {title}
        </h3>
        
        {description && (
          <p className="text-xs text-gray-300 font-sans mt-1.5 opacity-90 line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="h-0.5 w-8 bg-brand-gold mt-3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
        
        <span className="mt-3 text-[11px] font-mono text-gray-300 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 tracking-widest uppercase">
          Explore Scent Profile →
        </span>
      </div>
    </motion.button>
  );
};

export default CategoryCard;
