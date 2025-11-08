
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
      className="group relative block w-full aspect-[4/5] overflow-hidden shadow-lg text-left"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      <div className="relative h-full flex flex-col justify-end p-8 text-white">
        <h3 className="text-3xl font-serif font-medium tracking-wide">{title}</h3>
        <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
          <span className="text-sm font-sans tracking-widest uppercase border-b border-brand-gold pb-1 text-brand-gold">
            Shop Now
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export default CategoryCard;
