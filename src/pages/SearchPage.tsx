
import React, { useState, useMemo, useEffect } from 'react';
import { PageState } from '../App';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
// Fix: Use 'import type' for Variants to fix type resolution issues with framer-motion.
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SortDropdown, { SortOption } from '../components/SortDropdown';
import { setMetadata } from '../utils/metadata';

interface SearchPageProps {
  navigate: (pageState: PageState) => void;
  query?: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ navigate, query }) => {
  const { products } = useProducts();
  const [sortOption, setSortOption] = useState<SortOption>('default');

  useEffect(() => {
    if (query) {
      setMetadata(
        `Search results for "${query}" | Darul Attar`,
        `Find natural attar oils and premium oud fragrances matching "${query}". Shop our collection of non-alcoholic Arabic perfumes.`
      );
    }
  }, [query]);

  const searchResults = useMemo(() => {
    if (!query) return [];
    
    const lowercasedQuery = query.toLowerCase();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(lowercasedQuery) ||
      p.description.toLowerCase().includes(lowercasedQuery) ||
      p.scentProfile.top.toLowerCase().includes(lowercasedQuery) ||
      p.scentProfile.heart.toLowerCase().includes(lowercasedQuery) ||
      p.scentProfile.base.toLowerCase().includes(lowercasedQuery)
    );

    switch (sortOption) {
      case 'price-asc':
        return filtered.sort((a, b) => a.variants[0].price - b.variants[0].price);
      case 'price-desc':
        return filtered.sort((a, b) => b.variants[0].price - a.variants[0].price);
      case 'name-asc':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      case 'default':
      default:
        return filtered;
    }
  }, [query, sortOption, products]);

  if (!query) {
    return (
      <div className="text-center py-40">
        <p className="text-xl text-gray-500">Please enter a search term.</p>
        <button onClick={() => navigate({ name: 'home' })} className="mt-4 text-brand-gold hover:underline">
          Go back home
        </button>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <div className="bg-brand-dark">
      <section className="pt-40 pb-24">
        <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16">
          <motion.button 
            onClick={() => navigate({ name: 'home' })} 
            className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white mb-8 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <ArrowLeftIcon />
            <span className="group-hover:underline">Back to Home</span>
          </motion.button>
          
          <motion.div 
            className="text-left mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-thin text-white font-serif">
                  Search Results for <span className="text-brand-gold italic">"{query}"</span>
                </h2>
                <p className="mt-4 text-lg text-gray-400 font-light">
                  {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} found.
                </p>
              </div>
              <div className="flex-shrink-0">
                <SortDropdown selected={sortOption} onSelect={setSortOption} />
              </div>
            </div>
          </motion.div>

          {searchResults.length > 0 ? (
            <motion.div 
              key={sortOption}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {searchResults.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} navigate={navigate} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20 border-t border-gray-800 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-xl text-gray-500">No products matched your search.</p>
              <p className="text-md text-gray-600 mt-2">Try searching for something else.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchPage;