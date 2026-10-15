import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageState } from '../App';
import { useCart } from '../contexts/CartContext';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { MinusIcon } from '../components/icons/MinusIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { WhatsappIcon } from '../components/icons/WhatsappIcon';
import { DelhiveryShippingCalculator } from '../components/DelhiveryShippingCalculator';
import { STORE_CONFIG } from '../config/storeConfig';
import { calculateShipping } from '../utils/delhiveryCalculator';
import { setMetadata } from '../utils/metadata';

interface CartPageProps {
  navigate: (pageState: PageState) => void;
}

const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
  const [errors, setErrors] = useState({ name: false, address: false, phone: false });

  useEffect(() => {
    setMetadata(
      'Shopping Bag | Darul Attar and Oud',
      'Review your selected authentic oud and attar perfume oils with integrated Delhivery shipping estimator.'
    );
  }, []);

  const shipping = calculateShipping(cartTotal);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value) {
      setErrors(prev => ({ ...prev, [name]: false }));
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
      `• ${item.quantity}x ${item.name} (${item.size}) - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const messageParts = [
      `*ORDER REQUEST - DARUL ATTAR AND OUD*`,
      `---------------------------------`,
      `*Customer Details:*`,
      `Name: ${formData.name}`,
      `Address: ${formData.address}`,
      `Phone: ${formData.phone}`,
      `---------------------------------`,
      `*Logistics: Delhivery Courier*`,
      `---------------------------------`,
      `*Order Summary:*`,
      itemsSummary,
      `---------------------------------`,
      `Subtotal: ₹${cartTotal.toFixed(2)}`,
      `Shipping: ${shipping.isFreeShippingEligible ? 'FREE' : `₹${shipping.standardFee.toFixed(2)}`}`,
      `*Total Payable: ₹${(cartTotal + shipping.standardFee).toFixed(2)}*`,
      `Merchant UPI VPA: ${STORE_CONFIG.merchantUpi.vpa}`,
      `---------------------------------`,
      `Please confirm availability and dispatch.`
    ];

    const message = messageParts.join('\n');
    const whatsappUrl = `https://wa.me/${STORE_CONFIG.storeWhatsappNumber}?text=${encodeURIComponent(message)}`;

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
    <div className="bg-brand-dark min-h-screen text-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16 pt-32 pb-24 font-sans">
        <motion.div
          className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 border-b border-gray-800 pb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-thin text-white font-serif">
              Shopping Bag <span className="text-sm text-gray-500 font-sans font-normal ml-2">({cartCount} Items)</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Dispatched with official Delhivery courier tracking.
            </p>
          </div>

          <button
            onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
            className="mt-4 sm:mt-0 flex items-center space-x-2 text-xs uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon />
            <span>Continue Shopping</span>
          </button>
        </motion.div>

        {cartCount === 0 ? (
          <motion.div
            className="text-center py-28 bg-[#0a0a0a] rounded-sm border border-gray-800 max-w-xl mx-auto p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-gray-300 font-serif mb-2">Your Bag is Empty</p>
            <p className="text-sm text-gray-500 mb-6">
              Select your authentic oud, attar oils, and French perfume blends.
            </p>
            <button
              onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
              className="bg-[#FF5A00] hover:bg-[#EA580C] text-white py-3 px-8 font-bold text-xs tracking-widest uppercase transition-colors rounded-sm"
            >
              Explore Collection
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Cart Items List */}
            <motion.div
              className="lg:col-span-7 space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.cartItemId}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-[#0b0b0b] border border-gray-800 rounded-sm hover:border-gray-700 transition-colors"
                    variants={itemVariants}
                    layout
                  >
                    <div className="w-20 h-24 flex-shrink-0 bg-black overflow-hidden rounded-sm border border-gray-800">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow min-w-0 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base text-gray-100 font-serif tracking-wide truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-[#FF5A00] font-medium mt-0.5">
                            Size: {item.size}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, color: '#ef4444' }}
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-500 transition p-1"
                          aria-label={`Remove ${item.name}`}
                        >
                          <TrashIcon />
                        </motion.button>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-gray-700 rounded-sm bg-black">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1.5 text-gray-400 hover:text-white transition"
                          >
                            <MinusIcon />
                          </button>
                          <span className="px-3 text-xs font-mono font-medium text-white w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1.5 text-gray-400 hover:text-white transition"
                          >
                            <PlusIcon />
                          </button>
                        </div>
                        <p className="text-base font-mono font-bold text-white">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Delhivery Estimator in Bag */}
              <div className="pt-2">
                <DelhiveryShippingCalculator cartSubtotal={cartTotal} />
              </div>
            </motion.div>

            {/* Order Summary & Actions */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-[#0b0b0b] border border-gray-800 p-6 sm:p-8 rounded-sm sticky top-32 space-y-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-gray-800 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">₹{cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Delhivery Standard Shipping</span>
                    <span className="font-mono">
                      {shipping.isFreeShippingEligible ? (
                        <span className="text-emerald-400 font-bold">FREE</span>
                      ) : (
                        `₹${shipping.standardFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-white border-t border-gray-800 pt-3">
                    <span>Estimated Total</span>
                    <span className="font-mono text-[#FF5A00]">
                      ₹{(cartTotal + shipping.standardFee).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Primary CTA: Full Checkout */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate({ name: 'checkout' })}
                  className="w-full bg-[#FF5A00] hover:bg-[#EA580C] text-white py-4 px-6 tracking-widest text-xs font-bold uppercase rounded-sm shadow-xl transition-all text-center flex items-center justify-center space-x-2"
                >
                  <span>Proceed to UPI Checkout</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>

                {/* Quick WhatsApp Form Accordion */}
                <div className="pt-4 border-t border-gray-800">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-3">
                    Or Quick Order via WhatsApp
                  </span>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Full Name"
                      className={`w-full bg-black border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-sm px-3 py-2 text-xs text-white focus:border-[#FF5A00] outline-none`}
                    />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Delivery Address & PIN"
                      className={`w-full bg-black border ${errors.address ? 'border-red-500' : 'border-gray-700'} rounded-sm px-3 py-2 text-xs text-white focus:border-[#FF5A00] outline-none`}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className={`w-full bg-black border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-sm px-3 py-2 text-xs text-white focus:border-[#FF5A00] outline-none`}
                    />

                    <motion.button
                      onClick={handleConfirmOnWhatsApp}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-[#25D366] hover:bg-[#20bd4d] text-white py-3 px-4 tracking-wider text-xs font-bold uppercase rounded-sm flex items-center justify-center space-x-2 shadow-lg transition-all"
                    >
                      <WhatsappIcon />
                      <span>Confirm via WhatsApp</span>
                    </motion.button>
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] text-gray-500">
                  <span>Merchant VPA: {STORE_CONFIG.merchantUpi.vpa} • Official Darul Attar Store</span>
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