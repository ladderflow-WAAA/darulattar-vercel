import React from 'react';
import { motion } from 'motion/react';
import CategoryCard from './CategoryCard';
import { PageState } from '../App';

const categories = [
  {
    title: "Best Sellers",
    description: "Our signature creations favored across Chennai for daily longevity and distinguished sillage.",
    imageUrl: "https://res.cloudinary.com/dy3jvbisa/image/upload/v1762511399/bestseller_usksbf.png",
  },
  {
    title: "Floral & Fresh",
    description: "Sparkling Taif rose, white lotus, and fresh green accords suitable for daily warmth.",
    imageUrl: "https://res.cloudinary.com/dy3jvbisa/image/upload/v1762511484/florals_liq7z1.png",
  },
  {
    title: "Woody & Musk",
    description: "Deep aged Assam agarwood, soft Kashmiri musk, and vetiver root (Ruh Khus).",
    imageUrl: "https://res.cloudinary.com/dy3jvbisa/image/upload/v1762511482/woody_and_musk_fuu1ok.png",
  },
  {
    title: "Gourmand & Spicy",
    description: "Warm vanilla pods, golden ambergris, crushed saffron, and cardamom warmth.",
    imageUrl: "https://res.cloudinary.com/dy3jvbisa/image/upload/v1762511484/gourmand_and_spicy_vdclj8.png",
  }
];

interface CategoriesProps {
  navigate: (pageState: PageState) => void;
}

const Categories: React.FC<CategoriesProps> = ({ navigate }) => {
  return (
    <section className="py-24 sm:py-32 bg-brand-ivory border-t border-gray-200/80">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12">
        <motion.div 
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-brand-charcoal">
            Curated Scent <span className="font-editorial italic font-normal text-brand-gold-dark">Families</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-sans leading-relaxed">
            From the resinous depth of Indian oudh to crisp hydro-distilled botanicals, each olfactory family is crafted 100% alcohol-free to endure through morning prayer to evening rest.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
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
