import React, { useState, useMemo, useEffect } from 'react';
import { PageState } from '../App';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { motion, Variants } from 'motion/react';
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
        `Search: ${query} | Darul Attar Chennai`,
        `Results for "${query}" - Authentic Attar and Oud oils available at our Thousand Lights store.`
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
        return filtered.sort((a, b) => (a.variants?.[0]?.price ?? 0) - (b.variants?.[0]?.price ?? 0));
      case 'price-desc':
        return filtered.sort((a, b) => (b.variants?.[0]?.price ?? 0) - (a.variants?.[0]?.price ?? 0));
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
      <div className="text-center py-40 bg-white min-h-screen text-gray-900">
        <p className="text-xl text-gray-500 font-serif">Please enter a search term.</p>
        <button onClick={() => navigate({ name: 'home' })} className="mt-4 text-[#8C6D47] hover:underline font-semibold">
          Return to Collection
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <section className="pt-32 pb-24">
        <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16">
          <motion.button 
            onClick={() => navigate({ name: 'home' })} 
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black mb-8 group transition-colors font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeftIcon />
            <span className="group-hover:underline">Back to Home</span>
          </motion.button>
          
          <motion.div 
            className="text-left mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
              <div>
                <span className="text-[#8C6D47] text-xs tracking-widest uppercase font-semibold">Search Results</span>
                <h2 className="text-3xl md:text-5xl font-thin text-gray-900 font-serif mt-2">
                  "{query}"
                </h2>
                <p className="mt-2 text-gray-600 font-normal text-sm">
                  We found {searchResults.length} {searchResults.length === 1 ? 'scent' : 'scents'} matching your search.
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <SortDropdown selected={sortOption} onSelect={setSortOption} />
              </div>
            </div>
          </motion.div>

          {searchResults.length > 0 ? (
            <motion.div 
              key={sortOption}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
              className="text-center py-24 border border-gray-200 bg-[#FAF8F5] rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xl text-gray-800 font-serif font-bold">No matches found.</p>
              <p className="text-sm text-gray-500 mt-2 mb-6">Try searching for "Oud", "Musk", "Rose", or "Sandal".</p>
              <button 
                onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
                className="bg-black hover:bg-gray-800 text-white py-3 px-8 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors shadow-xs"
              >
                Browse All Scents
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchPage;