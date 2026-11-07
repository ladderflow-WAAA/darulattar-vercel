import React, { useState, useMemo, useEffect } from 'react';
import { PageState } from '../App';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { motion, type Variants } from 'motion/react';
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
      <div className="text-center py-40 bg-white min-h-screen text-gray-900 font-sans">
        <p className="text-xl text-gray-500 font-serif">Please specify a search query.</p>
        <button 
          onClick={() => navigate({ name: 'home' })} 
          className="mt-4 text-brand-gold-dark hover:underline font-semibold font-mono text-xs uppercase tracking-widest"
        >
          Return to Collection
        </button>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.04 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <section className="pt-28 pb-24">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12">
          <motion.button 
            onClick={() => navigate({ name: 'home' })} 
            className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-gray-600 hover:text-black mb-8 group transition-colors font-semibold"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeftIcon />
            <span>Return to Atelier</span>
          </motion.button>
          
          <motion.div 
            className="text-left mb-8 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-brand-gold-dark font-semibold block mb-1">
                Olfactory Index Search
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif text-brand-charcoal font-normal">
                Results for <span className="font-editorial italic font-normal text-brand-gold-dark">&ldquo;{query}&rdquo;</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-xs font-mono text-gray-500">{searchResults.length} blends cataloged</span>
              <SortDropdown selected={sortOption} onSelect={setSortOption} />
            </div>
          </motion.div>

          {searchResults.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
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
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-24 bg-brand-ivory border border-gray-200/80 rounded-2xl p-8 max-w-xl mx-auto shadow-2xs"
            >
              <p className="text-2xl text-brand-charcoal font-serif mb-2">No Fragrance Oils Found</p>
              <p className="text-sm text-gray-600 mb-6 font-sans">
                We could not locate any blends matching &ldquo;{query}&rdquo;. Try searching for notes such as <span className="font-semibold text-brand-charcoal">Oud, Rose, Khus, Musk,</span> or <span className="font-semibold text-brand-charcoal">Amber</span>.
              </p>
              <button 
                onClick={() => navigate({ name: 'home', props: { section: 'collection' } })} 
                className="bg-brand-charcoal hover:bg-brand-gold-dark text-white py-3 px-8 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-full"
              >
                Browse Full Catalog
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchPage;
