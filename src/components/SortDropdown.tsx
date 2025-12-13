import React from 'react';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

interface SortDropdownProps {
  selected: SortOption;
  onSelect: (option: SortOption) => void;
}

const sortOptions: { value: SortOption, label: string }[] = [
  { value: 'default', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ selected, onSelect }) => {
  return (
    <div className="relative group">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value as SortOption)}
        className="appearance-none bg-black/80 border border-gray-800 text-gray-300 py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-brand-gold transition-colors cursor-pointer rounded-sm hover:border-gray-600 w-full sm:w-auto"
        aria-label="Sort products"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value} className="bg-black text-gray-300">
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 group-hover:text-brand-gold transition-colors">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </div>
    </div>
  );
};

export default SortDropdown;