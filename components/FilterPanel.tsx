import React, { useMemo, useState } from 'react';
import { Product, useProducts } from '../contexts/ProductContext';
import { motion } from 'framer-motion';
import PriceRangeSlider from './PriceRangeSlider';

interface FilterPanelProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  priceBounds: { min: number; max: number };
  showCategories?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, priceBounds, showCategories = true }) => {
  const { products } = useProducts();
  const [showAllNotes, setShowAllNotes] = useState(false);

  const uniqueCategories = useMemo(() => {
    const allCategories = products.flatMap(p => p.categories);
    return [...new Set(allCategories)];
  }, [products]);

  const uniqueNotes = useMemo(() => {
    const allNotes = products.flatMap(p => 
      `${p.scentProfile.top}, ${p.scentProfile.heart}, ${p.scentProfile.base}`.split(',').map(n => n.trim())
    );
    const noteCounts: { [key: string]: number } = {};
    allNotes.forEach(note => {
        if(note) noteCounts[note] = (noteCounts[note] || 0) + 1;
    });
    return Object.entries(noteCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([note]) => note);
  }, [products]);
  
  const displayedNotes = showAllNotes ? uniqueNotes : uniqueNotes.slice(0, 10);

  const handleCategoryChange = (category: string) => {
    setFilters((prev: any) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c: string) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };
  
  const handleNoteChange = (note: string) => {
    setFilters((prev: any) => {
      const newNotes = prev.notes.includes(note)
        ? prev.notes.filter((n: string) => n !== note)
        : [...prev.notes, note];
      return { ...prev, notes: newNotes };
    });
  };

  const handlePriceChange = (values: { min: number; max: number }) => {
    setFilters((prev: any) => ({ ...prev, priceRange: values }));
  };
  
  const clearFilters = () => {
    setFilters({
        categories: [],
        priceRange: { min: priceBounds.min, max: priceBounds.max },
        notes: [],
    });
  };

  return (
    <div className="bg-black p-6 space-y-8 h-full">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-serif text-white">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-brand-gold hover:underline">Clear All</button>
      </div>

      {/* Categories Filter */}
      {showCategories && (
        <div>
          <h4 className="font-semibold tracking-wider text-gray-200 uppercase font-sans text-sm mb-4">Category</h4>
          <div className="space-y-2">
            {uniqueCategories.length > 0 ? uniqueCategories.map(category => (
              <label key={category} className="flex items-center space-x-3 cursor-pointer text-gray-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="h-4 w-4 bg-brand-dark border-gray-600 text-brand-gold focus:ring-brand-gold"
                />
                <span>{category}</span>
              </label>
            )) : (
              <p className="text-sm text-gray-500">No categories found.</p>
            )}
          </div>
        </div>
      )}

      {/* Price Filter */}
      <div>
        <h4 className="font-semibold tracking-wider text-gray-200 uppercase font-sans text-sm mb-4">Price Range</h4>
        <PriceRangeSlider
            min={priceBounds.min}
            max={priceBounds.max}
            values={filters.priceRange}
            onChange={handlePriceChange}
        />
      </div>

      {/* Scent Notes Filter */}
      <div>
        <h4 className="font-semibold tracking-wider text-gray-200 uppercase font-sans text-sm mb-4">Scent Notes</h4>
        {uniqueNotes.length > 0 ? (
          <>
            <div className="space-y-2">
              {displayedNotes.map(note => (
                <label key={note} className="flex items-center space-x-3 cursor-pointer text-gray-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={filters.notes.includes(note)}
                    onChange={() => handleNoteChange(note)}
                    className="h-4 w-4 bg-brand-dark border-gray-600 text-brand-gold focus:ring-brand-gold"
                  />
                  <span>{note}</span>
                </label>
              ))}
            </div>
            {uniqueNotes.length > 10 && (
              <button onClick={() => setShowAllNotes(!showAllNotes)} className="text-brand-gold text-sm mt-3 hover:underline">
                {showAllNotes ? 'Show Less' : `Show ${uniqueNotes.length - 10} More`}
              </button>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">No scent notes found.</p>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;