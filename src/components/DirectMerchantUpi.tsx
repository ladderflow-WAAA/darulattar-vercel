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

  // Standard NPCI-compliant UPI Intent URI
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

  const handleSubmitWithUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (utrNumber.length !== 12) {
      setValidationError('Please enter a valid 12-digit UTR / Reference number.');
      return;
    }

    setValidationError(null);
    onPaymentSubmitted({
      utrNumber,
      paymentMode: STORE_CONFIG.paymentMode,
      amountPaid: amount
    });
  };

  const handleQuickConfirm = () => {
    onPaymentSubmitted({
      utrNumber: utrNumber.trim() ? utrNumber.trim() : 'PAID_VIA_UPI_APP',
      paymentMode: STORE_CONFIG.paymentMode,
      amountPaid: amount
    });
  };

  return (
    <div className="bg-[#FAF8F5] border border-gray-200 rounded-sm p-6 text-gray-800 shadow-sm">
      {/* Safe Merchant Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-base font-semibold text-gray-900 tracking-wide">
              Direct Merchant UPI Payment
            </h3>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            0% Transaction Fee • Direct Official Settlement
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-white border border-gray-200 px-3 py-1 rounded text-xs shadow-sm">
          <span className="text-gray-500">Order ID:</span>
          <span className="font-mono font-bold text-[#8C6D47]">{orderId}</span>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Main Payment Section: QR Code & Mobile Intent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-5 bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="p-3 bg-white rounded-sm shadow-sm border border-[#C0A080]">
              <QRCodeSVG
                value={upiIntentUri}
                size={190}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="mt-3 text-center">
              <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Scan with any UPI App
              </span>
              <p className="text-[11px] text-gray-500 mt-1">
                Google Pay • PhonePe • Paytm • BHIM • CRED
              </p>
            </div>

            {amount > mobileGalleryLimitNote && (
              <div className="mt-2 text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded text-center">
                For payments &gt; ₹{mobileGalleryLimitNote}, please scan directly or copy UPI ID below.
              </div>
            )}
          </div>

          {/* Quick Actions & VPA Details */}
          <div className="space-y-4">
            {/* Payable Amount Highlight */}
            <div className="p-3.5 bg-white border border-gray-200 rounded-sm flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Total Amount Payable</span>
                <div className="text-2xl font-bold font-mono text-gray-900 mt-0.5">
                  ₹{amount.toFixed(2)}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyAmount}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-3 py-1.5 rounded-sm font-medium transition-colors"
              >
                {copiedAmount ? 'Copied' : 'Copy ₹'}
              </motion.button>
            </div>

            {/* Merchant VPA with 1-Click Copy */}
            <div className="p-3.5 bg-white border border-gray-200 rounded-sm shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Verified Business UPI ID</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-sm text-[#8C6D47] font-bold select-all">
                  {vpa}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyVpa}
                  className="text-xs bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded-sm font-semibold uppercase tracking-wider transition-colors"
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
              <span className="text-[10px] uppercase tracking-wider text-gray-600 block mb-2 font-semibold">
                Direct Mobile Launch (Tap to Pay)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={gpayUri}
                  className="flex items-center justify-center p-2.5 bg-white border border-gray-300 hover:border-black rounded-sm text-xs text-gray-900 font-semibold transition-colors text-center shadow-sm"
                >
                  Google Pay
                </a>
                <a
                  href={phonepeUri}
                  className="flex items-center justify-center p-2.5 bg-white border border-gray-300 hover:border-black rounded-sm text-xs text-gray-900 font-semibold transition-colors text-center shadow-sm"
                >
                  PhonePe
                </a>
                <a
                  href={paytmUri}
                  className="flex items-center justify-center p-2.5 bg-white border border-gray-300 hover:border-black rounded-sm text-xs text-gray-900 font-semibold transition-colors text-center shadow-sm"
                >
                  Paytm
                </a>
                <a
                  href={upiIntentUri}
                  className="flex items-center justify-center p-2.5 bg-white border border-gray-300 hover:border-black rounded-sm text-xs text-gray-900 font-semibold transition-colors text-center shadow-sm"
                >
                  All UPI Apps
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Enter 12-Digit UTR Number or Confirm Payment */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="utrInput" className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Step 2: Enter 12-Digit UPI Transaction Reference (UTR / RRN)
            </label>
            <button
              type="button"
              onClick={() => setShowUtrHelp(!showUtrHelp)}
              className="text-[11px] text-[#8C6D47] hover:underline font-medium"
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
                className="mb-3 p-3 bg-white border border-gray-200 rounded-sm text-xs text-gray-700 space-y-1 shadow-sm"
              >
                <p className="font-semibold text-gray-900">How to locate the 12-digit UTR / Reference number:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                  <li><strong className="text-gray-900">Google Pay:</strong> Listed as &ldquo;UPI Transaction ID&rdquo; in payment details.</li>
                  <li><strong className="text-gray-900">PhonePe:</strong> Listed as &ldquo;UTR&rdquo; or &ldquo;Transaction ID&rdquo; starting with numeric digits.</li>
                  <li><strong className="text-gray-900">Paytm:</strong> Listed as &ldquo;UPI Ref No.&rdquo; in receipt view.</li>
                  <li><strong className="text-gray-900">Bank SMS:</strong> 12-digit reference number included in your debit notification SMS.</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmitWithUtr} className="space-y-3">
            <div className="relative">
              <input
                id="utrInput"
                type="text"
                maxLength={12}
                value={utrNumber}
                onChange={handleUtrChange}
                placeholder="e.g. 412356789012 (optional if tapping confirm below)"
                className={`w-full bg-white border ${validationError ? 'border-red-500' : 'border-gray-300'} px-4 py-3 rounded-sm text-gray-900 font-mono text-sm tracking-widest placeholder-gray-400 focus:border-[#C0A080] focus:ring-1 focus:ring-[#C0A080] outline-none shadow-sm`}
              />
              <span className="absolute right-3 top-3.5 text-xs font-mono text-gray-400">
                {utrNumber.length}/12
              </span>
            </div>

            {validationError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs"
              >
                {validationError}
              </motion.p>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <motion.button
                type="submit"
                disabled={isSubmitting || utrNumber.length !== 12}
                whileHover={utrNumber.length === 12 ? { scale: 1.01 } : {}}
                whileTap={utrNumber.length === 12 ? { scale: 0.99 } : {}}
                className={`flex-1 py-3.5 px-6 font-bold uppercase text-xs tracking-widest rounded-sm transition-all duration-200 ${
                  utrNumber.length === 12 && !isSubmitting
                    ? 'bg-black hover:bg-gray-800 text-white shadow-sm cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Confirm with UTR'}
              </motion.button>

              <motion.button
                type="button"
                disabled={isSubmitting}
                onClick={handleQuickConfirm}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="py-3.5 px-6 font-bold uppercase text-xs tracking-wider rounded-sm transition-all duration-200 bg-[#C0A080] hover:bg-[#A88865] text-black shadow-sm"
              >
                I Have Paid via UPI App (Confirm)
              </motion.button>
            </div>
          </form>

          {/* Night Verification Window Advisory & Support Notice */}
          <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-900 font-semibold text-[11px] uppercase tracking-wider">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Verification Window Advisory</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Payments submitted overnight are verified sequentially after <strong>6:00 AM</strong>, after which your order confirmation will be dispatched.
            </p>
            <div className="pt-1 text-[11px] text-amber-900 border-t border-amber-200/60 flex flex-wrap items-center gap-2">
              <span>Support or questions:</span>
              <a
                href={`tel:${STORE_CONFIG.storePhone}`}
                className="text-black hover:underline font-mono font-bold"
              >
                Call: {STORE_CONFIG.storePhone}
              </a>
              <span>•</span>
              <a
                href={`https://wa.me/${STORE_CONFIG.storeWhatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline font-bold"
              >
                WhatsApp Text
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Security Disclosures */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-[11px] text-gray-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Direct Merchant Verification • Zero Intermediary Risk</span>
        </div>
        <span>Merchant: {merchantName}</span>
      </div>
    </div>
  );
};

export default DirectMerchantUpi;
