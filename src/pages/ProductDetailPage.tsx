import React, { useState, useMemo, useEffect } from 'react';
import { Product, useProducts, Variant } from '../contexts/ProductContext';
import { PageState } from '../App';
import { useCart } from '../contexts/CartContext';
import { PlusIcon } from '../components/icons/PlusIcon';
import { MinusIcon } from '../components/icons/MinusIcon';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
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

const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className = 'h-5 w-5' }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`${className} ${i < Math.round(rating) ? 'text-brand-gold' : 'text-gray-800'}`}
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
        addToast("You must be logged in to submit a review.", "error");
        return;
    }
    if (formData.rating === 0 || !formData.comment.trim()) {
      addToast('Please provide a rating and a comment.', 'error');
      return;
    }
    addReview({ ...formData, productId }, { id: user.id, name: user.name, picture: user.picture });
    setFormData({ rating: 0, comment: '' });
    addToast('Review submitted successfully!', 'success');
  };

  return (
    <motion.div className="mt-16 pt-10 border-t border-gray-800" variants={infoItemVariants}>
      <h3 className="text-2xl font-serif text-white mb-6">Customer Reviews</h3>
      
      {/* Review Form */}
      <div className="bg-[#0a0a0a] p-6 mb-10 border border-gray-800">
      {isAuthenticated && user ? (
          <>
          <h4 className="text-lg font-semibold text-gray-200 mb-4">Leave a Review</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Rating</label>
              <div className="flex items-center space-x-1" onMouseLeave={() => setHoverRating(0)}>
                {[...Array(5)].map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                    aria-label={`Set rating to ${i + 1}`}
                  >
                    <StarIcon className={`h-6 w-6 cursor-pointer transition-colors ${(hoverRating || formData.rating) > i ? 'text-brand-gold' : 'text-gray-800'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-400 mb-2">Your Review</label>
              <textarea id="comment" rows={3} value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} className="block w-full px-4 py-2 bg-black border-gray-700 rounded-sm focus:ring-brand-gold focus:border-brand-gold transition text-gray-200 placeholder-gray-600" placeholder="Share your thoughts..." required></textarea>
            </div>
            <motion.button type="submit" className="bg-brand-gold text-brand-dark py-2 px-6 tracking-widest text-xs font-bold uppercase" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Submit Review
            </motion.button>
          </form>
          </>
      ) : (
        <div className="text-center py-4">
             <h4 className="text-lg font-medium text-gray-200 mb-2">Have you tried this scent?</h4>
             <p className="text-gray-400 mb-4 text-sm">Log in to share your experience with our community.</p>
             <motion.button onClick={onLoginRequest} className="border border-brand-gold text-brand-gold py-2 px-6 tracking-widest text-xs font-bold uppercase hover:bg-brand-gold hover:text-brand-dark transition-colors">
                Login to Review
             </motion.button>
        </div>
      )}
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        {currentReviews.length > 0 ? (
          currentReviews.map((review: Review) => (
            <div key={review.id} className="border-b border-gray-800 pb-6 group last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    {review.authorPicture ? (
                        <img src={review.authorPicture} alt={review.authorName} className="w-10 h-10 rounded-full grayscale opacity-80" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-bold">{review.authorName.charAt(0)}</div>
                    )}
                    <div>
                        <div className="flex items-center space-x-3">
                            <p className="font-semibold text-gray-200">{review.authorName}</p>
                            <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                         <div className="my-1">
                            <StarRating rating={review.rating} className="h-3 w-3" />
                         </div>
                    </div>
                </div>
                {isAuthenticated && user?.id === review.userId && (
                  <motion.button 
                    onClick={() => deleteReview(review.id)} 
                    className="text-gray-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label="Delete review"
                    whileTap={{ scale: 0.9 }}
                  >
                    <TrashIcon />
                  </motion.button>
                )}
              </div>
              <p className="mt-2 text-gray-400 font-light whitespace-pre-wrap pl-14 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-sm">No reviews yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </motion.div>
  );
};


interface ProductDetailPageProps {
  productSlug: string; // Changed from productId to productSlug
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
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
      const metaDescription = `Buy ${product.name}, a premium non-alcoholic attar oil by Darul Attar in Chennai. Scent notes: ${product.scentProfile.top}, ${product.scentProfile.heart}. Available at our MMDA Colony store.`;
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
        <div className="flex items-center justify-center min-h-screen bg-brand-dark">
            <div className="text-xl text-gray-400 animate-pulse">Loading Essence...</div>
        </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    addToast(`${quantity} x ${product.name} (${selectedVariant.size}) added to cart!`, 'success');
  };

  const breadcrumbs = [
    { label: 'Home', pageState: { name: 'home' } as PageState },
    { label: product.categories[0] || 'Collection', pageState: { name: 'category', props: { category: product.categories[0] } } as PageState },
    { label: product.name }
  ];

  const infoContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const infoItemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <>
      <ProductSchema product={product} reviews={productReviews} />
      <div className="bg-brand-dark min-h-screen">
        <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-12 font-sans">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Breadcrumbs items={breadcrumbs} navigate={navigate} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-10 items-start">
            {/* Image Section - REMOVED sticky top-32 */}
            <motion.div 
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
                <div className="relative w-full aspect-[4/5] bg-black border border-gray-800 shadow-2xl">
                  <ImageZoom 
                    imageUrl={product.imageUrl} 
                    altText={`${product.name} - ${product.categories[0]} Attar Oil Chennai`}
                  />
                  {/* Updated Badge to Gold/Dark */}
                  <div className="absolute bottom-4 right-4 bg-[#111] border border-brand-gold/30 text-brand-gold text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold">
                    Alcohol Free
                  </div>
                </div>
            </motion.div>

            {/* Product Info Section */}
            <motion.div
              className="w-full"
              variants={infoContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 variants={infoItemVariants} className="text-4xl md:text-5xl font-thin text-white font-serif tracking-tight">{product.name}</motion.h1>
              
              <motion.div variants={infoItemVariants} className="mt-3 flex items-center space-x-3">
                <div className="flex items-center">
                    <StarRating rating={averageRating} />
                </div>
                <span className="text-gray-500 text-sm">|</span>
                <span className="text-gray-400 text-sm">{productReviews.length} {productReviews.length === 1 ? 'Review' : 'Reviews'}</span>
              </motion.div>

              <motion.p variants={infoItemVariants} className="mt-6 text-3xl text-brand-gold font-serif">₹{selectedVariant.price.toFixed(2)}</motion.p>
              
              <motion.div variants={infoItemVariants} className="mt-8 pt-8 border-t border-gray-800">
                  <p className="text-gray-300 leading-relaxed font-light text-lg">{product.description}</p>
              </motion.div>
              
              <motion.div variants={infoItemVariants} className="mt-8 bg-[#0a0a0a] p-6 border border-gray-800">
                  <h3 className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mb-4">Olfactory Notes</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex"><span className="w-24 text-brand-gold font-medium">Top:</span> <span className="text-gray-300">{product.scentProfile.top}</span></div>
                      <div className="flex"><span className="w-24 text-brand-gold font-medium">Heart:</span> <span className="text-gray-300">{product.scentProfile.heart}</span></div>
                      <div className="flex"><span className="w-24 text-brand-gold font-medium">Base:</span> <span className="text-gray-300">{product.scentProfile.base}</span></div>
                  </div>
              </motion.div>
              
              <motion.div variants={infoItemVariants} className="mt-8">
                  <h3 className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mb-3">Select Size</h3>
                  <div className="flex items-center space-x-3">
                    {product.variants.map(variant => (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-6 py-3 border text-sm font-medium transition-all duration-200 ${selectedVariant.size === variant.size ? 'bg-brand-gold text-brand-dark border-brand-gold' : 'border-gray-700 text-gray-400 hover:border-white hover:text-white'}`}
                      >
                        {variant.size}
                      </button>
                    ))}
                  </div>
              </motion.div>

              <motion.div variants={infoItemVariants} className="mt-10 flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center border border-gray-700 w-fit">
                      <motion.button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-4 text-gray-400 hover:bg-gray-800 transition" whileTap={{ scale: 0.9 }}><MinusIcon /></motion.button>
                      <span className="px-6 text-lg font-medium text-white w-12 text-center">{quantity}</span>
                      <motion.button onClick={() => setQuantity(q => q + 1)} className="p-4 text-gray-400 hover:bg-gray-800 transition" whileTap={{ scale: 0.9 }}><PlusIcon/></motion.button>
                  </div>
                  <motion.button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-brand-gold text-brand-dark py-4 px-8 tracking-widest text-sm font-bold uppercase shadow-lg shadow-brand-gold/10 hover:bg-white transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                  >
                    Add to Cart — ₹{(selectedVariant.price * quantity).toFixed(2)}
                  </motion.button>
              </motion.div>
              
              {/* Local Store Trust Signal - Updated Icon Color */}
              <motion.div variants={infoItemVariants} className="mt-6 flex items-center text-sm text-brand-gold/80">
                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 <span>Available to try at our Arumbakkam, Chennai store.</span>
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