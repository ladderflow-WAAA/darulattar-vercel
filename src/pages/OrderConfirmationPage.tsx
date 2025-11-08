
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
    clearCart();
  }, [clearCart]);

  if (!orderDetails) {
    return (
      <div className="text-center py-40 max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16">
        <h1 className="text-2xl text-gray-300">No order details found.</h1>
        <button
          onClick={() => navigate({ name: 'home' })}
          className="mt-8 bg-brand-gold text-brand-dark py-3 px-8 tracking-widest text-sm font-bold uppercase hover:bg-white transition-all duration-300"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="bg-brand-dark">
      <motion.div 
        className="max-w-3xl mx-auto px-8 sm:px-12 lg:px-16 text-center pt-32 pb-24 font-sans"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-green-400 mx-auto w-20 h-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { type: 'spring', stiffness: 200, damping: 10, delay: 0.1 } }}
        >
          <CheckCircleIcon />
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-thin text-white font-serif mt-6">
          Thank you for your order!
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-4 text-lg text-gray-400">
          Your order has been placed successfully. A confirmation email will be sent to you shortly.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-12 text-left bg-black p-8">
            <h2 className="text-xl font-serif font-thin text-white border-b border-gray-700 pb-4">Order Summary</h2>
            <div className="flow-root mt-6">
                <ul className="-my-4 divide-y divide-gray-700">
                    {orderDetails.items.map(item => (
                        <li key={item.id} className="flex items-center py-4 space-x-4">
                            <div className="w-16 h-20 flex-shrink-0 bg-gray-800">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-md text-gray-200 font-serif">{item.name}</h3>
                                <p className="mt-1 text-sm text-gray-400">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-md font-medium text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-6">
                <div className="flex justify-between text-lg font-semibold text-white">
                    <span>Total Paid</span>
                    <span>₹{orderDetails.total.toFixed(2)}</span>
                </div>
            </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          onClick={() => navigate({ name: 'home' })}
          className="mt-12 bg-brand-gold text-brand-dark py-4 px-10 tracking-widest text-sm font-bold uppercase"
          whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF' }}
          whileTap={{ scale: 0.95 }}
        >
          CONTINUE SHOPPING
        </motion.button>
      </motion.div>
    </div>
  );
};

export default OrderConfirmationPage;
