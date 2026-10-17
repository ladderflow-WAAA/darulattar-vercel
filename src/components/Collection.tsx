import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import ProductCard from './ProductCard';
import { useProducts } from '../contexts/ProductContext';
import { PageState } from '../App';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import SortDropdown, { SortOption } from './SortDropdown';
import FilterPanel from './FilterPanel';
import { FilterIcon } from './icons/FilterIcon';
import { XIcon } from './icons/XIcon';

interface Filters {
  categories: string[];
  priceRange: { min: number; max: number };
  notes: string[];
}

const Collection = React.forwardRef<HTMLElement, { navigate: (pageState: PageState) => void }>(({ navigate }, ref) => {
  const { products } = useProducts();
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map(p => p.variants?.[0]?.price ?? 0);
    
    let minPrice = Math.min(...prices);
    let maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      minPrice = Math.max(0, minPrice - 500);
      maxPrice = maxPrice + 500;
    }
    
    if (maxPrice - minPrice < 100) {
        maxPrice = minPrice + 100;
    }

    return { min: Math.floor(minPrice), max: Math.ceil(maxPrice) };
  }, [products]);

  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: { min: priceBounds.min, max: priceBounds.max },
    notes: [],
  });

  useEffect(() => {
    setFilters(prev => ({ ...prev, priceRange: { min: priceBounds.min, max: priceBounds.max } }));
  }, [priceBounds]);


  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = filters.categories.length === 0 || product.categories.some(cat => filters.categories.includes(cat));
      const prodPrice = product.variants?.[0]?.price ?? 0;
      const priceMatch = prodPrice >= filters.priceRange.min && prodPrice <= filters.priceRange.max;
      const notesMatch = filters.notes.length === 0 || filters.notes.every(note =>
        `${product.scentProfile.top}, ${product.scentProfile.heart}, ${product.scentProfile.base}`.toLowerCase().includes(note.toLowerCase())
      );
      return categoryMatch && priceMatch && notesMatch;
    });
  }, [products, filters]);
  
  const sortedProducts = useMemo(() => {
    const sortableProducts = [...filteredProducts];
    switch (sortOption) {
      case 'price-asc': return sortableProducts.sort((a, b) => (a.variants?.[0]?.price ?? 0) - (b.variants?.[0]?.price ?? 0));
      case 'price-desc': return sortableProducts.sort((a, b) => (b.variants?.[0]?.price ?? 0) - (a.variants?.[0]?.price ?? 0));
      case 'name-asc': return sortableProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc': return sortableProducts.sort((a, b) => b.name.localeCompare(a.name));
      default: return sortableProducts;
    }
  }, [sortOption, filteredProducts]);

  const productsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  
  useEffect(() => {
    setCurrentPage(0);
  }, [filters, sortOption]);

  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const startIndex = currentPage * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);
  
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <section ref={ref} className="py-24 bg-white relative border-t border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16">
        <motion.header 
            className="text-center mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-gray-950 mb-4">
            Alcohol-Free <span className="italic text-brand-gold">French Perfume Oils</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
            Discover our curated range of <strong className="text-gray-900 font-semibold">long-lasting musk &amp; rose scents</strong>. 
            Well-suited for daily wear in Chennai&apos;s climate, these oils evolve steadily on your skin.
          </p>

          {/* Sliding Pill Indicator across Category Filter Bar */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-gray-100 border border-gray-200 rounded-full">
              {[
                { label: 'All Fragrances', value: '' },
                { label: 'Best Sellers', value: 'Best Sellers' },
                { label: 'Floral & Fresh', value: 'Floral & Fresh' },
                { label: 'Woody & Musk', value: 'Woody & Musk' },
                { label: 'Gourmand & Spicy', value: 'Gourmand & Spicy' }
              ].map((tab) => {
                const isActive = tab.value === ''
                  ? filters.categories.length === 0
                  : filters.categories.includes(tab.value);

                return (
                  <button
                    key={tab.label}
                    onClick={() => {
                      if (tab.value === '') {
                        setFilters((prev: any) => ({ ...prev, categories: [] }));
                      } else {
                        setFilters((prev: any) => ({ ...prev, categories: [tab.value] }));
                      }
                    }}
                    className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors z-10 ${
                      isActive ? 'text-white' : 'text-gray-700 hover:text-black'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 bg-black rounded-full -z-10 shadow-sm"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel - Desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <FilterPanel 
              filters={filters} 
              setFilters={setFilters} 
              priceBounds={priceBounds}
            />
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <button onClick={() => setIsFilterOpen(true)} className="lg:hidden flex items-center space-x-2 bg-white text-gray-900 px-4 py-2 border border-gray-300 shadow-sm">
                <FilterIcon />
                <span>Filters</span>
              </button>
              <p className="text-gray-600 text-sm hidden sm:block">{sortedProducts.length} premium oils found</p>
              <SortDropdown selected={sortOption} onSelect={setSortOption} />
            </div>
            
            <AnimatePresence mode="wait">
            {sortedProducts.length > 0 ? (
              <motion.div 
                key={`${currentPage}-${sortOption}-${JSON.stringify(filters)}`}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {currentProducts.map((product) => (
                  <motion.article key={product.id} variants={itemVariants}>
                    <ProductCard product={product} navigate={navigate} />
                  </motion.article>
                ))}
              </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-96 border border-gray-200 bg-gray-50 rounded-sm"
                >
                    <p className="text-xl text-gray-500">No products match your criteria.</p>
                    <button onClick={() => setFilters({ categories: [], priceRange: { min: priceBounds.min, max: priceBounds.max }, notes: [] })} className="text-brand-gold mt-4 hover:underline font-bold">Reset Filters</button>
                </motion.div>
            )}
            </AnimatePresence>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-16 space-x-4">
                <motion.button onClick={handlePrev} disabled={currentPage === 0} className="p-3 bg-gray-100 border border-gray-200 text-gray-800 rounded-sm disabled:opacity-30 hover:bg-black hover:text-white transition" aria-label="Previous products">
                  <ArrowLeftIcon />
                </motion.button>
                <span className="text-gray-600 font-sans text-sm tracking-widest font-semibold">PAGE {currentPage + 1} OF {totalPages}</span>
                <motion.button onClick={handleNext} disabled={currentPage === totalPages - 1} className="p-3 bg-gray-100 border border-gray-200 text-gray-800 rounded-sm disabled:opacity-30 hover:bg-black hover:text-white transition" aria-label="Next products">
                  <ArrowRightIcon />
                </motion.button>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Filter Panel - Mobile */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          >
             <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white border-r border-gray-200 shadow-2xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
             >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-serif text-gray-950">Refine Search</h3>
                        <button onClick={() => setIsFilterOpen(false)} className="text-gray-600 hover:text-black"><XIcon /></button>
                    </div>
                    <FilterPanel 
                        filters={filters} 
                        setFilters={setFilters} 
                        priceBounds={priceBounds}
                    />
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

export default Collection;