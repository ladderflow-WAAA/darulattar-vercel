import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageZoomProps {
  imageUrl: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ imageUrl }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="relative w-full h-full cursor-zoom-in overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence>
        <motion.img
          key={imageUrl}
          src={imageUrl}
          alt="Product"
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundSize: '200%',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageZoom;
