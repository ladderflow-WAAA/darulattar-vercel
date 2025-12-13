import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { Product } from '../contexts/ProductContext';
import { PageState } from '../App';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { useReviews } from '../contexts/ReviewsContext';
import { StarIcon } from './icons/StarIcon';
import { useToasts } from '../contexts/ToastContext';

// Star rating component for the card
const StarRatingMicro: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center justify-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} className={`h-3 w-3 ${i < Math.round(rating) ? 'text-brand-gold' : 'text-gray-700'}`} />
    ))}
  </div>
);

interface ProductCardProps {
  product: Product;
  navigate: (pageState: PageState) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, navigate }) => {
  const { name, imageUrl, variants } = product;
  const defaultVariant = variants[0];
  const { addToCart, updateQuantity, cartItems } = useCart();
  const { getReviewsForProduct } = useReviews();
  const { addToast } = useToasts();
  
  const cartItemId = `${product.id}-${defaultVariant.size}`;
  const cartItem = cartItems.find(item => item.cartItemId === cartItemId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const productReviews = useMemo(() => getReviewsForProduct(product.id), [getReviewsForProduct, product.id]);

  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return 0;
    return productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
  }, [productReviews]);

  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  }

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
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
  
  return (
    <motion.div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate({ name: 'product', props: { id: product.id } })}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className="group font-sans bg-brand-dark border border-gray-800 transition-all duration-300 hover:border-brand-gold/40 hover:shadow-xl hover:shadow-black/60 cursor-pointer flex flex-col h-full relative"
    >
      <div style={{ transform: "translateZ(20px)" }} className="relative w-full aspect-[4/5] bg-gray-900 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${name} - ${product.categories.length > 0 ? product.categories[0] : 'premium attar'} - Chennai`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>
      
      <div style={{ transform: "translateZ(10px)" }} className="p-5 text-center flex flex-col flex-grow bg-black/40 backdrop-blur-sm">
        <h3 className="text-lg text-gray-200 tracking-wide font-serif flex-grow group-hover:text-brand-gold transition-colors">{name}</h3>
        
        {productReviews.length > 0 ? (
          <div className="mt-2 mb-1 flex items-center justify-center space-x-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
            <StarRatingMicro rating={averageRating} />
            <span className="text-[10px] text-gray-500">({productReviews.length})</span>
          </div>
        ) : (
            <div className="h-6"></div> 
        )}
        
        <p className="mt-1 text-md font-medium text-brand-gold">₹{defaultVariant.price.toFixed(2)}</p>
        
        <div className="mt-4 h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {quantityInCart === 0 ? (
                <motion.button
                    key="add"
                    onClick={handleAddToCart}
                    aria-label={`Add ${name} to cart`}
                    className="w-full text-brand-gold border border-brand-gold/30 hover:border-brand-gold hover:bg-brand-gold hover:text-brand-dark py-2 px-4 tracking-wider text-xs font-bold uppercase transition-all duration-300"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                >
                    Add to Cart
                </motion.button>
            ) : (
                <motion.div 
                  key="quantity"
                  className="flex items-center justify-center border border-brand-gold/50 bg-brand-dark"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                    <motion.button onClick={handleDecreaseQuantity} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition" aria-label={`Decrease quantity of ${name}`} whileTap={{ scale: 0.9 }}>
                        <MinusIcon />
                    </motion.button>
                    <span className="px-4 text-sm font-medium text-white select-none">{quantityInCart}</span>
                    <motion.button onClick={handleIncreaseQuantity} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition" aria-label={`Increase quantity of ${name}`} whileTap={{ scale: 0.9 }}>
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