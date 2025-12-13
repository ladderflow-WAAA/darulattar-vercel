import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../contexts/ProductContext';
import { PageState } from '../App';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  products: Product[];
  navigate: (pageState: PageState) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, navigate }) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-black border-t border-gray-900">
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16">
        <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-thin text-white font-serif">
            You Might Also <span className="italic text-brand-gold">Like</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            >
              <ProductCard product={product} navigate={navigate} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;