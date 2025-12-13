import React from 'react';
import { PageState } from '../App';

interface BreadcrumbItem {
  label: string;
  pageState?: PageState;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  navigate: (pageState: PageState) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, navigate }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-2 text-xs uppercase tracking-widest font-medium">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="text-gray-700 mx-2">/</span>}
            {item.pageState ? (
              <button 
                onClick={() => navigate(item.pageState)}
                className="text-gray-500 hover:text-brand-gold transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-brand-gold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;