import React from 'react';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

interface SortDropdownProps {
  selected: SortOption;
  onSelect: (option: SortOption) => void;
}

const sortOptions: { value: SortOption, label: string }[] = [
  { value: 'default', label: 'Default Sorting' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ selected, onSelect }) => {
  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value as SortOption)}
        className="appearance-none bg-black border border-gray-700 text-gray-300 py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition cursor-pointer"
        aria-label="Sort products"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.516 7.548c.436-.446 1.144-.446 1.58 0L10 10.405l2.904-2.857c.436-.446 1.144-.446 1.58 0 .436.446.436 1.167 0 1.613l-3.72 3.65c-.436.446-1.144.446-1.58 0L5.516 9.16c-.436-.446-.436-1.167 0-1.613z"/>
        </svg>
      </div>
    </div>
  );
};

export default SortDropdown;