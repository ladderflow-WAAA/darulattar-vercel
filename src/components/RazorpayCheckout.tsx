import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STORE_CONFIG } from '../config/storeConfig';
import { RazorpayOptions, RazorpayPaymentResponse } from '../types/razorpay';

interface CustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface RazorpayCheckoutProps {
  amount: number; // in INR
  orderId: string; // Internal Order Reference
  customerInfo: CustomerDetails;
  onPaymentSuccess: (data: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
    amountPaid: number;
  }) => void | Promise<void>;
  isSubmitting?: boolean;
}

export const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  amount,
  orderId,
  customerInfo,
  onPaymentSuccess,
  isSubmitting = false
}) => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);

  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TrpSiYzVN2p9l7';

  // Ensure Razorpay SDK script is ready
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInitiatePayment = async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error('Unable to load Razorpay Checkout SDK. Please check your network connection.');
      }

      // Convert amount in INR to Paise (minimum 100 paise)
      const amountInPaise = Math.round(amount * 100);
      if (amountInPaise < 100) {
        throw new Error('Order amount must be at least ₹1.00');
      }

      // 2. Call backend /api/create-order
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: orderId,
          notes: {
            customer_name: customerInfo.fullName,
            customer_phone: customerInfo.phone,
            internal_order_id: orderId
          }
        })
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.order_id) {
        throw new Error(orderData.error || `Server returned error (${orderResponse.status}) while creating order.`);
      }

      // 3. Configure Razorpay modal options
      const options: RazorpayOptions = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: STORE_CONFIG.storeName,
        description: `Order ${orderId} • ${STORE_CONFIG.storeSubtitle}`,
        image: 'https://res.cloudinary.com/dy3jvbisa/image/upload/v1762524075/Generated_Image_October_07_2025_-_4_20PM_tvrnif.svg',
        order_id: orderData.order_id,
        prefill: {
          name: customerInfo.fullName,
          email: customerInfo.email || '',
          contact: customerInfo.phone
        },
        theme: {
          color: '#8C6D47'
        },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            setLoading(false);
            setErrorMessage('Payment cancelled by user. You can re-open checkout anytime.');
          }
        },
        handler: async (response: RazorpayPaymentResponse) => {
          setLoading(false);
          setVerifying(true);
          setLastPaymentId(response.razorpay_payment_id);

          try {
            // 4. Call backend /api/verify-payment
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }

            // 5. Verified payment callback
            await onPaymentSuccess({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              amountPaid: amount
            });
          } catch (verifyErr: any) {
            console.error('Signature verification error:', verifyErr);
            setErrorMessage(verifyErr.message || 'Payment signature could not be verified. Do not retry if amount was deducted.');
          } finally {
            setVerifying(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);

      // Listen for payment failure events
      razorpayInstance.on('payment.failed', (failureResponse: any) => {
        setLoading(false);
        const errDetail = failureResponse?.error?.description || failureResponse?.error?.reason || 'Payment failed.';
        setErrorMessage(`Transaction not completed: ${errDetail}`);
      });

      // Open Razorpay Checkout modal
      razorpayInstance.open();
    } catch (err: any) {
      console.error('Razorpay checkout error:', err);
      setErrorMessage(err.message || 'Failed to initiate payment.');
      setLoading(false);
    }
  };

  const isBusy = loading || verifying || isSubmitting;

  return (
    <div className="bg-[#FAF8F5] border border-gray-200 rounded-sm p-6 text-gray-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-base font-semibold text-gray-900 tracking-wide">
              Razorpay Standard Checkout
            </h3>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Instant 256-Bit SSL Encrypted Payment Gateway
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#8C6D47]/10 text-[#8C6D47] rounded font-bold border border-[#8C6D47]/20">
            Official Gateway
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold border border-emerald-200">
            Instant Dispatch
          </span>
        </div>
      </div>

      {/* Accepted Payment Modes Badges */}
      <div className="bg-white border border-gray-200 p-4 rounded-sm space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">
          All Payment Modes Accepted:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-sm flex flex-col items-center justify-center text-center">
            <span className="font-bold text-gray-900">UPI Instant</span>
            <span className="text-[10px] text-gray-500">GPay, PhonePe, Paytm</span>
          </div>
          <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-sm flex flex-col items-center justify-center text-center">
            <span className="font-bold text-gray-900">Debit / Credit</span>
            <span className="text-[10px] text-gray-500">Visa, Mastercard, RuPay</span>
          </div>
          <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-sm flex flex-col items-center justify-center text-center">
            <span className="font-bold text-gray-900">NetBanking</span>
            <span className="text-[10px] text-gray-500">50+ Major Indian Banks</span>
          </div>
          <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-sm flex flex-col items-center justify-center text-center">
            <span className="font-bold text-gray-900">Wallets</span>
            <span className="text-[10px] text-gray-500">Mobikwik, Freecharge</span>
          </div>
        </div>
      </div>

      {/* Amount and Order Summary Box */}
      <div className="p-4 bg-white border border-gray-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs text-gray-500 block uppercase tracking-wider">Total Payable</span>
          <div className="text-2xl font-mono font-bold text-gray-900 mt-0.5">
            ₹{amount.toFixed(2)}
          </div>
          <span className="text-[11px] text-gray-500 font-mono">Ref ID: {orderId}</span>
        </div>
        <div className="text-xs text-gray-600 sm:text-right">
          <div className="font-semibold text-gray-900">{customerInfo.fullName}</div>
          <div>+91 {customerInfo.phone}</div>
          <div className="text-[11px] text-gray-500">{customerInfo.city}, {customerInfo.state}</div>
        </div>
      </div>

      {/* Error / Alert Display */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 bg-red-50 border border-red-200 rounded-sm text-xs text-red-800 flex items-start justify-between gap-2"
          >
            <div className="space-y-1">
              <span className="font-bold block">Payment Notice:</span>
              <p>{errorMessage}</p>
              {lastPaymentId && (
                <p className="font-mono text-[10px] text-red-600">Payment ID: {lastPaymentId}</p>
              )}
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-800 font-bold text-sm px-1"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Action Button */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: isBusy ? 1 : 1.01 }}
          whileTap={{ scale: isBusy ? 1 : 0.99 }}
          onClick={handleInitiatePayment}
          disabled={isBusy}
          className={`w-full py-4 px-6 text-sm font-bold uppercase tracking-widest rounded-sm transition-all flex items-center justify-center space-x-2 shadow-sm ${
            isBusy
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-[#8C6D47] hover:bg-[#725736] text-white'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Opening Razorpay Modal...</span>
            </>
          ) : verifying ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Verifying Payment Signature...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Pay with Razorpay — ₹{amount.toFixed(2)}</span>
            </>
          )}
        </motion.button>

        <div className="flex items-center justify-center space-x-2 text-[11px] text-gray-500">
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>100% Encrypted &amp; PCI-DSS Level 1 Compliant via Razorpay</span>
        </div>
      </div>
    </div>
  );
};

export default RazorpayCheckout;
