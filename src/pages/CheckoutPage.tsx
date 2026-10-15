import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageState } from '../App';
import { useCart } from '../contexts/CartContext';
import { STORE_CONFIG } from '../config/storeConfig';
import { lookupDelhiveryPincode, PincodeLookupResult, calculateShipping } from '../utils/delhiveryCalculator';
import DirectMerchantUpi from '../components/DirectMerchantUpi';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { WhatsappIcon } from '../components/icons/WhatsappIcon';
import { setMetadata } from '../utils/metadata';

interface CheckoutPageProps {
  navigate: (pageState: PageState) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();

  // Generated Order Reference ID
  const [orderId] = useState(() => `DAO-${Date.now().toString().slice(-6)}`);

  // Customer Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Shipping Selection
  const [shippingMode, setShippingMode] = useState<'standard' | 'express'>('standard');
  const [delhiveryResult, setDelhiveryResult] = useState<PincodeLookupResult | null>(null);

  // Active Checkout Step
  const [currentStep, setCurrentStep] = useState<'details' | 'payment'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMetadata(
      'Secure Checkout | Darul Attar and Oud',
      'Direct Merchant UPI checkout and Delhivery express shipping for authentic concentrated attar and oud oils.'
    );
  }, []);

  // Recalculate shipping based on subtotal
  const shippingCalculation = calculateShipping(cartTotal);
  const activeShippingFee = shippingMode === 'standard'
    ? shippingCalculation.standardFee
    : STORE_CONFIG.delhiveryLogistics.expressShippingFee;

  const totalPayable = cartTotal + activeShippingFee;

  // Auto-detect PIN code and lookup Delhivery serviceability
  const handlePincodeChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: cleaned }));

    if (formErrors.pincode) {
      setFormErrors(prev => ({ ...prev, pincode: '' }));
    }

    if (cleaned.length === 6) {
      const lookup = lookupDelhiveryPincode(cleaned);
      if (lookup) {
        setDelhiveryResult(lookup);
        setFormData(prev => ({
          ...prev,
          city: lookup.isLocalChennai ? 'Chennai' : prev.city,
          state: lookup.state
        }));
      }
    } else {
      setDelhiveryResult(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateDetails = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errors.phone = 'Valid 10-digit mobile number required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Street address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      errors.pincode = 'Valid 6-digit Indian PIN code required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDetails()) {
      return;
    }
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmitted = (data: { utrNumber: string; paymentMode: string; amountPaid: number }) => {
    setIsSubmitting(true);

    const orderDetails = {
      orderId,
      items: cartItems,
      subtotal: cartTotal,
      shippingFee: activeShippingFee,
      total: totalPayable,
      shippingSpeed: shippingMode === 'standard' ? 'Delhivery Standard' : 'Delhivery Express Air',
      estimatedDeliveryDate: shippingMode === 'standard'
        ? (delhiveryResult?.estimatedStandardDate || '3–5 Business Days')
        : (delhiveryResult?.estimatedExpressDate || '1–2 Business Days'),
      customer: formData,
      payment: {
        method: data.paymentMode,
        utrNumber: data.utrNumber,
        vpa: STORE_CONFIG.merchantUpi.vpa,
        status: 'VERIFICATION_PENDING'
      },
      createdAt: new Date().toISOString()
    };

    // Save to local storage for user order history
    try {
      const existing = JSON.parse(localStorage.getItem('darulattar_orders') || '[]');
      existing.unshift(orderDetails);
      localStorage.setItem('darulattar_orders', JSON.stringify(existing.slice(0, 20)));
    } catch {}

    clearCart();

    setTimeout(() => {
      setIsSubmitting(false);
      navigate({
        name: 'orderConfirmation',
        props: { orderDetails }
      });
    }, 600);
  };

  // WhatsApp Instant Order Fallback
  const handleConfirmOnWhatsApp = () => {
    if (!validateDetails()) {
      return;
    }

    const itemsSummary = cartItems.map(item =>
      `• ${item.quantity}x ${item.name} (${item.size}) - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = [
      `*NEW ORDER - DARUL ATTAR AND OUD*`,
      `Order Ref: ${orderId}`,
      `--------------------------------`,
      `*Customer Details:*`,
      `Name: ${formData.fullName}`,
      `Phone: ${formData.phone}`,
      `Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      `--------------------------------`,
      `*Logistics Partner: Delhivery Courier*`,
      `Shipping Speed: ${shippingMode === 'standard' ? 'Standard Delivery' : 'Express Air Delivery'}`,
      `Delivery Estimate: ${shippingMode === 'standard' ? (delhiveryResult?.estimatedStandardDate || '3-5 Days') : (delhiveryResult?.estimatedExpressDate || '1-2 Days')}`,
      `--------------------------------`,
      `*Items:*`,
      itemsSummary,
      `--------------------------------`,
      `Subtotal: ₹${cartTotal.toFixed(2)}`,
      `Shipping: ₹${activeShippingFee.toFixed(2)}`,
      `*Total Payable: ₹${totalPayable.toFixed(2)}*`,
      `Merchant UPI ID: ${STORE_CONFIG.merchantUpi.vpa}`,
      `--------------------------------`,
      `Please confirm order dispatch.`
    ].join('\n');

    const whatsappUrl = `https://wa.me/${STORE_CONFIG.storeWhatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (cartCount === 0) {
    return (
      <div className="bg-brand-dark min-h-screen pt-36 pb-24 text-center px-4">
        <div className="max-w-md mx-auto bg-[#0a0a0a] border border-gray-800 p-8 rounded-sm">
          <h2 className="text-3xl font-serif text-white mb-3">Your Bag is Empty</h2>
          <p className="text-gray-400 text-sm mb-6">
            Explore our handcrafted oud and attar oils before checking out.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
            className="bg-[#FF5A00] hover:bg-[#EA580C] text-white py-3 px-8 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
          >
            Explore Collection
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-dark min-h-screen pt-28 pb-24 font-sans text-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-gray-800 mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#FF5A00] font-semibold uppercase tracking-wider mb-1">
              <span>Step {currentStep === 'details' ? '1 of 2' : '2 of 2'}</span>
              <span>•</span>
              <span>{currentStep === 'details' ? 'Delivery & Logistics' : 'Direct Merchant UPI'}</span>
            </div>
            <h1 className="text-3xl font-serif text-white tracking-wide">
              Secure <span className="italic text-[#FF5A00]">Checkout</span>
            </h1>
          </div>

          <button
            onClick={() => {
              if (currentStep === 'payment') {
                setCurrentStep('details');
              } else {
                navigate({ name: 'cart' });
              }
            }}
            className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            <ArrowLeftIcon />
            <span>{currentStep === 'payment' ? 'Back to Delivery Details' : 'Back to Cart'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Flow: Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 'details' ? (
                <motion.div
                  key="details-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Delivery Address Form */}
                  <div className="bg-[#0b0b0b] border border-gray-800 p-6 rounded-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-white pb-3 border-b border-gray-800 mb-4">
                      1. Customer & Delivery Address
                    </h2>

                    <form onSubmit={handleProceedToPayment} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="e.g. Tariq Ahmed"
                            className={`w-full bg-black border ${formErrors.fullName ? 'border-red-500' : 'border-gray-700'} px-3 py-2.5 rounded-sm text-sm text-white focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] outline-none`}
                          />
                          {formErrors.fullName && (
                            <p className="text-red-400 text-xs mt-1">{formErrors.fullName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                            Mobile Phone *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            maxLength={10}
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                            placeholder="10-digit mobile number"
                            className={`w-full bg-black border ${formErrors.phone ? 'border-red-500' : 'border-gray-700'} px-3 py-2.5 rounded-sm text-sm text-white font-mono focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] outline-none`}
                          />
                          {formErrors.phone && (
                            <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="For dispatch tracking updates"
                          className="w-full bg-black border border-gray-700 px-3 py-2.5 rounded-sm text-sm text-white focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                          Complete Street Address *
                        </label>
                        <textarea
                          name="address"
                          rows={2}
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="House/Flat No., Building, Street Name, Landmark"
                          className={`w-full bg-black border ${formErrors.address ? 'border-red-500' : 'border-gray-700'} px-3 py-2.5 rounded-sm text-sm text-white focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] outline-none`}
                        />
                        {formErrors.address && (
                          <p className="text-red-400 text-xs mt-1">{formErrors.address}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                            PIN Code *
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            maxLength={6}
                            value={formData.pincode}
                            onChange={(e) => handlePincodeChange(e.target.value)}
                            placeholder="6-digit PIN"
                            className={`w-full bg-black border ${formErrors.pincode ? 'border-red-500' : 'border-gray-700'} px-3 py-2.5 rounded-sm text-sm text-white font-mono focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] outline-none`}
                          />
                          {formErrors.pincode && (
                            <p className="text-red-400 text-xs mt-1">{formErrors.pincode}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                            City / District *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className={`w-full bg-black border ${formErrors.city ? 'border-red-500' : 'border-gray-700'} px-3 py-2.5 rounded-sm text-sm text-white focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] outline-none`}
                          />
                          {formErrors.city && (
                            <p className="text-red-400 text-xs mt-1">{formErrors.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="State"
                            className="w-full bg-black border border-gray-700 px-3 py-2.5 rounded-sm text-sm text-white focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] outline-none"
                          />
                        </div>
                      </div>

                      {/* Delhivery Validation Feedback */}
                      {delhiveryResult && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-sm text-xs text-emerald-300 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span>
                              Delhivery Serviceable: {delhiveryResult.region} ({delhiveryResult.courierMode})
                            </span>
                          </div>
                          <span className="font-semibold text-white">
                            Standard ETA: {delhiveryResult.estimatedStandardDate}
                          </span>
                        </motion.div>
                      )}
                    </form>
                  </div>

                  {/* Delhivery Shipping Selector */}
                  <div className="bg-[#0b0b0b] border border-gray-800 p-6 rounded-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                        2. Choose Delhivery Shipping Speed
                      </h2>
                      <span className="text-xs text-gray-400">Official Logistics</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Standard Option */}
                      <div
                        onClick={() => setShippingMode('standard')}
                        className={`p-4 border rounded-sm cursor-pointer transition-all ${
                          shippingMode === 'standard'
                            ? 'border-[#FF5A00] bg-black/80'
                            : 'border-gray-800 bg-black/40 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                shippingMode === 'standard' ? 'border-[#FF5A00]' : 'border-gray-600'
                              }`}>
                                {shippingMode === 'standard' && (
                                  <span className="w-2 h-2 rounded-full bg-[#FF5A00]"></span>
                                )}
                              </span>
                              <span className="font-semibold text-white text-sm">Delhivery Standard</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              {delhiveryResult
                                ? `Estimated Delivery: ${delhiveryResult.estimatedStandardDate} (${delhiveryResult.standardDays})`
                                : `Transit: ${STORE_CONFIG.delhiveryLogistics.standardDays}`}
                            </p>
                          </div>
                          <div className="font-mono text-sm font-bold">
                            {shippingCalculation.isFreeShippingEligible ? (
                              <span className="text-emerald-400 font-bold">FREE</span>
                            ) : (
                              `₹${STORE_CONFIG.delhiveryLogistics.standardShippingFee}`
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Express Option */}
                      <div
                        onClick={() => setShippingMode('express')}
                        className={`p-4 border rounded-sm cursor-pointer transition-all ${
                          shippingMode === 'express'
                            ? 'border-[#FF5A00] bg-black/80'
                            : 'border-gray-800 bg-black/40 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                shippingMode === 'express' ? 'border-[#FF5A00]' : 'border-gray-600'
                              }`}>
                                {shippingMode === 'express' && (
                                  <span className="w-2 h-2 rounded-full bg-[#FF5A00]"></span>
                                )}
                              </span>
                              <span className="font-semibold text-white text-sm">Delhivery Express Air</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              {delhiveryResult
                                ? `Estimated Delivery: ${delhiveryResult.estimatedExpressDate} (${delhiveryResult.expressDays})`
                                : `Priority Transit: ${STORE_CONFIG.delhiveryLogistics.expressDays}`}
                            </p>
                          </div>
                          <div className="font-mono text-sm font-bold text-white">
                            ₹{STORE_CONFIG.delhiveryLogistics.expressShippingFee}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleProceedToPayment}
                        className="flex-1 bg-[#FF5A00] hover:bg-[#EA580C] text-white py-3.5 px-6 font-bold uppercase text-xs tracking-widest rounded-sm transition-colors"
                      >
                        Proceed to Payment — ₹{totalPayable.toFixed(2)}
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleConfirmOnWhatsApp}
                        className="bg-[#25D366] hover:bg-[#20bd4d] text-white py-3.5 px-6 font-bold uppercase text-xs tracking-wider rounded-sm flex items-center justify-center space-x-2 transition-colors"
                      >
                        <WhatsappIcon />
                        <span>Order via WhatsApp</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="payment-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <DirectMerchantUpi
                    amount={totalPayable}
                    orderId={orderId}
                    onPaymentSubmitted={handlePaymentSubmitted}
                    isSubmitting={isSubmitting}
                  />

                  {/* Fallback WhatsApp and Call Support */}
                  <div className="bg-[#0b0b0b] border border-gray-800 p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-gray-400">
                      Need direct confirmation or paying cash on store pickup?
                    </span>
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <a
                        href={`tel:${STORE_CONFIG.storePhone}`}
                        className="text-white hover:text-[#FF5A00] font-mono font-bold underline"
                      >
                        Call: {STORE_CONFIG.storePhone}
                      </a>
                      <span className="text-gray-600">•</span>
                      <button
                        onClick={handleConfirmOnWhatsApp}
                        className="text-[#25D366] font-semibold flex items-center space-x-1.5 hover:underline"
                      >
                        <WhatsappIcon />
                        <span>WhatsApp Text</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary: Right Column */}
          <div className="lg:col-span-5">
            <div className="bg-[#0b0b0b] border border-gray-800 p-6 rounded-sm sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Order Summary
                </h3>
                <span className="text-xs text-gray-400 font-mono">({cartCount} items)</span>
              </div>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center justify-between py-2 border-b border-gray-900 text-xs"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-12 h-14 bg-black border border-gray-800 rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif text-white truncate text-sm">{item.name}</p>
                        <p className="text-gray-400 text-[11px]">Size: {item.size} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-mono text-sm text-gray-200 pl-3">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-white">₹{cartTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Delhivery Courier Shipping</span>
                  <span className="font-mono">
                    {activeShippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `₹${activeShippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                {activeShippingFee === 0 && (
                  <div className="text-[11px] text-emerald-400 bg-emerald-950/20 px-2 py-1 rounded border border-emerald-900/40">
                    Free shipping unlocked on orders over ₹{STORE_CONFIG.delhiveryLogistics.freeShippingThreshold}
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-white border-t border-gray-800 pt-3">
                  <span>Total Payable</span>
                  <span className="font-mono text-[#FF5A00]">₹{totalPayable.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Guarantee Badges */}
              <div className="pt-4 border-t border-gray-800 space-y-2 text-[11px] text-gray-400">
                <div className="flex items-center space-x-2">
                  <svg className="w-3.5 h-3.5 text-[#FF5A00] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% Pure Alcohol-Free Concentrated Oil</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-3.5 h-3.5 text-[#FF5A00] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <span>Dispatched via Delhivery with tracking updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-3.5 h-3.5 text-[#FF5A00] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Direct Merchant Settlement • Official VPA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;