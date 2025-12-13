import React, { useEffect } from 'react';
import { PageState } from '../App';
import { useCart, CartItem } from '../contexts/CartContext';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { motion, Variants } from 'framer-motion';

interface OrderDetails {
  items: CartItem[];
  total: number;
}

interface OrderConfirmationPageProps {
  navigate: (pageState: PageState) => void;
  orderDetails?: OrderDetails;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ navigate, orderDetails }) => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Logic mostly moved to CartPage, but ensure cart is cleared if we land here
    clearCart();
  }, [clearCart]);

  return (
    <div className="bg-brand-dark min-h-screen flex items-center justify-center">
      <motion.div 
        className="max-w-xl mx-auto px-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-brand-gold mx-auto w-20 h-20 mb-6">
          <CheckCircleIcon />
        </div>
        <h1 className="text-4xl font-thin text-white font-serif mb-4">
          Order Request Started
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          You should have been redirected to WhatsApp to complete your order with us directly. If not, please check your WhatsApp app.
        </p>

        <button
          onClick={() => navigate({ name: 'home' })}
          className="bg-brand-gold text-brand-dark py-4 px-10 tracking-widest text-sm font-bold uppercase hover:bg-white transition-colors"
        >
          Return to Shop
        </button>
      </motion.div>
    </div>
  );
};

export default OrderConfirmationPage;