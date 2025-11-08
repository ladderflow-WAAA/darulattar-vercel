import React from 'react';
import { motion } from 'framer-motion';
import CategoryCard from './CategoryCard';
import { PageState } from '../App';

const categories = [
  {
    title: "Best Sellers",
    imageUrl: "https://res.cloudinary.com/dy3jvbisa/image/upload/v1762511399/bestseller_usksbf.png",
  },
  {
    title: "Floral & Fresh",
    imageUrl: "https://res.cloudinary.com/dy3jvbisa/image/upload/v1762511484/florals_liq7z1.png",
  },
  {
    title: "Woody & Musk",
    imageUrl: "https://res.cloudinary.com/dy3jvbisa/image/upload/v1762511482/woody_and_musk_fuu1ok.png",
  },
  {
    title: "Gourmand & Spicy",
    imageUrl: "https://res.cloudinary.com/dy3jvbisa/image/upload/v1762511484/gourmand_and_spicy_vdclj8.png",
  }
];

interface CategoriesProps {
  navigate: (pageState: PageState) => void;
}

const Categories: React.FC<CategoriesProps> = ({ navigate }) => {
  return (
    <section className="py-24 bg-gray-900/50">
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-thin text-white font-serif">
            Explore by <span className="italic">Scent Profile</span>
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto font-light">
            Find the right fragrance for you by exploring our scent categories, from fresh florals to deep, woody musks.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            >
              <CategoryCard {...category} navigate={navigate} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;