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
import { saveOrder } from '../utils/orderService';

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

    const orderRef = `DAO-WA-${Date.now().toString().slice(-6)}`;
    const shippingFee = shipping.isFreeShippingEligible ? 0 : shipping.standardFee;
    const finalTotal = cartTotal + shippingFee;

    saveOrder({
      orderId: orderRef,
      customer: {
        fullName: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: ''
      },
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl
      })),
      subtotal: cartTotal,
      shippingFee,
      total: finalTotal,
      shippingSpeed: 'Delhivery Standard',
      payment: {
        method: 'WHATSAPP_CHECKOUT',
        vpa: STORE_CONFIG.merchantUpi.vpa,
        status: 'WHATSAPP_ENQUIRY'
      },
      createdAt: new Date().toISOString()
    });

    const itemsSummary = cartItems.map(item =>
      `• ${item.quantity}x ${item.name} (${item.size}) - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const messageParts = [
      `*ORDER REQUEST - DARUL ATTAR*`,
      `Order Ref: ${orderRef}`,
      `---------------------------------`,
      `*Customer Details:*`,
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      `Address: ${formData.address}`,
      `---------------------------------`,
      `*Items:*`,
      itemsSummary,
      `---------------------------------`,
      `Subtotal: ₹${cartTotal.toFixed(2)}`,
      `Shipping: ${shipping.isFreeShippingEligible ? 'FREE' : `₹${shippingFee.toFixed(2)}`}`,
      `*Estimated Total: ₹${finalTotal.toFixed(2)}*`,
      `---------------------------------`,
      `Please confirm stock and provide payment instructions.`
    ];

    const encoded = encodeURIComponent(messageParts.join('\n'));
    window.open(`https://wa.me/${STORE_CONFIG.storeWhatsappNumber}?text=${encoded}`, '_blank');
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans pt-28 pb-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header Navigation */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-brand-charcoal font-normal">
              Your Fragrance <span className="font-editorial italic text-brand-gold-dark font-normal">Bag</span>
            </h1>
            <p className="text-xs font-mono text-gray-500 mt-1">
              Dispatched with official Delhivery courier tracking across India.
            </p>
          </div>

          <button
            onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
            className="mt-4 sm:mt-0 flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-gray-600 hover:text-black transition-colors font-semibold"
          >
            <ArrowLeftIcon />
            <span>Continue Exploring Blends</span>
          </button>
        </motion.div>

        {cartCount === 0 ? (
          <motion.div
            className="text-center py-24 bg-brand-ivory rounded-2xl border border-gray-200/80 max-w-xl mx-auto p-8 shadow-xs"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-2xl text-brand-charcoal font-serif mb-2 font-normal">Your Bag is Empty</p>
            <p className="text-sm text-gray-600 mb-6 font-sans">
              Discover authentic alcohol-free Oud oils, Kannauj distillations, and French floral extracts.
            </p>
            <button
              onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
              className="bg-brand-charcoal hover:bg-brand-gold-dark text-white py-3.5 px-8 font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 rounded-full shadow-elevation-1"
            >
              Explore Fragrances
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
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
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-brand-ivory border border-gray-200/80 rounded-xl hover:border-gray-300 transition-colors shadow-2xs"
                    variants={itemVariants}
                    layout
                  >
                    <div className="w-20 h-24 flex-shrink-0 bg-white overflow-hidden rounded-lg border border-gray-200/70">
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
                          <h3 className="text-base text-brand-charcoal font-serif font-normal tracking-wide truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs font-mono text-brand-gold-dark font-medium mt-0.5">
                            Volume: {item.size}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          aria-label={`Remove ${item.name}`}
                        >
                          <TrashIcon />
                        </motion.button>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-gray-200 rounded-full bg-white px-2 py-0.5 shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon />
                          </button>
                          <span className="px-3 text-xs font-mono font-bold text-gray-900 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon />
                          </button>
                        </div>
                        <p className="text-base font-mono font-semibold text-brand-charcoal">
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
              <div className="bg-brand-ivory border border-gray-200/90 p-6 sm:p-8 rounded-2xl sticky top-28 space-y-6 shadow-sm">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-charcoal border-b border-gray-200/80 pb-3">
                  Bag Summary
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-mono text-brand-charcoal font-bold">₹{cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delhivery Standard Shipping</span>
                    <span className="font-mono">
                      {shipping.isFreeShippingEligible ? (
                        <span className="text-emerald-700 font-bold">FREE</span>
                      ) : (
                        `₹${shipping.standardFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-semibold text-brand-charcoal border-t border-gray-200/80 pt-3">
                    <span>Estimated Total</span>
                    <span className="font-mono text-brand-charcoal font-bold text-lg">
                      ₹{(cartTotal + shipping.standardFee).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Primary CTA: Full Checkout */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate({ name: 'checkout' })}
                  className="w-full bg-brand-charcoal hover:bg-brand-gold-dark text-white py-4 px-6 tracking-[0.16em] text-xs font-semibold uppercase rounded-full shadow-elevation-1 transition-all duration-300 text-center flex items-center justify-center space-x-2"
                >
                  <span>Proceed to UPI Checkout</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>

                {/* Quick WhatsApp Form */}
                <div className="pt-4 border-t border-gray-200/80">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 block mb-3">
                    Or Direct WhatsApp Order
                  </span>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Full Name"
                      className={`w-full bg-white border ${errors.name ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:border-brand-gold-dark outline-none transition-colors`}
                    />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Delivery Address & Postal Code"
                      className={`w-full bg-white border ${errors.address ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:border-brand-gold-dark outline-none transition-colors`}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Contact Number"
                      className={`w-full bg-white border ${errors.phone ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:border-brand-gold-dark outline-none transition-colors`}
                    />

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmOnWhatsApp}
                      className="w-full bg-brand-gold-subtle hover:bg-brand-charcoal text-brand-charcoal hover:text-white border border-brand-gold/60 py-3.5 px-4 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 shadow-2xs"
                    >
                      <WhatsappIcon />
                      <span>Confirm Order via WhatsApp Desk</span>
                    </motion.button>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={clearCart}
                    className="text-[11px] font-mono text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider"
                  >
                    Clear Bag
                  </button>
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
