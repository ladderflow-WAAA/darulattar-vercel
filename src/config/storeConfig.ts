/**
 * Centralized Store & Logistics Configuration
 * Darul Attar and Oud
 */

export interface DelhiveryLogisticsConfig {
  partnerName: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  standardDays: string;
  expressDays: string;
  localChennaiDays: string;
  trackingBaseUrl: string;
}

export interface MerchantUpiConfig {
  vpa: string;
  merchantName: string;
  mcc: string;
  mobileGalleryLimitNote: number;
}

export interface OfficialGatewayConfig {
  providerName: string;
  initiateUrl: string;
  verifyUrl: string;
}

export interface StoreConfig {
  storeName: string;
  storeSubtitle: string;
  storeWhatsappNumber: string;
  supportEmail: string;
  storePhone: string;
  storeAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMode: "DIRECT_MERCHANT_UPI" | "OFFICIAL_GATEWAY_API";
  merchantUpi: MerchantUpiConfig;
  officialGatewayApi: OfficialGatewayConfig;
  delhiveryLogistics: DelhiveryLogisticsConfig;
  verificationSchedule: {
    nightWindowStart: string;
    nightWindowEnd: string;
    noticeText: string;
    supportActionText: string;
  };
}

export const STORE_CONFIG: StoreConfig = {
  storeName: "Darul Attar and Oud",
  storeSubtitle: "Authentic Pure Oud, Concentrated Attar Oils & Fragrance Essentials",
  storeWhatsappNumber: "919578994377",
  supportEmail: "contact@darulattar.com",
  storePhone: "+91 9578994377",
  storeAddress: "#144 Aziz Mulk, 1st Street, Greams Road, Thousand Lights",
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "600006",

  // SAFE DUAL-MODE PAYMENT ARCHITECTURE:
  // "DIRECT_MERCHANT_UPI" = 100% safe Official Store Merchant QR + Copy UPI ID + 12-Digit UTR & WhatsApp Verification (0% fee, zero ban risk)
  // "OFFICIAL_GATEWAY_API" = Redirects to official PhonePe PG / Paytm PG / Razorpay backend endpoint when API keys are added
  paymentMode: "DIRECT_MERCHANT_UPI",

  merchantUpi: {
    // Official Business VPA for Darul Attar and Oud
    vpa: "paytm.s2gnznb@pty",
    merchantName: "Darul Attar and Oud",
    mcc: "5977", // Cosmetic & Perfumery Stores
    mobileGalleryLimitNote: 2000 // NPCI ₹2,000 limit helper for same-phone screenshot scans
  },

  officialGatewayApi: {
    providerName: "PhonePe / Paytm Official Gateway",
    initiateUrl: "/api/payment/initiate",
    verifyUrl: "/api/payment/verify"
  },

  delhiveryLogistics: {
    partnerName: "Delhivery Courier",
    freeShippingThreshold: 1499, // Free delivery on orders >= ₹1,499
    standardShippingFee: 69,     // Automatically added to order total below ₹1,499
    expressShippingFee: 119,     // Optional 1-2 day express delivery
    standardDays: "3–5 Business Days",
    expressDays: "1–2 Business Days",
    localChennaiDays: "1–2 Business Days",
    trackingBaseUrl: "https://www.delhivery.com/track/package/"
  },

  verificationSchedule: {
    nightWindowStart: "10:00 PM",
    nightWindowEnd: "6:00 AM",
    noticeText: "Payments submitted between 10:00 PM and 6:00 AM are verified sequentially after 6:00 AM next morning, followed by dispatch confirmation.",
    supportActionText: "For questions or immediate support, you can text on WhatsApp or call: +91 95789 94377."
  }
};
