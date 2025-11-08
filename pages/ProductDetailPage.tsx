import React, { useState, useMemo, useEffect } from 'react';
import { Product, useProducts, Variant } from '../contexts/ProductContext';
import { PageState } from '../App';
import { useCart } from '../contexts/CartContext';
import { PlusIcon } from '../components/icons/PlusIcon';
import { MinusIcon } from '../components/icons/MinusIcon';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Review, useReviews } from '../contexts/ReviewsContext';
import { StarIcon } from '../components/icons/StarIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { useToasts } from '../contexts/ToastContext';
import Breadcrumbs from '../components/Breadcrumbs';
import ImageZoom from '../components/ImageZoom';
import RelatedProducts from '../components/RelatedProducts';
import { useAuth } from '../contexts/AuthContext';

// Helper component for star rating display
const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className = 'h-5 w-5' }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`${className} ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`}
        />
      ))}
    </div>
  );
};

// Helper component for the reviews section
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
  };

  return (
    <motion.div className="mt-12 pt-10 border-t border-gray-800" variants={infoItemVariants}>
      <h3 className="text-2xl font-serif text-white mb-6">Customer Reviews</h3>
      {/* Review Form */}
      {isAuthenticated && user ? (
        <div className="bg-black p-6 mb-8">
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
                    <StarIcon className={`h-6 w-6 cursor-pointer transition-colors ${(hoverRating || formData.rating) > i ? 'text-yellow-400' : 'text-gray-600'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-400 mb-2">Your Review</label>
              <textarea id="comment" rows={4} value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} className="block w-full px-4 py-2 bg-brand-dark border-gray-700 rounded-sm focus:ring-brand-gold focus:border-brand-gold transition" required></textarea>
            </div>
            <motion.button type="submit" className="bg-brand-gold/90 text-brand-dark py-2 px-6 tracking-wider text-sm font-sans font-semibold" whileHover={{ backgroundColor: '#C0A080' }}>
              Submit Review
            </motion.button>
          </form>
        </div>
      ) : (
        <div className="bg-black p-6 mb-8 text-center">
             <h4 className="text-lg font-semibold text-gray-200 mb-4">Want to share your thoughts?</h4>
             <p className="text-gray-400 mb-4">Please log in to leave a review.</p>
             <motion.button onClick={onLoginRequest} className="bg-brand-gold/90 text-brand-dark py-2 px-6 tracking-wider text-sm font-sans font-semibold" whileHover={{ backgroundColor: '#C0A080' }}>
                Login to Review
             </motion.button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {currentReviews.length > 0 ? (
          currentReviews.map((review: Review) => (
            <div key={review.id} className="border-b border-gray-800 pb-4 group">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    {review.authorPicture && <img src={review.authorPicture} alt={review.authorName} className="w-10 h-10 rounded-full" />}
                    <div>
                        <div className="flex items-center space-x-3">
                            <p className="font-semibold text-gray-200">{review.authorName}</p>
                            <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                         <div className="my-1">
                            <StarRating rating={review.rating} />
                         </div>
                    </div>
                </div>
                {isAuthenticated && user?.id === review.userId && (
                  <motion.button 
                    onClick={() => deleteReview(review.id)} 
                    className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label="Delete review"
                    whileTap={{ scale: 0.9 }}
                  >
                    <TrashIcon />
                  </motion.button>
                )}
              </div>
              <p className="mt-2 text-gray-400 font-light whitespace-pre-wrap pl-14">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </motion.div>
  );
};


interface ProductDetailPageProps {
  productId: string;
  navigate: (pageState: PageState) => void;
  onLoginRequest: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, navigate, onLoginRequest }) => {
  const { getProductById, products } = useProducts();
  const product = getProductById(productId);
  
  const { addToCart } = useCart();
  const { addToast } = useToasts();
  const { getReviewsForProduct } = useReviews();
  
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
    }
  }, [product]);

  const productReviews = useMemo(() => {
    if (!product) return [];
    return getReviewsForProduct(product.id);
  }, [getReviewsForProduct, product]);

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
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl text-gray-400">Loading Product...</div>
        </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    addToast(`${quantity} x ${product.name} (${selectedVariant.size}) added to cart!`, 'success');
  };

  const breadcrumbs = [
    { label: 'Home', pageState: { name: 'home' } as PageState },
    { label: product.categories[0], pageState: { name: 'category', props: { category: product.categories[0] } } as PageState },
    { label: product.name }
  ];

  const infoContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const infoItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="bg-brand-dark overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 pt-40 pb-12 font-sans">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Breadcrumbs items={breadcrumbs} navigate={navigate} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-8 items-start">
          {/* Image */}
          <motion.div 
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
              <div className="relative w-full aspect-[4/5] bg-black">
                <ImageZoom imageUrl={product.imageUrl} />
              </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="w-full"
            variants={infoContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={infoItemVariants} className="text-4xl md:text-5xl font-thin text-white font-serif">{product.name}</motion.h1>
            
            <motion.div variants={infoItemVariants} className="mt-3 flex items-center space-x-2">
              {productReviews.length > 0 ? (
                <>
                  <StarRating rating={averageRating} />
                  <span className="text-gray-400 text-sm">({productReviews.length} reviews)</span>
                </>
              ) : (
                 <span className="text-gray-500 text-sm">No reviews yet</span>
              )}
            </motion.div>

            <motion.p variants={infoItemVariants} className="mt-4 text-3xl text-brand-gold font-serif">₹{selectedVariant.price.toFixed(2)}</motion.p>
            <motion.div variants={infoItemVariants} className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-gray-300 leading-relaxed font-light">{product.description}</p>
            </motion.div>
            
            <motion.div variants={infoItemVariants} className="mt-8">
                <h3 className="text-md font-semibold text-gray-100 tracking-widest uppercase">Scent Profile</h3>
                <ul className="mt-3 text-gray-400 space-y-2 font-light">
                    <li><strong className="text-gray-300 font-normal">Top Notes:</strong> {product.scentProfile.top}</li>
                    <li><strong className="text-gray-300 font-normal">Heart Notes:</strong> {product.scentProfile.heart}</li>
                    <li><strong className="text-gray-300 font-normal">Base Notes:</strong> {product.scentProfile.base}</li>
                </ul>
            </motion.div>
            
            <motion.div variants={infoItemVariants} className="mt-8">
                <h3 className="text-md font-semibold text-gray-100 tracking-widest uppercase">Size</h3>
                 <div className="mt-3 flex items-center space-x-3">
                  {product.variants.map(variant => (
                    <button
                      key={variant.size}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border rounded-sm transition-colors duration-200 ${selectedVariant.size === variant.size ? 'bg-brand-gold text-brand-dark border-brand-gold' : 'border-gray-600 text-gray-300 hover:border-gray-400'}`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
            </motion.div>

            <motion.div variants={infoItemVariants} className="mt-10 flex items-center space-x-4">
                <div className="flex items-center border border-gray-700">
                    <motion.button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-400 hover:bg-gray-800 transition" whileTap={{ scale: 0.9 }}><MinusIcon /></motion.button>
                    <span className="px-5 text-lg font-medium text-white">{quantity}</span>
                    <motion.button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-400 hover:bg-gray-800 transition" whileTap={{ scale: 0.9 }}><PlusIcon/></motion.button>
                </div>
                <motion.button 
                    onClick={handleAddToCart}
                    className="w-full bg-brand-gold text-brand-dark py-4 px-10 tracking-widest text-sm font-bold uppercase"
                    whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                >
                  <span>Add to Cart</span>
                </motion.button>
            </motion.div>

            <ReviewsSection productId={product.id} infoItemVariants={infoItemVariants} onLoginRequest={onLoginRequest} />
          </motion.div>
        </div>
      </div>
      <RelatedProducts products={relatedProducts} navigate={navigate} />
    </div>
  );
};

export default ProductDetailPage;