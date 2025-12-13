import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageZoomProps {
  imageUrl: string;
  altText: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ imageUrl, altText }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="relative w-full h-full cursor-zoom-in overflow-hidden bg-gray-900 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse z-0"></div>
      )}

      <AnimatePresence>
        <motion.img
          key={imageUrl}
          src={imageUrl}
          alt={altText}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onLoad={() => setIsLoading(false)}
        />
      </AnimatePresence>

      <AnimatePresence>
        {isHovering && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundSize: '200%',
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Hint for mobile/desktop */}
      <div className="absolute bottom-4 left-4 text-white/50 text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        HOVER TO ZOOM
      </div>
    </div>
  );
};

export default ImageZoom;