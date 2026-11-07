import React, { useRef, useMemo, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { useCart } from '../contexts/CartContext';
import { Product, slugify } from '../contexts/ProductContext';
import { PageState } from '../App';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { useReviews } from '../contexts/ReviewsContext';
import { StarIcon } from './icons/StarIcon';
import { useToasts } from '../contexts/ToastContext';

// Micro star rating indicator
const StarRatingMicro: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center justify-center space-x-0.5">
    {[...Array(5)].map((_, i) => (
      <StarIcon 
        key={i} 
        className={`h-3 w-3 ${i < Math.round(rating) ? 'text-brand-gold-dark' : 'text-gray-200'}`} 
      />
    ))}
  </div>
);

interface ProductCardProps {
  product: Product;
  navigate: (pageState: PageState) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, navigate }) => {
  const { name, imageUrl, variants, categories } = product;
  const defaultVariant = variants?.[0];
  const { addToCart, updateQuantity, cartItems } = useCart();
  const { getReviewsForProduct } = useReviews();
  const { addToast } = useToasts();
  
  const variantSize = defaultVariant?.size || 'default';
  const cartItemId = `${product.id}-${variantSize}`;
  const cartItem = cartItems.find(item => item.cartItemId === cartItemId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const productReviews = useMemo(() => getReviewsForProduct(product.id), [getReviewsForProduct, product.id]);

  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return 0;
    return productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
  }, [productReviews]);

  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D physics tilt tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 240, mass: 0.1 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!defaultVariant) return;
    addToCart(product, defaultVariant, 1);
    addToast(`${product.name} added to cart`, 'success');
  };
  
  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(cartItemId, quantityInCart + 1);
  };

  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantityInCart > 0) {
      updateQuantity(cartItemId, quantityInCart - 1);
    }
  };

  const primaryCategory = categories && categories.length > 0 ? categories[0] : 'Pure Attar';

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate({ name: 'product', props: { slug: slugify(product.name), name: product.name } })}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="group relative bg-white border border-gray-200/90 rounded-xl overflow-hidden cursor-pointer flex flex-col h-full shadow-[0_4px_20px_-2px_rgba(17,24,39,0.04)] hover:shadow-[0_20px_45px_-10px_rgba(140,109,71,0.18)] hover:border-brand-gold/60 transition-all duration-500 perspective-1000"
    >
      {/* Ambient Radial Hover Glow Propagation */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        style={{
          background: `radial-gradient(circle at 50% 30%, rgba(192, 160, 128, 0.16), transparent 70%)`,
        }}
      />

      {/* Visual Media Container with Layered Parallax */}
      <div 
        style={{ transform: 'translateZ(15px)' }} 
        className="relative w-full aspect-[4/5] bg-[#FAF8F5] overflow-hidden"
      >
        {/* Subtle Category Pill Tag */}
        <div className="absolute top-3 left-3 z-20">
          <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-gray-700 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-gray-200/70 shadow-2xs">
            {primaryCategory}
          </span>
        </div>

        {/* Product Image */}
        <img
          src={imageUrl}
          alt={`${name} - ${primaryCategory} in Chennai`}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
          loading="lazy"
        />

        {/* Subtle Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
      </div>
      
      {/* Editorial Details Container */}
      <div 
        style={{ transform: 'translateZ(25px)' }} 
        className="p-5 flex flex-col flex-grow bg-white text-center relative z-20"
      >
        <h3 className="font-serif text-xl sm:text-2xl text-brand-charcoal tracking-normal font-normal group-hover:text-brand-gold-dark transition-colors duration-300">
          {name}
        </h3>
        
        {/* Review rating indicator */}
        <div className="mt-1.5 h-4 flex items-center justify-center space-x-1.5">
          {productReviews.length > 0 ? (
            <>
              <StarRatingMicro rating={averageRating} />
              <span className="text-[11px] font-mono text-gray-400">({productReviews.length})</span>
            </>
          ) : (
            <span className="text-[11px] font-sans text-gray-400">Artisanal Extract</span>
          )}
        </div>
        
        {/* Pricing with Tabular Numerals */}
        <p className="mt-3 text-base sm:text-lg font-mono font-medium text-brand-charcoal">
          ₹{(defaultVariant?.price ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          {defaultVariant?.size && (
            <span className="ml-1 text-xs font-sans text-gray-500 font-normal">/ {defaultVariant.size}</span>
          )}
        </p>
        
        {/* Dynamic Cart Interaction Controls */}
        <div className="mt-4 pt-2">
          <AnimatePresence mode="wait">
            {quantityInCart === 0 ? (
              <motion.button
                key="add-button"
                onClick={handleAddToCart}
                aria-label={`Add ${name} to cart`}
                className="w-full py-2.5 px-4 text-xs tracking-[0.16em] uppercase font-semibold text-brand-charcoal border border-gray-300 hover:border-brand-charcoal hover:bg-brand-charcoal hover:text-white rounded-full transition-all duration-300 shadow-2xs hover:shadow-elevation-1"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                Add to Cart
              </motion.button>
            ) : (
              <motion.div 
                key="quantity-controls"
                className="flex items-center justify-between border border-brand-gold/70 bg-brand-gold-subtle/40 rounded-full px-2 py-1 shadow-2xs"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button 
                  onClick={handleDecreaseQuantity} 
                  className="p-1.5 text-gray-700 hover:text-black hover:bg-white rounded-full transition-colors" 
                  aria-label={`Decrease quantity of ${name}`} 
                  whileTap={{ scale: 0.88 }}
                >
                  <MinusIcon />
                </motion.button>
                <span className="px-3 text-xs font-mono font-bold text-brand-charcoal select-none">
                  {quantityInCart} in bag
                </span>
                <motion.button 
                  onClick={handleIncreaseQuantity} 
                  className="p-1.5 text-gray-700 hover:text-black hover:bg-white rounded-full transition-colors" 
                  aria-label={`Increase quantity of ${name}`} 
                  whileTap={{ scale: 0.88 }}
                >
                  <PlusIcon />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
