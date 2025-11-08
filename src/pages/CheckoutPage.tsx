
import React from 'react';
import { PageState } from '../App';
import { useCart } from '../contexts/CartContext';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { motion, Variants } from 'framer-motion';

const CheckoutPage: React.FC<{ navigate: (pageState: PageState) => void; }> = ({ navigate }) => {
  const { cartItems, cartTotal, cartCount } = useCart();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      name: 'orderConfirmation',
      props: {
        orderDetails: {
          items: cartItems,
          total: cartTotal,
        },
      },
    });
  };

  const formContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const formItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };


  if (cartCount === 0) {
    return (
      <div className="text-center py-40 max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16">
        <h1 className="text-4xl md:text-5xl font-thin text-white font-serif">Checkout</h1>
        <p className="text-xl text-gray-500 mt-8">Your cart is empty. You can't proceed to checkout.</p>
        <button onClick={() => navigate({ name: 'home', props: { section: 'collection' } })} className="mt-8 flex items-center space-x-2 text-sm text-brand-gold hover:text-white group mx-auto">
          <ArrowLeftIcon />
          <span className="group-hover:underline">Return to Collection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-dark overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-24 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
          {/* Form Section */}
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <button onClick={() => navigate({ name: 'cart' })} className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white mb-8 group">
              <ArrowLeftIcon />
              <span className="group-hover:underline">Back to Cart</span>
            </button>
            <form onSubmit={handlePlaceOrder}>
              <motion.div 
                className="space-y-12"
                variants={formContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Contact Information */}
                <motion.div variants={formItemVariants}>
                  <h2 className="text-2xl font-serif font-thin text-white">Contact Information</h2>
                  <div className="mt-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email address</label>
                    <input type="email" id="email" name="email" required className="block w-full px-4 py-3 bg-black border-gray-700 rounded-sm focus:ring-brand-gold focus:border-brand-gold transition" />
                  </div>
                </motion.div>

                {/* Shipping Address */}
                <motion.div variants={formContainerVariants}>
                  <motion.h2 variants={formItemVariants} className="text-2xl font-serif font-thin text-white">Shipping Address</motion.h2>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                    <motion.div variants={formItemVariants} className="sm:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                        <input type="text" id="name" name="name" required className="block w-full px-4 py-3 bg-black border-gray-700 rounded-sm focus:ring-brand-gold focus:border-brand-gold transition" />
                    </motion.div>
                    <motion.div variants={formItemVariants} className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                        <input type="text" id="address" name="address" required className="block w-full px-4 py-3 bg-black border-gray-700 rounded-sm focus:ring-brand-gold focus:border-brand-gold transition" />
                    </motion.div>
                    <motion.div variants={formItemVariants}>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-2">City</label>
                        <input type="text" id="city" name="city" required className="block w-full px-4 py-3 bg-black border-gray-700 rounded-sm focus:ring-brand-gold focus:border-brand-gold transition" />
                    </motion.div>
                     <motion.div variants={formItemVariants}>
                        <label htmlFor="postal-code" className="block text-sm font-medium text-gray-400 mb-2">Postal Code</label>
                        <input type="text" id="postal-code" name="postal-code" required className="block w-full px-4 py-3 bg-black border-gray-700 rounded-sm focus:ring-brand-gold focus:border-brand-gold transition" />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
              <motion.button 
                type="submit" 
                className="mt-12 w-full bg-brand-gold text-brand-dark py-4 px-10 tracking-widest text-sm font-bold uppercase"
                whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF' }}
                whileTap={{ scale: 0.95 }}
              >
                PLACE ORDER
              </motion.button>
            </form>
          </motion.div>

          {/* Order Summary Section */}
          <motion.div 
            className="order-1 lg:order-2 lg:pt-20 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="bg-black p-8">
              <h2 className="text-2xl font-serif font-thin text-white border-b border-gray-700 pb-4">Order Summary</h2>
              <div className="flow-root mt-6">
                <ul className="-my-4 divide-y divide-gray-700">
                  {cartItems.map(item => (
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
              <div className="mt-8 border-t border-gray-700 pt-6 space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-white">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
