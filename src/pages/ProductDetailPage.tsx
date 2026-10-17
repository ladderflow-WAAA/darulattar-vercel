import React, { useState, useMemo, useEffect } from 'react';
import { Product, useProducts, Variant } from '../contexts/ProductContext';
import { PageState } from '../App';
import { useCart } from '../contexts/CartContext';
import { PlusIcon } from '../components/icons/PlusIcon';
import { MinusIcon } from '../components/icons/MinusIcon';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
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

const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className = 'h-5 w-5' }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`${className} ${i < Math.round(rating) ? 'text-[#8C6D47]' : 'text-gray-300'}`}
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
    <motion.div className="mt-16 pt-10 border-t border-gray-200" variants={infoItemVariants}>
      <h3 className="text-2xl font-serif text-gray-900 font-bold mb-6">Customer Reviews</h3>
      
      {/* Review Form */}
      <div className="bg-[#FAF8F5] p-6 mb-10 border border-gray-200 rounded-sm shadow-xs">
      {isAuthenticated && user ? (
          <>
          <h4 className="text-base font-semibold text-gray-900 mb-4">Leave a Review</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-2">Rating</label>
              <div className="flex items-center space-x-1" onMouseLeave={() => setHoverRating(0)}>
                {[...Array(5)].map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                    aria-label={`Set rating to ${i + 1}`}
                  >
                    <StarIcon className={`h-6 w-6 cursor-pointer transition-colors ${(hoverRating || formData.rating) > i ? 'text-[#8C6D47]' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-2">Your Review</label>
              <textarea id="comment" rows={3} value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-sm focus:ring-1 focus:ring-[#C0A080] focus:border-[#C0A080] transition text-gray-900 placeholder-gray-400 text-sm" placeholder="Share your experience..." required></textarea>
            </div>
            <motion.button type="submit" className="bg-black hover:bg-gray-800 text-white py-2.5 px-6 tracking-widest text-xs font-bold uppercase rounded-sm transition" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Submit Review
            </motion.button>
          </form>
          </>
      ) : (
        <div className="text-center py-4">
             <h4 className="text-base font-semibold text-gray-900 mb-2">Have you tried this scent?</h4>
             <p className="text-gray-600 mb-4 text-xs">Log in to share your experience with our community.</p>
             <motion.button onClick={onLoginRequest} className="border border-black text-black py-2 px-6 tracking-widest text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors rounded-sm">
                Login to Review
             </motion.button>
        </div>
      )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {currentReviews.length > 0 ? (
          currentReviews.map((review: Review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 group last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 font-bold text-sm select-none">
                      {review.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center space-x-3">
                            <p className="font-semibold text-gray-900 text-sm">{review.authorName}</p>
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
                    className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label="Delete review"
                    whileTap={{ scale: 0.9 }}
                  >
                    <TrashIcon />
                  </motion.button>
                )}
              </div>
              <p className="mt-2 text-gray-700 font-normal whitespace-pre-wrap pl-14 text-sm leading-relaxed">{review.comment}</p>
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
            <div className="text-xl text-gray-500 animate-pulse font-serif">Loading Essence...</div>
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
      <div className="bg-white min-h-screen text-gray-900 font-sans">
        <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Breadcrumbs items={breadcrumbs} navigate={navigate} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-10 items-start">
            {/* Image Section */}
            <motion.div 
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
                <div className="relative w-full aspect-[4/5] bg-white border border-gray-200 shadow-md rounded-sm overflow-hidden">
                  <ImageZoom 
                    imageUrl={product.imageUrl} 
                    altText={`${product.name} - ${product.categories[0]} Attar Oil Chennai`}
                  />
                  <div className="absolute bottom-4 right-4 bg-white/95 border border-[#C0A080] text-gray-900 text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold shadow-xs">
                    100% Pure Oil
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
              <motion.h1 variants={infoItemVariants} className="text-4xl md:text-5xl font-thin text-gray-900 font-serif tracking-tight">{product.name}</motion.h1>
              
              <motion.div variants={infoItemVariants} className="mt-3 flex items-center space-x-3">
                <div className="flex items-center">
                    <StarRating rating={averageRating} />
                </div>
                <span className="text-gray-400 text-sm">|</span>
                <span className="text-gray-500 text-sm">{productReviews.length} {productReviews.length === 1 ? 'Review' : 'Reviews'}</span>
              </motion.div>

              <motion.p variants={infoItemVariants} className="mt-6 text-3xl text-gray-900 font-serif font-bold">₹{selectedVariant.price.toFixed(2)}</motion.p>
              
              <motion.div variants={infoItemVariants} className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed font-normal text-base">{product.description}</p>
              </motion.div>
              
              <motion.div variants={infoItemVariants} className="mt-8 bg-[#FAF8F5] p-6 border border-gray-200 rounded-sm shadow-xs">
                  <h3 className="text-xs font-bold text-gray-600 tracking-[0.2em] uppercase mb-4">Olfactory Notes</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex"><span className="w-24 text-[#8C6D47] font-semibold">Top:</span> <span className="text-gray-800">{product.scentProfile.top}</span></div>
                      <div className="flex"><span className="w-24 text-[#8C6D47] font-semibold">Heart:</span> <span className="text-gray-800">{product.scentProfile.heart}</span></div>
                      <div className="flex"><span className="w-24 text-[#8C6D47] font-semibold">Base:</span> <span className="text-gray-800">{product.scentProfile.base}</span></div>
                  </div>
              </motion.div>
              
              <motion.div variants={infoItemVariants} className="mt-8">
                  <h3 className="text-xs font-bold text-gray-600 tracking-[0.2em] uppercase mb-3">Select Size</h3>
                  <div className="flex items-center space-x-3">
                    {product.variants.map(variant => (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-6 py-3 border text-sm font-semibold transition-all duration-200 rounded-sm ${selectedVariant.size === variant.size ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-700 hover:border-black hover:text-black bg-white'}`}
                      >
                        {variant.size}
                      </button>
                    ))}
                  </div>
              </motion.div>

              <motion.div variants={infoItemVariants} className="mt-10 flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center border border-gray-300 rounded-sm bg-white w-fit shadow-xs">
                      <motion.button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-4 text-gray-600 hover:text-black transition" whileTap={{ scale: 0.9 }}><MinusIcon /></motion.button>
                      <span className="px-6 text-lg font-bold text-gray-900 w-12 text-center">{quantity}</span>
                      <motion.button onClick={() => setQuantity(q => q + 1)} className="p-4 text-gray-600 hover:text-black transition" whileTap={{ scale: 0.9 }}><PlusIcon/></motion.button>
                  </div>
                  <motion.button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-black hover:bg-gray-800 text-white py-4 px-8 tracking-widest text-xs font-bold uppercase rounded-sm transition-colors duration-300 shadow-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                  >
                    Add to Cart &mdash; ₹{(selectedVariant.price * quantity).toFixed(2)}
                  </motion.button>
              </motion.div>
              
              {/* Local Store Trust Signal */}
              <motion.div variants={infoItemVariants} className="mt-6 flex items-center text-xs text-[#8C6D47] font-semibold">
                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 <span>Available to experience at Thousand Lights, Chennai boutique.</span>
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