import React, { useState } from 'react';
import { PageState } from '../App';
import { useCart } from '../contexts/CartContext';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { MinusIcon } from '../components/icons/MinusIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { WhatsappIcon } from '../components/icons/WhatsappIcon';
import { motion, AnimatePresence } from 'framer-motion';

interface CartPageProps {
  navigate: (pageState: PageState) => void;
}

const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
  const [errors, setErrors] = useState({ name: false, address: false, phone: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value) {
        setErrors(prev => ({...prev, [name]: false}));
    }
  };

  const validateForm = () => {
      const newErrors = {
          name: !formData.name.trim(),
          address: !formData.address.trim(),
          phone: !formData.phone.trim(),
      };
      setErrors(newErrors);
      return !newErrors.name && !newErrors.address && !newErrors.phone;
  };

  const handleConfirmOnWhatsApp = () => {
      if (!validateForm()) {
          return;
      }

      const itemsSummary = cartItems.map(item => 
          `${item.quantity} x ${item.name} (${item.size}) - ₹${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');

      const messageParts = [
        'New Order from Darul Attar!',
        '-----------------------------',
        '*Customer Details:*',
        `Name: ${formData.name}`,
        `Address: ${formData.address}`,
        `Phone: ${formData.phone}`,
        '-----------------------------',
        '*Order Summary:*',
        itemsSummary,
        '-----------------------------',
        `*Total Amount: ₹${cartTotal.toFixed(2)}*`
      ];
      
      const message = messageParts.join('\n');
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/919578994377?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      clearCart();
      navigate({ name: 'home' }); 
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-brand-dark min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 pt-40 pb-24 font-sans">
        <motion.div 
          className="flex justify-between items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <h1 className="text-4xl md:text-5xl font-thin text-white font-serif">Your Cart</h1>
            <button onClick={() => navigate({ name: 'home', props: {section: 'collection'} })} className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white group">
              <ArrowLeftIcon />
              <span className="group-hover:underline">Continue Shopping</span>
            </button>
        </motion.div>

        {cartCount === 0 ? (
          <motion.div 
            className="text-center py-20 border-t border-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xl text-gray-500">Your cart is currently empty.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 border-t border-gray-800 pt-8">
            {/* Cart Items */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
              {cartItems.map(item => (
                <motion.div 
                  key={item.cartItemId} 
                  className="flex items-start space-x-6 pb-6 border-b border-gray-800 last:border-b-0"
                  variants={itemVariants}
                  layout
                >
                  <div className="w-24 h-32 flex-shrink-0 bg-black">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between h-32">
                      <div>
                        <h3 className="text-lg text-gray-200 tracking-wide font-serif">{item.name}</h3>
                        <p className="text-sm text-gray-400">Size: {item.size}</p>
                        <p className="text-md text-brand-gold mt-1">₹{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center border border-gray-700 w-fit">
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="p-2 text-gray-400 hover:bg-gray-800 transition"><MinusIcon /></motion.button>
                          <span className="px-4 text-md">{item.quantity}</span>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="p-2 text-gray-400 hover:bg-gray-800 transition"><PlusIcon/></motion.button>
                      </div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-32">
                    <p className="text-lg font-medium text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <motion.button whileHover={{scale: 1.1, color: '#ef4444'}} onClick={() => removeFromCart(item.cartItemId)} className="text-gray-500 transition" aria-label={`Remove ${item.name}`}>
                      <TrashIcon />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </motion.div>

            {/* Order Summary & Form */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            >
                <div className="bg-black p-8 sticky top-32">
                    <h2 className="text-2xl font-serif font-thin text-white border-b border-gray-700 pb-4">Order Summary</h2>
                    <div className="space-y-4 mt-6">
                        <div className="flex justify-between text-gray-300">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-gray-300">
                            <span>Shipping</span>
                            <span className="text-green-500">FREE</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-white border-t border-gray-700 pt-4 mt-4">
                            <span>Total</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-serif font-thin text-white border-b border-gray-700 pb-4">Your Details</h2>
                        <div className="mt-6 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className={`block w-full px-4 py-3 bg-brand-dark border rounded-sm focus:ring-brand-gold focus:border-brand-gold transition ${errors.name ? 'border-red-500' : 'border-gray-700'}`} />
                                {errors.name && <p className="text-red-500 text-xs mt-1">Name is required.</p>}
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-2">Full Address</label>
                                <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required className={`block w-full px-4 py-3 bg-brand-dark border rounded-sm focus:ring-brand-gold focus:border-brand-gold transition ${errors.address ? 'border-red-500' : 'border-gray-700'}`} />
                                {errors.address && <p className="text-red-500 text-xs mt-1">Address is required.</p>}
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required className={`block w-full px-4 py-3 bg-brand-dark border rounded-sm focus:ring-brand-gold focus:border-brand-gold transition ${errors.phone ? 'border-red-500' : 'border-gray-700'}`} />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">Phone number is required.</p>}
                            </div>
                        </div>
                    </div>

                    <motion.button 
                      onClick={handleConfirmOnWhatsApp}
                      className="mt-8 w-full bg-[#25D366] text-white py-4 px-10 tracking-widest text-sm font-bold uppercase flex items-center justify-center space-x-3"
                      whileHover={{ scale: 1.05, backgroundColor: '#1EBE57' }}
                      whileTap={{ scale: 0.95 }}
                    >
                        <WhatsappIcon />
                        <span>CONFIRM ON WHATSAPP</span>
                    </motion.button>
                </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
