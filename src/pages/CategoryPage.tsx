import React, { useState, useMemo, useEffect } from 'react';
import { PageState } from '../App';
import { Product, useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import SortDropdown, { SortOption } from '../components/SortDropdown';
import FilterPanel from '../components/FilterPanel';
import { FilterIcon } from '../components/icons/FilterIcon';
import { XIcon } from '../components/icons/XIcon';
import Breadcrumbs from '../components/Breadcrumbs';
import { setMetadata } from '../utils/metadata';

interface CategoryPageProps {
  navigate: (pageState: PageState) => void;
  category?: string;
}

interface Filters {
  priceRange: { min: number; max: number };
  notes: string[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ navigate, category }) => {
  const { products } = useProducts();
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    return products.filter(p => p.categories.includes(category));
  }, [category, products]);

  useEffect(() => {
    if (category) {
      setMetadata(
        `${category} Collection - Attar & Oud Chennai | Darul Attar`,
        `Shop our ${category.toLowerCase()} range. Authentic, alcohol-free perfumes available at our Thousand Lights store in Chennai.`
      );
    }
  }, [category]);

  const priceBounds = useMemo(() => {
    if (categoryProducts.length === 0) return { min: 0, max: 1000 };
    const prices = categoryProducts.map(p => p.variants?.[0]?.price ?? 0);
    
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
  }, [categoryProducts]);

  const [filters, setFilters] = useState<Filters>({
    priceRange: { min: priceBounds.min, max: priceBounds.max },
    notes: [],
  });

  useEffect(() => {
    setFilters({ priceRange: { min: priceBounds.min, max: priceBounds.max }, notes: [] });
  }, [priceBounds]);

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter(product => {
      const prodPrice = product.variants?.[0]?.price ?? 0;
      const priceMatch = prodPrice >= filters.priceRange.min && prodPrice <= filters.priceRange.max;
      const notesMatch = filters.notes.length === 0 || filters.notes.every(note =>
        `${product.scentProfile.top}, ${product.scentProfile.heart}, ${product.scentProfile.base}`.toLowerCase().includes(note.toLowerCase())
      );
      return priceMatch && notesMatch;
    });
  }, [categoryProducts, filters]);

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

  if (!category) {
    return (
      <div className="text-center py-40 bg-white min-h-screen text-gray-900">
        <p className="text-xl text-gray-500 font-serif">Category portfolio not located.</p>
        <button onClick={() => navigate({ name: 'home' })} className="mt-4 text-brand-gold-dark font-semibold hover:underline">
          Return to Atelier
        </button>
      </div>
    );
  }
  
  const breadcrumbs = [
    { label: 'Home', pageState: { name: 'home' } as PageState },
    { label: 'Collections', pageState: { name: 'home', props: { section: 'collection' } } as PageState },
    { label: category }
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <section className="pt-28 pb-24">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
             <Breadcrumbs items={breadcrumbs} navigate={navigate} />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="mt-6 mb-12"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-brand-charcoal mb-3">
              {category} <span className="font-editorial italic font-normal text-brand-gold-dark">Portfolio</span>
            </h1>
            <p className="text-base text-gray-600 max-w-2xl font-normal leading-relaxed">
              Explore our {category.toLowerCase()} extraits and concentrated oils, handcrafted for longevity and authentic aromatic depth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
              <FilterPanel 
                filters={filters} 
                setFilters={setFilters} 
                priceBounds={priceBounds}
                showCategories={false}
              />
            </aside>

            {/* Main Products Grid */}
            <main className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <button 
                  onClick={() => setIsFilterOpen(true)} 
                  className="lg:hidden flex items-center space-x-2 bg-white text-gray-900 px-4 py-2 border border-gray-300 rounded-full shadow-2xs font-medium text-xs tracking-wider uppercase"
                >
                  <FilterIcon />
                  <span>Filters</span>
                </button>
                <p className="text-gray-500 font-mono text-xs hidden sm:block">
                  {sortedProducts.length} {sortedProducts.length === 1 ? 'blend' : 'blends'} in this family
                </p>
                <SortDropdown selected={sortOption} onSelect={setSortOption} />
              </div>

              <AnimatePresence mode="wait">
                {sortedProducts.length > 0 ? (
                  <motion.div 
                    key={`${sortOption}-${JSON.stringify(filters)}`}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {sortedProducts.map((product) => (
                      <motion.div key={product.id} variants={itemVariants}>
                        <ProductCard product={product} navigate={navigate} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex flex-col items-center justify-center h-80 border border-gray-200 bg-brand-ivory rounded-2xl p-6 text-center"
                  >
                    <p className="text-lg text-gray-700 font-serif">No scents found matching current parameters.</p>
                    <button 
                      onClick={() => setFilters({ priceRange: { min: priceBounds.min, max: priceBounds.max }, notes: [] })} 
                      className="text-brand-gold-dark mt-3 font-semibold hover:underline text-xs font-mono uppercase tracking-widest"
                    >
                      Reset Filter Criteria
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white border-r border-gray-200 shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-serif text-brand-charcoal">Filter {category}</h3>
                  <button 
                    onClick={() => setIsFilterOpen(false)} 
                    className="p-1.5 text-gray-600 hover:text-black rounded-full hover:bg-gray-100"
                  >
                    <XIcon />
                  </button>
                </div>
                <FilterPanel 
                  filters={filters} 
                  setFilters={setFilters} 
                  priceBounds={priceBounds}
                  showCategories={false}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryPage;
