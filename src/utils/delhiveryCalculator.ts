import { STORE_CONFIG } from '../config/storeConfig';

export interface PincodeLookupResult {
  pincode: string;
  isServiceable: boolean;
  region: string;
  state: string;
  standardDays: string;
  expressDays: string;
  estimatedStandardDate: string;
  estimatedExpressDate: string;
  isLocalChennai: boolean;
  courierMode: string;
}

export interface ShippingCalculation {
  subtotal: number;
  standardFee: number;
  expressFee: number;
  isFreeShippingEligible: boolean;
  amountNeededForFreeShipping: number;
  freeShippingProgress: number; // 0 to 100
}

/**
 * Format a date as a readable retail delivery date (e.g. "Monday, 20 Oct")
 */
function formatDeliveryDate(daysToAdd: number): string {
  const date = new Date();
  let count = 0;
  while (count < daysToAdd) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    // Exclude Sunday for courier business delivery
    if (day !== 0) {
      count++;
    }
  }
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Validates 6-digit Indian PIN Code
 */
export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

/**
 * Look up Delhivery delivery estimation based on 6-digit Indian PIN code
 */
export function lookupDelhiveryPincode(pincode: string): PincodeLookupResult | null {
  const cleanPin = pincode.trim();
  if (!isValidPincode(cleanPin)) {
    return null;
  }

  const prefix2 = cleanPin.substring(0, 2);
  const prefix3 = cleanPin.substring(0, 3);

  let region = "National";
  let state = "India";
  let standardDays = STORE_CONFIG.delhiveryLogistics.standardDays;
  let expressDays = STORE_CONFIG.delhiveryLogistics.expressDays;
  let stdDaysNum = 4;
  let expDaysNum = 2;
  let isLocalChennai = false;

  if (prefix3 === "600") {
    region = "Chennai Metro";
    state = "Tamil Nadu";
    standardDays = STORE_CONFIG.delhiveryLogistics.localChennaiDays;
    expressDays = "1 Day (Priority Dispatch)";
    stdDaysNum = 1;
    expDaysNum = 1;
    isLocalChennai = true;
  } else if (prefix2 >= "60" && prefix2 <= "64") {
    region = "Tamil Nadu";
    state = "Tamil Nadu";
    standardDays = "2–3 Business Days";
    expressDays = "1–2 Business Days";
    stdDaysNum = 2;
    expDaysNum = 1;
  } else if (prefix2 >= "56" && prefix2 <= "59") {
    region = "Karnataka";
    state = "Karnataka";
    standardDays = "2–3 Business Days";
    expressDays = "1–2 Business Days";
    stdDaysNum = 3;
    expDaysNum = 2;
  } else if (prefix2 >= "50" && prefix2 <= "53") {
    region = "Telangana & Andhra Pradesh";
    state = "South Region";
    standardDays = "2–3 Business Days";
    expressDays = "1–2 Business Days";
    stdDaysNum = 3;
    expDaysNum = 2;
  } else if (prefix2 >= "67" && prefix2 <= "69") {
    region = "Kerala";
    state = "Kerala";
    standardDays = "2–3 Business Days";
    expressDays = "1–2 Business Days";
    stdDaysNum = 3;
    expDaysNum = 2;
  } else if (prefix2 >= "40" && prefix2 <= "44") {
    region = "Maharashtra";
    state = "Maharashtra";
    standardDays = "3–4 Business Days";
    expressDays = "2 Business Days";
    stdDaysNum = 4;
    expDaysNum = 2;
  } else if (prefix2 >= "11" && prefix2 <= "13") {
    region = "Delhi NCR";
    state = "North Region";
    standardDays = "3–4 Business Days";
    expressDays = "2 Business Days";
    stdDaysNum = 4;
    expDaysNum = 2;
  } else {
    region = "Rest of India";
    state = "National Delivery";
    standardDays = "3–5 Business Days";
    expressDays = "2–3 Business Days";
    stdDaysNum = 5;
    expDaysNum = 2;
  }

  return {
    pincode: cleanPin,
    isServiceable: true,
    region,
    state,
    standardDays,
    expressDays,
    estimatedStandardDate: formatDeliveryDate(stdDaysNum),
    estimatedExpressDate: formatDeliveryDate(expDaysNum),
    isLocalChennai,
    courierMode: isLocalChennai ? "Delhivery Local Surface" : "Delhivery Surface & Express Air"
  };
}

/**
 * Calculates shipping charges and free delivery progress based on cart subtotal
 */
export function calculateShipping(subtotal: number): ShippingCalculation {
  const threshold = STORE_CONFIG.delhiveryLogistics.freeShippingThreshold;
  const isFree = subtotal >= threshold;
  const standardFee = isFree ? 0 : STORE_CONFIG.delhiveryLogistics.standardShippingFee;
  const expressFee = STORE_CONFIG.delhiveryLogistics.expressShippingFee;
  const amountNeeded = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));

  return {
    subtotal,
    standardFee,
    expressFee,
    isFreeShippingEligible: isFree,
    amountNeededForFreeShipping: amountNeeded,
    freeShippingProgress: progress
  };
}
