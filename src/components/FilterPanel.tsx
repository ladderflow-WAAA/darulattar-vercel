import React, { useMemo, useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
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
    return [...new Set(allCategories)].sort();
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
  
  const displayedNotes = showAllNotes ? uniqueNotes : uniqueNotes.slice(0, 8);

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
    <div className="bg-[#0a0a0a] border border-gray-800 p-6 space-y-10 h-full rounded-sm">
      <div className="flex justify-between items-center pb-4 border-b border-gray-800">
        <h3 className="text-lg font-serif text-white tracking-wide">Refine Selection</h3>
        <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-brand-gold transition-colors uppercase tracking-wider">Reset</button>
      </div>

      {/* Categories Filter */}
      {showCategories && (
        <div>
          <h4 className="font-bold text-gray-500 uppercase text-xs tracking-widest mb-4">Collection</h4>
          <div className="space-y-3">
            {uniqueCategories.length > 0 ? uniqueCategories.map(category => (
              <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="peer h-4 w-4 appearance-none border border-gray-700 rounded-sm bg-transparent checked:bg-brand-gold checked:border-brand-gold transition-all"
                  />
                  <svg className="absolute w-3 h-3 text-brand-dark hidden peer-checked:block pointer-events-none left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{category}</span>
              </label>
            )) : (
              <p className="text-xs text-gray-600">No collections found.</p>
            )}
          </div>
        </div>
      )}

      {/* Price Filter */}
      <div>
        <h4 className="font-bold text-gray-500 uppercase text-xs tracking-widest mb-6">Price (INR)</h4>
        <PriceRangeSlider
            min={priceBounds.min}
            max={priceBounds.max}
            values={filters.priceRange}
            onChange={handlePriceChange}
        />
      </div>

      {/* Scent Notes Filter */}
      <div>
        <h4 className="font-bold text-gray-500 uppercase text-xs tracking-widest mb-4">Scent Notes</h4>
        {uniqueNotes.length > 0 ? (
          <>
            <div className="space-y-3">
              {displayedNotes.map(note => (
                <label key={note} className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.notes.includes(note)}
                      onChange={() => handleNoteChange(note)}
                      className="peer h-4 w-4 appearance-none border border-gray-700 rounded-sm bg-transparent checked:bg-brand-gold checked:border-brand-gold transition-all"
                    />
                    <svg className="absolute w-3 h-3 text-brand-dark hidden peer-checked:block pointer-events-none left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors capitalize">{note}</span>
                </label>
              ))}
            </div>
            {uniqueNotes.length > 8 && (
              <button onClick={() => setShowAllNotes(!showAllNotes)} className="text-gray-500 text-xs mt-4 hover:text-brand-gold transition-colors border-b border-dashed border-gray-800 pb-0.5">
                {showAllNotes ? 'Show Less' : `+ ${uniqueNotes.length - 8} more notes`}
              </button>
            )}
          </>
        ) : (
          <p className="text-xs text-gray-600">No notes found.</p>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;