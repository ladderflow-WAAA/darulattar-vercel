import React from 'react';

export const LogoIcon: React.FC = () => (
  <div className="flex items-center space-x-3">
      <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" stroke="#C0A080" strokeWidth="4"/>
          <path d="M50 25C35 25 30 50 50 50C70 50 65 25 50 25Z" fill="#C0A080"/>
          <path d="M50 75C65 75 70 50 50 50C30 50 35 75 50 75Z" fill="#C0A080"/>
          <rect x="35" y="80" width="30" height="5" fill="#C0A080"/>
      </svg>
      <div className="flex flex-col -space-y-1">
          <span className="font-serif text-xl font-medium tracking-wider text-gray-200">DARUL ATTAR</span>
          <span className="text-[10px] tracking-[0.3em] text-brand-gold font-sans uppercase">Chennai</span>
      </div>
  </div>
);