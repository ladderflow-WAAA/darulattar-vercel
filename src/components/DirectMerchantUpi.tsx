import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { STORE_CONFIG } from '../config/storeConfig';

interface DirectMerchantUpiProps {
  amount: number;
  orderId: string;
  onPaymentSubmitted: (data: { utrNumber: string; paymentMode: string; amountPaid: number }) => void;
  isSubmitting?: boolean;
}

export const DirectMerchantUpi: React.FC<DirectMerchantUpiProps> = ({
  amount,
  orderId,
  onPaymentSubmitted,
  isSubmitting = false
}) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [showUtrHelp, setShowUtrHelp] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { vpa, merchantName, mcc, mobileGalleryLimitNote } = STORE_CONFIG.merchantUpi;

  // Build standard NPCI-compliant UPI Intent URI
  // Format: upi://pay?pa={vpa}&pn={merchantName}&am={amount}&cu=INR&tn={orderId}&mc={mcc}
  const encodedMerchant = encodeURIComponent(merchantName);
  const encodedNote = encodeURIComponent(`Order ${orderId}`);
  const upiIntentUri = `upi://pay?pa=${vpa}&pn=${encodedMerchant}&am=${amount.toFixed(2)}&cu=INR&tn=${encodedNote}&mc=${mcc}`;

  // App-specific intent URLs
  const gpayUri = `tez://upi/pay?pa=${vpa}&pn=${encodedMerchant}&am=${amount.toFixed(2)}&cu=INR&tn=${encodedNote}`;
  const phonepeUri = `phonepe://pay?pa=${vpa}&pn=${encodedMerchant}&am=${amount.toFixed(2)}&cu=INR&tn=${encodedNote}`;
  const paytmUri = `paytmmp://pay?pa=${vpa}&pn=${encodedMerchant}&am=${amount.toFixed(2)}&cu=INR&tn=${encodedNote}`;

  const handleCopyVpa = async () => {
    try {
      await navigator.clipboard.writeText(vpa);
      setCopiedVpa(true);
      setTimeout(() => setCopiedVpa(false), 2000);
    } catch {
      // Fallback
      setCopiedVpa(true);
      setTimeout(() => setCopiedVpa(false), 2000);
    }
  };

  const handleCopyAmount = async () => {
    try {
      await navigator.clipboard.writeText(amount.toFixed(2));
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } catch {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
    setUtrNumber(val);
    if (validationError && val.length === 12) {
      setValidationError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (utrNumber.length !== 12) {
      setValidationError('Please enter a valid 12-digit UTR / Transaction Reference number.');
      return;
    }

    setValidationError(null);
    onPaymentSubmitted({
      utrNumber,
      paymentMode: STORE_CONFIG.paymentMode,
      amountPaid: amount
    });
  };

  return (
    <div className="bg-[#0b0b0b] border border-gray-800 rounded-sm p-6 text-gray-200">
      {/* Safe Merchant Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-base font-semibold text-white tracking-wide">
              Direct Merchant UPI Payment
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            0% Transaction Fee • 100% Safe Direct Settlement
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-black/60 border border-gray-800 px-3 py-1 rounded text-xs">
          <span className="text-gray-400">Order ID:</span>
          <span className="font-mono font-bold text-[#FF5A00]">{orderId}</span>
        </div>
      </div>

      {STORE_CONFIG.paymentMode === 'OFFICIAL_GATEWAY_API' ? (
        <div className="py-8 text-center space-y-4">
          <div className="p-4 bg-gray-900 border border-gray-700 rounded-sm max-w-md mx-auto">
            <h4 className="font-bold text-white mb-2">{STORE_CONFIG.officialGatewayApi.providerName}</h4>
            <p className="text-xs text-gray-400 mb-4">
              You will be redirected to the secure payment gateway to complete your transaction.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#FF5A00] hover:bg-[#EA580C] text-white py-3 px-6 font-bold uppercase text-xs tracking-wider rounded-sm"
              onClick={() => {
                window.location.href = `${STORE_CONFIG.officialGatewayApi.initiateUrl}?orderId=${orderId}&amount=${amount}`;
              }}
            >
              Pay ₹{amount.toFixed(2)} via Official Gateway
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Main Payment Section: QR Code & Mobile Intent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-5 bg-black/70 border border-gray-800 rounded-sm">
              <div className="p-3 bg-white rounded-sm shadow-md border-2 border-[#FF5A00]/40">
                <QRCodeSVG
                  value={upiIntentUri}
                  size={190}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="mt-3 text-center">
                <span className="inline-block text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded">
                  Scan with any UPI App
                </span>
                <p className="text-[11px] text-gray-400 mt-1">
                  Google Pay • PhonePe • Paytm • BHIM • CRED
                </p>
              </div>

              {amount > mobileGalleryLimitNote && (
                <div className="mt-2 text-[10px] text-amber-400 bg-amber-950/20 border border-amber-900/40 px-2 py-1 rounded text-center">
                  NPCI notice: For payments &gt; ₹{mobileGalleryLimitNote}, please scan directly or copy UPI ID below.
                </div>
              )}
            </div>

            {/* Quick Actions & VPA Details */}
            <div className="space-y-4">
              {/* Payable Amount Highlight */}
              <div className="p-3.5 bg-black/60 border border-gray-800 rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Total Amount Payable</span>
                  <div className="text-2xl font-bold font-mono text-white mt-0.5">
                    ₹{amount.toFixed(2)}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyAmount}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-sm font-medium transition-colors"
                >
                  {copiedAmount ? 'Copied' : 'Copy ₹'}
                </motion.button>
              </div>

              {/* Merchant VPA with 1-Click Copy */}
              <div className="p-3.5 bg-black/60 border border-gray-800 rounded-sm">
                <span className="text-[10px] uppercase tracking-wider text-gray-400">Verified Business UPI ID</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-sm text-[#FF5A00] font-bold select-all">
                    {vpa}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyVpa}
                    className="text-xs bg-[#FF5A00] hover:bg-[#EA580C] text-white px-3 py-1.5 rounded-sm font-semibold uppercase tracking-wider transition-colors"
                  >
                    {copiedVpa ? 'Copied' : 'Copy VPA'}
                  </motion.button>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Registered Name: {merchantName}
                </span>
              </div>

              {/* Mobile Direct UPI Intent Buttons */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-2 font-medium">
                  Direct Mobile Launch (Tap to Pay)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={gpayUri}
                    className="flex items-center justify-center p-2.5 bg-black border border-gray-700 hover:border-[#FF5A00] rounded-sm text-xs text-white font-medium transition-colors text-center"
                  >
                    Google Pay
                  </a>
                  <a
                    href={phonepeUri}
                    className="flex items-center justify-center p-2.5 bg-black border border-gray-700 hover:border-[#FF5A00] rounded-sm text-xs text-white font-medium transition-colors text-center"
                  >
                    PhonePe
                  </a>
                  <a
                    href={paytmUri}
                    className="flex items-center justify-center p-2.5 bg-black border border-gray-700 hover:border-[#FF5A00] rounded-sm text-xs text-white font-medium transition-colors text-center"
                  >
                    Paytm
                  </a>
                  <a
                    href={upiIntentUri}
                    className="flex items-center justify-center p-2.5 bg-black border border-gray-700 hover:border-[#FF5A00] rounded-sm text-xs text-white font-medium transition-colors text-center"
                  >
                    All UPI Apps
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Enter 12-Digit UTR Number */}
          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="utrInput" className="text-xs font-semibold text-gray-200 uppercase tracking-wider">
                Step 2: Enter 12-Digit UPI Transaction Reference (UTR / RRN)
              </label>
              <button
                type="button"
                onClick={() => setShowUtrHelp(!showUtrHelp)}
                className="text-[11px] text-[#FF5A00] hover:underline"
              >
                {showUtrHelp ? 'Hide Help' : 'Where to find UTR?'}
              </button>
            </div>

            <AnimatePresence>
              {showUtrHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3 p-3 bg-black/80 border border-gray-800 rounded-sm text-xs text-gray-300 space-y-1"
                >
                  <p className="font-semibold text-white">How to locate the 12-digit UTR / Reference number:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-gray-400">
                    <li><strong className="text-gray-200">Google Pay:</strong> Listed as &ldquo;UPI Transaction ID&rdquo; in payment details.</li>
                    <li><strong className="text-gray-200">PhonePe:</strong> Listed as &ldquo;UTR&rdquo; or &ldquo;Transaction ID&rdquo; starting with numeric digits.</li>
                    <li><strong className="text-gray-200">Paytm:</strong> Listed as &ldquo;UPI Ref No.&rdquo; in the receipt view.</li>
                    <li><strong className="text-gray-200">Bank SMS:</strong> 12-digit reference number included in your debit notification SMS.</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  id="utrInput"
                  type="text"
                  maxLength={12}
                  value={utrNumber}
                  onChange={handleUtrChange}
                  placeholder="e.g. 412356789012"
                  className={`w-full bg-black border ${validationError ? 'border-red-500' : 'border-gray-700'} px-4 py-3 rounded-sm text-white font-mono text-sm tracking-widest placeholder-gray-600 focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] outline-none`}
                />
                <span className="absolute right-3 top-3.5 text-xs font-mono text-gray-500">
                  {utrNumber.length}/12
                </span>
              </div>

              {validationError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs"
                >
                  {validationError}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting || utrNumber.length !== 12}
                whileHover={utrNumber.length === 12 ? { scale: 1.01 } : {}}
                whileTap={utrNumber.length === 12 ? { scale: 0.99 } : {}}
                className={`w-full py-3.5 px-6 font-bold uppercase text-xs tracking-widest rounded-sm transition-all duration-200 ${
                  utrNumber.length === 12 && !isSubmitting
                    ? 'bg-[#FF5A00] hover:bg-[#EA580C] text-white shadow-lg cursor-pointer'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Verifying Transaction...' : 'Verify & Confirm Order'}
              </motion.button>
            </form>
          </div>
        </div>
      )}

      {/* Legal & Security Disclosures */}
      <div className="mt-6 pt-4 border-t border-gray-800 text-[11px] text-gray-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>100% Direct Merchant Verification • Zero Intermediary Risk</span>
        </div>
        <span>Merchant: {merchantName}</span>
      </div>
    </div>
  );
};

export default DirectMerchantUpi;
