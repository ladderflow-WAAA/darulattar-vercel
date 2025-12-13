import React, { useState, useMemo, useEffect } from 'react';
import { PageState } from '../App';
import { Product, useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
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
        `Shop our ${category.toLowerCase()} range. Authentic, alcohol-free perfumes available at our Arumbakkam store in Chennai.`
      );
    }
  }, [category]);

  const priceBounds = useMemo(() => {
    if (categoryProducts.length === 0) return { min: 0, max: 1000 };
    const prices = categoryProducts.map(p => p.variants[0].price);
    
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
      const priceMatch = product.variants[0].price >= filters.priceRange.min && product.variants[0].price <= filters.priceRange.max;
      const notesMatch = filters.notes.length === 0 || filters.notes.every(note =>
        `${product.scentProfile.top}, ${product.scentProfile.heart}, ${product.scentProfile.base}`.toLowerCase().includes(note.toLowerCase())
      );
      return priceMatch && notesMatch;
    });
  }, [categoryProducts, filters]);

  const sortedProducts = useMemo(() => {
    const sortableProducts = [...filteredProducts];
    switch (sortOption) {
      case 'price-asc': return sortableProducts.sort((a, b) => a.variants[0].price - b.variants[0].price);
      case 'price-desc': return sortableProducts.sort((a, b) => b.variants[0].price - a.variants[0].price);
      case 'name-asc': return sortableProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc': return sortableProducts.sort((a, b) => b.name.localeCompare(a.name));
      default: return sortableProducts;
    }
  }, [sortOption, filteredProducts]);

  if (!category) {
    return (
      <div className="text-center py-40 bg-brand-dark min-h-screen">
        <p className="text-xl text-gray-500">Category not found.</p>
        <button onClick={() => navigate({ name: 'home' })} className="mt-4 text-brand-gold hover:underline">
          Return Home
        </button>
      </div>
    );
  }
  
  const breadcrumbs = [
    { label: 'Home', pageState: { name: 'home' } as PageState },
    { label: 'Collections', pageState: { name: 'home', props: {section: 'collection'} } as PageState },
    { label: category }
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="bg-brand-dark min-h-screen">
      <section className="pt-32 pb-24">
        <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
             <Breadcrumbs items={breadcrumbs} navigate={navigate} />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="mt-8 mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-thin text-white font-serif mb-4">
              {category} <span className="italic text-brand-gold">Collection</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl font-light">
              Explore our {category.toLowerCase()} attars, crafted for longevity and depth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
              <FilterPanel 
                filters={filters} 
                setFilters={setFilters} 
                priceBounds={priceBounds}
                showCategories={false}
              />
            </aside>

            {/* Grid */}
            <main className="lg:col-span-3">
              <div className="flex justify-between items-center mb-8">
                <button onClick={() => setIsFilterOpen(true)} className="lg:hidden flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 border border-gray-800 rounded-sm">
                  <FilterIcon />
                  <span>Filters</span>
                </button>
                <p className="text-gray-400 text-sm hidden sm:block">{sortedProducts.length} products found</p>
                <SortDropdown selected={sortOption} onSelect={setSortOption} />
              </div>

              <AnimatePresence mode="wait">
                {sortedProducts.length > 0 ? (
                  <motion.div 
                    key={`${sortOption}-${JSON.stringify(filters)}`}
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
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
                    className="flex flex-col items-center justify-center h-80 border border-gray-800 bg-gray-900/10"
                  >
                    <p className="text-lg text-gray-500">No scents found in this range.</p>
                    <button onClick={() => setFilters({ priceRange: { min: priceBounds.min, max: priceBounds.max }, notes: [] })} className="text-brand-gold mt-2 hover:underline">Clear Filters</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </section>

      {/* Mobile Filter */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/90 z-50 backdrop-blur-sm lg:hidden" 
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div 
                initial={{ x: '-100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '-100%' }} 
                transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
                className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-brand-dark border-r border-gray-800 shadow-2xl overflow-y-auto" 
                onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-serif text-white">Filter</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-white"><XIcon /></button>
                </div>
                <FilterPanel filters={filters} setFilters={setFilters} priceBounds={priceBounds} showCategories={false} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryPage;