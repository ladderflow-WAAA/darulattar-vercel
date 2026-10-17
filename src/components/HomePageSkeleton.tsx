import React from 'react';

const SkeletonCard = () => (
  <div className="bg-gray-100 border border-gray-200 animate-pulse">
    <div className="w-full aspect-[4/5] bg-gray-200"></div>
    <div className="p-5 text-center">
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
      <div className="h-3 bg-gray-100 rounded w-1/4 mx-auto"></div>
    </div>
  </div>
);

const HomePageSkeleton: React.FC = () => {
  return (
    <div className="overflow-x-hidden bg-white min-h-screen">
      {/* Hero Skeleton */}
      <section className="relative h-screen bg-brand-cream/30 flex items-center justify-start text-left">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-white animate-pulse"></div>
        <div className="relative z-10 max-w-3xl px-8 sm:px-12 lg:px-16 w-full">
          <div className="h-4 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full max-w-md mb-3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 max-w-md mb-10 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
      </section>

      {/* Collection Skeleton */}
      <section className="py-24 bg-white">
        <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageSkeleton;