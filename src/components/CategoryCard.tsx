import React from 'react';
import { motion } from 'framer-motion';
import { PageState } from '../App';

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  navigate: (pageState: PageState) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageUrl, navigate }) => {
  return (
    <motion.button 
      onClick={() => navigate({ name: 'category', props: { category: title } })}
      className="group relative block w-full aspect-[3/4] overflow-hidden shadow-2xl border border-gray-800 rounded-sm"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="absolute inset-0 bg-gray-900">
        <img
          src={imageUrl}
          alt={`Buy ${title} Attar in Chennai`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300"></div>
      
      <div className="relative h-full flex flex-col justify-end p-6 text-left">
        <h3 className="text-2xl font-serif font-medium tracking-wide text-white group-hover:text-brand-gold transition-colors duration-300">
          {title}
        </h3>
        <div className="h-0.5 w-12 bg-brand-gold mt-3 mb-1 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
        <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 tracking-widest uppercase">
          View Collection
        </p>
      </div>
    </motion.button>
  );
};

export default CategoryCard;