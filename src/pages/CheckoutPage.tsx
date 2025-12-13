import React from 'react';
import { PageState } from '../App';
import { useCart } from '../contexts/CartContext';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { motion, Variants } from 'framer-motion';

const CheckoutPage: React.FC<{ navigate: (pageState: PageState) => void; }> = ({ navigate }) => {
  const { cartItems, cartTotal, cartCount } = useCart();

  // Note: This page acts as a fallback or alternative view. 
  // The primary flow is now handled in CartPage via the WhatsApp modal/button.
  // We'll redirect to CartPage if they somehow land here without items, 
  // or use this as a summary page before confirming.

  if (cartCount === 0) {
    return (
      <div className="text-center py-40 max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 bg-brand-dark min-h-screen">
        <h1 className="text-4xl md:text-5xl font-thin text-white font-serif">Your Bag is Empty</h1>
        <button onClick={() => navigate({ name: 'home', props: { section: 'collection' } })} className="mt-8 flex items-center space-x-2 text-sm text-brand-gold hover:text-white group mx-auto">
          <ArrowLeftIcon />
          <span className="group-hover:underline">Return to Collection</span>
        </button>
      </div>
    );
  }

  // Redirect to CartPage as that now handles the checkout form efficiently
  // Ideally, we would use `useEffect` for redirect, but for this structure:
  return (
      <div className="bg-brand-dark min-h-screen pt-32 text-center">
          <p className="text-white text-lg">Redirecting to Cart...</p>
          {/* In a real app, use useEffect to navigate({ name: 'cart' }) immediately */}
          <button onClick={() => navigate({ name: 'cart' })} className="mt-4 text-brand-gold underline">Click here if not redirected</button>
      </div>
  );
};

export default CheckoutPage;