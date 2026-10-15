import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STORE_CONFIG } from '../config/storeConfig';
import { lookupDelhiveryPincode, PincodeLookupResult, calculateShipping } from '../utils/delhiveryCalculator';

interface DelhiveryShippingCalculatorProps {
  cartSubtotal?: number;
  onPincodeValidated?: (result: PincodeLookupResult) => void;
  compact?: boolean;
}

export const DelhiveryShippingCalculator: React.FC<DelhiveryShippingCalculatorProps> = ({
  cartSubtotal = 0,
  onPincodeValidated,
  compact = false
}) => {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<PincodeLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const shipping = calculateShipping(cartSubtotal);

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    const cleaned = pincode.trim();

    if (!cleaned) {
      setError('Enter a 6-digit Indian PIN code');
      setResult(null);
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(cleaned)) {
      setError('Invalid PIN code format. Must be 6 digits.');
      setResult(null);
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      const lookup = lookupDelhiveryPincode(cleaned);
      if (lookup) {
        setResult(lookup);
        if (onPincodeValidated) {
          onPincodeValidated(lookup);
        }
      } else {
        setError('PIN code not serviceable at this moment.');
      }
      setIsChecking(false);
    }, 250);
  };

  return (
    <div className={`w-full bg-[#0d0d0d] border border-gray-800 rounded-sm p-4 text-gray-200 ${compact ? 'text-xs' : 'text-sm'}`}>
      {/* Free Shipping Progress Indicator */}
      {cartSubtotal > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-800">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-300">
              {shipping.isFreeShippingEligible ? (
                <span className="text-emerald-400 font-bold">Free Delhivery Delivery Unlocked</span>
              ) : (
                <span>
                  Add <span className="text-[#FF5A00] font-bold">₹{shipping.amountNeededForFreeShipping}</span> for Free Delivery
                </span>
              )}
            </span>
            <span className="text-[11px] font-mono text-gray-400">
              ₹{cartSubtotal} / ₹{STORE_CONFIG.delhiveryLogistics.freeShippingThreshold}
            </span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-[#FF5A00] h-full"
              initial={{ width: 0 }}
              animate={{ width: `${shipping.freeShippingProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Pincode Input Box */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {/* Delhivery Courier Badge Icon */}
          <svg className="w-4 h-4 text-[#FF5A00] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          <span className="font-semibold text-gray-200 tracking-wide text-xs uppercase">
            Delhivery Delivery Estimator
          </span>
        </div>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">PAN India</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2 mt-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit PIN code"
          className="flex-1 bg-black border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 rounded-sm focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] outline-none font-mono"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isChecking}
          className="bg-[#FF5A00] hover:bg-[#EA580C] text-white px-4 py-2 font-semibold text-xs tracking-wider uppercase rounded-sm transition-colors"
        >
          {isChecking ? 'Checking...' : 'Check'}
        </motion.button>
      </form>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mt-2"
        >
          {error}
        </motion.p>
      )}

      {/* Result Information */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-gray-800 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between text-gray-300">
              <span className="text-gray-400">Destination:</span>
              <span className="font-medium text-white">{result.region}, {result.state}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 bg-black/60 border border-gray-800 rounded-sm">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Standard Delivery</div>
                <div className="text-[#FF5A00] font-bold mt-0.5">{result.estimatedStandardDate}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{result.standardDays}</div>
                <div className="text-[11px] font-mono mt-1 text-gray-200">
                  {shipping.isFreeShippingEligible ? (
                    <span className="text-emerald-400 font-bold">FREE</span>
                  ) : (
                    `₹${STORE_CONFIG.delhiveryLogistics.standardShippingFee}`
                  )}
                </div>
              </div>

              <div className="p-2.5 bg-black/60 border border-gray-800 rounded-sm">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Express Air</div>
                <div className="text-white font-bold mt-0.5">{result.estimatedExpressDate}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{result.expressDays}</div>
                <div className="text-[11px] font-mono mt-1 text-gray-200">
                  ₹{STORE_CONFIG.delhiveryLogistics.expressShippingFee}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
              <span>Logistics Partner:</span>
              <span className="text-gray-300 font-medium">Delhivery Logistics Network</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DelhiveryShippingCalculator;
