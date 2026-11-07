import React, { useState, useMemo, useEffect } from 'react';
import { Product, useProducts, Variant } from '../contexts/ProductContext';
import { PageState } from '../App';
import { useCart } from '../contexts/CartContext';
import { PlusIcon } from '../components/icons/PlusIcon';
import { MinusIcon } from '../components/icons/MinusIcon';
import { motion, type Variants } from 'motion/react';
import { Review, useReviews } from '../contexts/ReviewsContext';
import { StarIcon } from '../components/icons/StarIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { useToasts } from '../contexts/ToastContext';
import Breadcrumbs from '../components/Breadcrumbs';
import ImageZoom from '../components/ImageZoom';
import RelatedProducts from '../components/RelatedProducts';
import { useAuth } from '../contexts/AuthContext';
import { setMetadata } from '../utils/metadata';
import ProductSchema from '../components/ProductSchema';
import DelhiveryShippingCalculator from '../components/DelhiveryShippingCalculator';

const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className = 'h-4 w-4' }) => {
  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`${className} ${i < Math.round(rating) ? 'text-brand-gold-dark' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
};

const ReviewsSection: React.FC<{ productId: string, infoItemVariants: Variants, onLoginRequest: () => void; }> = ({ productId, infoItemVariants, onLoginRequest }) => {
  const { getReviewsForProduct, addReview, deleteReview } = useReviews();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToasts();
  const [formData, setFormData] = useState({ rating: 0, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);

  const currentReviews = getReviewsForProduct(productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast("Authentication required to submit review.", "error");
      return;
    }
    if (formData.rating === 0 || !formData.comment.trim()) {
      addToast('Rating and comment are required.', 'error');
      return;
    }
    addReview({ ...formData, productId }, { id: user.id, name: user.name, picture: user.picture });
    setFormData({ rating: 0, comment: '' });
    addToast('Review submitted successfully.', 'success');
  };

  return (
    <motion.div className="mt-16 pt-10 border-t border-gray-100" variants={infoItemVariants}>
      <h3 className="text-2xl font-serif text-brand-charcoal font-normal mb-6">Customer Reviews</h3>
      
      {/* Review Submission Form */}
      <div className="bg-brand-ivory p-6 sm:p-8 mb-10 border border-gray-200/80 rounded-xl shadow-2xs">
        {isAuthenticated && user ? (
          <>
            <h4 className="text-sm font-semibold text-brand-charcoal mb-4">Share Your Olfactory Impression</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-600 mb-2 font-semibold">
                  Rating
                </label>
                <div className="flex items-center space-x-1" onMouseLeave={() => setHoverRating(0)}>
                  {[...Array(5)].map((_, i) => (
                    <button
                      type="button"
                      key={i}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onClick={() => setFormData({ ...formData, rating: i + 1 })}
                      aria-label={`Set rating to ${i + 1}`}
                      className="p-1 focus:outline-none"
                    >
                      <StarIcon className={`h-5 w-5 transition-colors ${(hoverRating || formData.rating) > i ? 'text-brand-gold-dark' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="block text-[11px] font-mono uppercase tracking-widest text-gray-600 mb-2 font-semibold">
                  Notes on Longevity &amp; Projection
                </label>
                <textarea 
                  id="comment" 
                  rows={3} 
                  value={formData.comment} 
                  onChange={e => setFormData({...formData, comment: e.target.value})} 
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-gold-dark focus:border-brand-gold-dark text-gray-900 placeholder-gray-400 text-sm transition-all resize-none" 
                  placeholder="Describe development, projection, and wear duration on skin..." 
                  required
                />
              </div>
              <motion.button 
                type="submit" 
                className="bg-brand-charcoal hover:bg-brand-gold-dark text-white py-3 px-8 text-xs font-semibold tracking-[0.16em] uppercase rounded-full transition-all duration-300 shadow-2xs" 
                whileTap={{ scale: 0.98 }}
              >
                Submit Review
              </motion.button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <h4 className="text-sm font-semibold text-brand-charcoal mb-2">Have you experienced this oil?</h4>
            <p className="text-gray-500 mb-4 text-xs">Log in to leave verified feedback on scent longevity and projection.</p>
            <motion.button 
              onClick={onLoginRequest} 
              className="border border-brand-charcoal text-brand-charcoal py-2.5 px-6 text-xs font-semibold tracking-widest uppercase hover:bg-brand-charcoal hover:text-white transition-all rounded-full"
              whileTap={{ scale: 0.97 }}
            >
              Sign In to Review
            </motion.button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {currentReviews.length > 0 ? (
          currentReviews.map((review: Review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 group last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-brand-gold-subtle border border-brand-gold/40 flex items-center justify-center text-brand-gold-dark font-mono font-bold text-xs select-none">
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-brand-charcoal text-sm">{review.authorName}</p>
                      <span className="text-gray-300 text-xs">•</span>
                      <p className="text-xs font-mono text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                    <div className="my-1">
                      <StarRating rating={review.rating} className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                {isAuthenticated && user?.id === review.userId && (
                  <motion.button 
                    onClick={() => deleteReview(review.id)} 
                    className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    aria-label="Delete review"
                    whileTap={{ scale: 0.9 }}
                  >
                    <TrashIcon />
                  </motion.button>
                )}
              </div>
              <p className="mt-2 text-gray-700 font-normal whitespace-pre-wrap pl-12 text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-xs">No reviews cataloged yet for this blend.</p>
        )}
      </div>
    </motion.div>
  );
};

interface ProductDetailPageProps {
  productSlug: string;
  navigate: (pageState: PageState) => void;
  onLoginRequest: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productSlug, navigate, onLoginRequest }) => {
  const { getProductBySlug, products } = useProducts();
  const product = getProductBySlug(productSlug);
  
  const { addToCart } = useCart();
  const { addToast } = useToasts();
  const { getReviewsForProduct } = useReviews();

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const productReviews = useMemo(() => {
    if (!product) return [];
    return getReviewsForProduct(product.id);
  }, [getReviewsForProduct, product]);
  
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0] || null);
      setQuantity(1);
      const metaDescription = `Buy ${product.name}, a pure non-alcoholic attar oil by Darul Attar in Chennai. Scent notes: ${product.scentProfile.top}, ${product.scentProfile.heart}.`;
      setMetadata(
        `${product.name} - Authentic Attar Oil | Darul Attar Chennai`,
        metaDescription.substring(0, 160)
      );
    }
  }, [product]);

  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return 0;
    return productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
  }, [productReviews]);
  
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.id !== product.id && p.categories.some(cat => product.categories.includes(cat)))
      .slice(0, 4);
  }, [product, products]);

  if (!product || !selectedVariant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-base text-gray-500 font-serif">Cataloging Blend...</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    addToast(`${quantity} x ${product.name} (${selectedVariant.size}) added to cart`, 'success');
  };

  const breadcrumbs = [
    { label: 'Home', pageState: { name: 'home' } as PageState },
    { label: product.categories[0] || 'Collection', pageState: { name: 'category', props: { category: product.categories[0] } } as PageState },
    { label: product.name }
  ];

  const infoContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const infoItemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      <ProductSchema product={product} reviews={productReviews} />
      <div className="bg-white min-h-screen text-gray-900 font-sans">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 pt-28 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Breadcrumbs items={breadcrumbs} navigate={navigate} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-8 items-start">
            {/* Visual Media Section */}
            <motion.div 
              className="lg:col-span-6 w-full"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-full aspect-[4/5] bg-brand-ivory border border-gray-200/90 shadow-sm rounded-2xl overflow-hidden">
                <ImageZoom 
                  imageUrl={product.imageUrl} 
                  altText={`${product.name} - ${product.categories[0]} Attar Oil Chennai`}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-brand-gold/40 text-brand-charcoal text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-mono font-semibold shadow-2xs">
                  100% Non-Alcoholic Oil
                </div>
              </div>
            </motion.div>

            {/* Product Specifications Section */}
            <motion.div
              className="lg:col-span-6 w-full"
              variants={infoContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                variants={infoItemVariants} 
                className="text-3xl sm:text-5xl font-serif text-brand-charcoal font-normal tracking-tight"
              >
                {product.name}
              </motion.h1>
              
              <motion.div variants={infoItemVariants} className="mt-3 flex items-center space-x-3">
                <StarRating rating={averageRating} />
                <span className="text-gray-300 text-xs">|</span>
                <span className="text-gray-500 font-mono text-xs">
                  {productReviews.length} {productReviews.length === 1 ? 'Review' : 'Reviews'}
                </span>
              </motion.div>

              <motion.p variants={infoItemVariants} className="mt-5 text-2xl sm:text-3xl font-mono text-brand-charcoal font-semibold">
                ₹{selectedVariant.price.toFixed(2)}
                <span className="ml-2 text-xs font-sans text-gray-500 font-normal">/ {selectedVariant.size}</span>
              </motion.p>
              
              <motion.div variants={infoItemVariants} className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-gray-700 leading-relaxed font-sans text-base">{product.description}</p>
              </motion.div>
              
              {/* Olfactory Scent Architecture */}
              <motion.div variants={infoItemVariants} className="mt-8 bg-brand-ivory p-6 border border-gray-200/80 rounded-xl">
                <h3 className="text-xs font-mono uppercase tracking-widest text-brand-gold-dark font-semibold mb-4">
                  Olfactory Accord
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-baseline">
                    <span className="w-20 font-mono text-xs text-gray-500 uppercase tracking-wider">Top:</span>
                    <span className="text-gray-900 font-medium">{product.scentProfile.top}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-20 font-mono text-xs text-gray-500 uppercase tracking-wider">Heart:</span>
                    <span className="text-gray-900 font-medium">{product.scentProfile.heart}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-20 font-mono text-xs text-gray-500 uppercase tracking-wider">Base:</span>
                    <span className="text-gray-900 font-medium">{product.scentProfile.base}</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Size Variant Picker */}
              <motion.div variants={infoItemVariants} className="mt-8">
                <h3 className="text-xs font-mono uppercase tracking-widest text-gray-600 font-semibold mb-3">
                  Bottle Volume
                </h3>
                <div className="flex items-center space-x-3">
                  {product.variants.map(variant => {
                    const isSelected = selectedVariant.size === variant.size;
                    return (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider font-semibold transition-all duration-200 ${
                          isSelected
                            ? 'bg-brand-charcoal text-white shadow-xs'
                            : 'bg-white border border-gray-300 text-gray-800 hover:border-black'
                        }`}
                      >
                        {variant.size}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Quantity & Add to Cart Controls */}
              <motion.div variants={infoItemVariants} className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-gray-200 rounded-full bg-white w-fit px-2 py-1 shadow-2xs">
                  <motion.button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className="p-2 text-gray-600 hover:text-black rounded-full hover:bg-gray-100 transition-colors" 
                    whileTap={{ scale: 0.9 }}
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon />
                  </motion.button>
                  <span className="px-4 text-sm font-mono font-bold text-gray-900 min-w-8 text-center">{quantity}</span>
                  <motion.button 
                    onClick={() => setQuantity(q => q + 1)} 
                    className="p-2 text-gray-600 hover:text-black rounded-full hover:bg-gray-100 transition-colors" 
                    whileTap={{ scale: 0.9 }}
                    aria-label="Increase quantity"
                  >
                    <PlusIcon/>
                  </motion.button>
                </div>
                
                <motion.button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand-charcoal hover:bg-brand-gold-dark text-white py-4 px-8 text-xs font-semibold tracking-[0.18em] uppercase rounded-full transition-all duration-300 shadow-elevation-1 hover:shadow-luxury"
                  whileTap={{ scale: 0.98 }}
                >
                  Add to Cart &mdash; ₹{(selectedVariant.price * quantity).toFixed(2)}
                </motion.button>
              </motion.div>
              
              {/* Provenance Hallmark */}
              <motion.div variants={infoItemVariants} className="mt-6 flex items-center text-xs text-brand-gold-dark font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-dark mr-2"></span>
                <span>Available for sensory sampling at #144 Greams Road, Thousand Lights, Chennai.</span>
              </motion.div>

              {/* Delhivery Shipping Calculator Integration */}
              <motion.div variants={infoItemVariants} className="mt-6">
                <DelhiveryShippingCalculator cartSubtotal={selectedVariant.price * quantity} compact={true} />
              </motion.div>

              <ReviewsSection productId={product.id} infoItemVariants={infoItemVariants} onLoginRequest={onLoginRequest} />
            </motion.div>
          </div>
        </div>
        <RelatedProducts products={relatedProducts} navigate={navigate} />
      </div>
    </>
  );
};

export default ProductDetailPage;
