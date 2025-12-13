import React, { useState, useEffect } from 'react';
import { PageState } from '../App';
import { useCart } from '../contexts/CartContext';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { MinusIcon } from '../components/icons/MinusIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { WhatsappIcon } from '../components/icons/WhatsappIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { setMetadata } from '../utils/metadata';

interface CartPageProps {
  navigate: (pageState: PageState) => void;
}

const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
  const [errors, setErrors] = useState({ name: false, address: false, phone: false });

  useEffect(() => {
    setMetadata('Shopping Bag | Darul Attar Chennai', 'Review your selection of authentic oud and attar oils before finalizing your order via WhatsApp.');
  }, []);

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
          `• ${item.quantity} x ${item.name} (${item.size}) - ₹${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');

      const messageParts = [
        '👋 *New Order Request - Darul Attar*',
        '-----------------------------',
        '*Customer Details:*',
        `📝 Name: ${formData.name}`,
        `📍 Address: ${formData.address}`,
        `📞 Phone: ${formData.phone}`,
        '-----------------------------',
        '*Order Summary:*',
        itemsSummary,
        '-----------------------------',
        `*Total Payable: ₹${cartTotal.toFixed(2)}*`,
        '-----------------------------',
        'Please confirm availability and payment details.'
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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-brand-dark min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-24 font-sans">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between sm:items-center mb-12 border-b border-gray-800 pb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl md:text-4xl font-thin text-white font-serif">Shopping Bag <span className="text-lg text-gray-500 font-sans ml-2">({cartCount} Items)</span></h1>
            <button onClick={() => navigate({ name: 'home', props: {section: 'collection'} })} className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm text-brand-gold hover:text-white group transition-colors">
              <ArrowLeftIcon />
              <span className="group-hover:underline">Continue Browsing</span>
            </button>
        </motion.div>

        {cartCount === 0 ? (
          <motion.div 
            className="text-center py-32 bg-gray-900/10 rounded-sm border border-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-gray-400 mb-6">Your bag is currently empty.</p>
            <button 
                onClick={() => navigate({ name: 'home', props: {section: 'collection'} })}
                className="bg-brand-gold text-brand-dark py-3 px-8 font-bold text-sm tracking-widest uppercase hover:bg-white transition-colors"
            >
                Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
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
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-[#0a0a0a] border border-gray-800 rounded-sm hover:border-gray-700 transition-colors"
                  variants={itemVariants}
                  layout
                >
                  <div className="w-20 h-24 flex-shrink-0 bg-black overflow-hidden rounded-sm border border-gray-800">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg text-gray-200 font-serif tracking-wide truncate">{item.name}</h3>
                            <p className="text-sm text-brand-gold mt-1">Size: {item.size}</p>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.1, color: '#ef4444' }} 
                            onClick={() => removeFromCart(item.cartItemId)} 
                            className="text-gray-600 transition p-1"
                            aria-label={`Remove ${item.name}`}
                        >
                            <TrashIcon />
                        </motion.button>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-gray-700 rounded-sm bg-black">
                            <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="p-2 text-gray-400 hover:text-white transition"><MinusIcon /></button>
                            <span className="px-3 text-sm font-medium text-white w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="p-2 text-gray-400 hover:text-white transition"><PlusIcon/></button>
                        </div>
                        <p className="text-lg font-medium text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </motion.div>

            {/* Order Summary & Form */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-sm sticky top-32">
                    <h2 className="text-xl font-serif text-white border-b border-gray-800 pb-4 mb-6">Order Summary</h2>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-400">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-gray-400">
                            <span>Shipping</span>
                            <span className="text-brand-gold font-medium">FREE</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-white border-t border-gray-800 pt-4 mt-2">
                            <span>Total</span>
                            <span className="text-brand-gold">₹{cartTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Delivery Details</h3>
                        <div className="space-y-4">
                            <div>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className={`w-full bg-black border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-sm px-4 py-3 text-sm text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition`} />
                            </div>
                            <div>
                                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Delivery Address (Chennai?)" className={`w-full bg-black border ${errors.address ? 'border-red-500' : 'border-gray-700'} rounded-sm px-4 py-3 text-sm text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition`} />
                            </div>
                            <div>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className={`w-full bg-black border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-sm px-4 py-3 text-sm text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition`} />
                            </div>
                        </div>
                    </div>

                    <motion.button 
                      onClick={handleConfirmOnWhatsApp}
                      className="mt-8 w-full bg-[#25D366] text-white py-4 px-6 tracking-widest text-xs font-bold uppercase rounded-sm flex items-center justify-center space-x-2 shadow-lg hover:bg-[#20bd4d] transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                        <WhatsappIcon />
                        <span>Confirm Order on WhatsApp</span>
                    </motion.button>
                    
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-600">Secure checkout. Pay via UPI/Cash after confirmation.</p>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;