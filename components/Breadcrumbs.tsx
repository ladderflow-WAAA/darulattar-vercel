import React from 'react';
import { PageState } from '../App';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

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
      <ol className="flex items-center space-x-2 text-sm text-gray-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            {index > 0 && <span className="text-gray-600">/</span>}
            {item.pageState ? (
              <button 
                onClick={() => navigate(item.pageState)}
                className="hover:text-white hover:underline transition"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-gray-200">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
