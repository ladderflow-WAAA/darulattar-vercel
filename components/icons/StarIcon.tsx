import React from 'react';

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 1l2.928 5.928L19 7.928l-4.5 4.384L15.428 19 10 15.928 4.572 19l.928-6.688L1 7.928l6.072-1.072L10 1z"
      clipRule="evenodd"
    />
  </svg>
);