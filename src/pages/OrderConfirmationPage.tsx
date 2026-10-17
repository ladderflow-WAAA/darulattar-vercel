import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { PageState } from '../App';
import { useCart, CartItem } from '../contexts/CartContext';
import { STORE_CONFIG } from '../config/storeConfig';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { WhatsappIcon } from '../components/icons/WhatsappIcon';

interface OrderCustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface OrderConfirmationDetails {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingSpeed: string;
  estimatedDeliveryDate: string;
  customer: OrderCustomerDetails;
  payment: {
    method: string;
    utrNumber?: string;
    vpa?: string;
    status: string;
  };
  createdAt: string;
}

interface OrderConfirmationPageProps {
  navigate: (pageState: PageState) => void;
  orderDetails?: OrderConfirmationDetails;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  navigate,
  orderDetails
}) => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Fallback if accessed directly without state
  const fallbackOrder = !orderDetails ? {
    orderId: `DAO-${Date.now().toString().slice(-6)}`,
    items: [],
    subtotal: 0,
    shippingFee: 0,
    total: 0,
    shippingSpeed: 'Delhivery Courier',
    estimatedDeliveryDate: '3–5 Business Days',
    customer: {
      fullName: 'Customer',
      phone: '',
      address: '',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: ''
    },
    payment: {
      method: 'DIRECT_MERCHANT_UPI',
      utrNumber: '',
      vpa: STORE_CONFIG.merchantUpi.vpa,
      status: 'VERIFICATION_PENDING'
    },
    createdAt: new Date().toISOString()
  } : orderDetails;

  const handleSendWhatsAppConfirmation = () => {
    const itemsText = fallbackOrder.items.length > 0
      ? fallbackOrder.items.map(it => `• ${it.quantity}x ${it.name} (${it.size}) - ₹${(it.price * it.quantity).toFixed(2)}`).join('\n')
      : 'Items as selected in bag';

    const msg = [
      `*ORDER RECEIPT & VERIFICATION - DARUL ATTAR*`,
      `Order ID: ${fallbackOrder.orderId}`,
      `Date: ${new Date(fallbackOrder.createdAt).toLocaleDateString('en-IN')}`,
      `---------------------------------`,
      `*Customer:* ${fallbackOrder.customer.fullName}`,
      `*Phone:* ${fallbackOrder.customer.phone}`,
      `*Address:* ${fallbackOrder.customer.address}, ${fallbackOrder.customer.city} - ${fallbackOrder.customer.pincode}`,
      `---------------------------------`,
      `*Delivery:* ${fallbackOrder.shippingSpeed}`,
      `*Estimated Date:* ${fallbackOrder.estimatedDeliveryDate}`,
      `---------------------------------`,
      `*Items:*`,
      itemsText,
      `---------------------------------`,
      `*Total Paid:* ₹${fallbackOrder.total.toFixed(2)}`,
      `*UTR / RRN:* ${fallbackOrder.payment.utrNumber || 'Pending verification'}`,
      `*Payment VPA:* ${fallbackOrder.payment.vpa || STORE_CONFIG.merchantUpi.vpa}`,
      `---------------------------------`,
      `Please verify payment and dispatch package.`
    ].join('\n');

    window.open(`https://wa.me/${STORE_CONFIG.storeWhatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#FAF8F5] border border-gray-200 rounded-sm p-6 sm:p-10 shadow-md"
        >
          {/* Header Status */}
          <div className="text-center pb-6 border-b border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 text-[#8C6D47]">
              <CheckCircleIcon />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded font-semibold">
              Order Registered &amp; UTR Logged
            </span>
            <h1 className="text-3xl font-serif text-gray-900 mt-3 font-bold">
              Thank You for Your Order
            </h1>
            <p className="text-xs text-gray-600 mt-2">
              Your order reference is <span className="font-mono font-bold text-gray-900">{fallbackOrder.orderId}</span>.
              A dispatch notification will be initiated once the transaction is matched.
            </p>
          </div>

          {/* Delivery & Logistics Timeline */}
          <div className="my-6 p-4 bg-white border border-gray-200 rounded-sm shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-semibold">Logistics Partner</span>
                <span className="font-semibold text-gray-900">Delhivery Logistics ({fallbackOrder.shippingSpeed})</span>
              </div>
              <div>
                <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-semibold">Estimated Delivery</span>
                <span className="font-bold text-[#8C6D47] text-sm">{fallbackOrder.estimatedDeliveryDate}</span>
              </div>
              <div>
                <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-semibold">Destination</span>
                <span className="text-gray-800 font-medium">{fallbackOrder.customer.city}, {fallbackOrder.customer.pincode}</span>
              </div>
            </div>
          </div>

          {/* Payment & UTR Summary */}
          <div className="p-4 bg-white border border-gray-200 rounded-sm space-y-2 text-xs shadow-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Channel:</span>
              <span className="text-gray-900 font-semibold">Direct Merchant UPI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Merchant VPA:</span>
              <span className="font-mono text-[#8C6D47] font-bold">{STORE_CONFIG.merchantUpi.vpa}</span>
            </div>
            {fallbackOrder.payment.utrNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600">12-Digit UTR Number:</span>
                <span className="font-mono text-gray-900 font-bold select-all tracking-wider">
                  {fallbackOrder.payment.utrNumber}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span className="text-amber-700 font-semibold">Verification in Progress</span>
            </div>
          </div>

          {/* Verification Advisory Notice */}
          <div className="my-6 p-4 bg-amber-50 border border-amber-200 rounded-sm text-xs">
            <div className="flex items-start space-x-3">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="space-y-1.5 flex-1">
                <span className="font-semibold text-amber-900 block uppercase tracking-wider text-[11px]">
                  Verification Schedule (10:00 PM – 6:00 AM)
                </span>
                <p className="text-amber-950 leading-relaxed text-[11px]">
                  Orders and payments submitted between <strong>10:00 PM and 6:00 AM</strong> are verified sequentially starting after <strong>6:00 AM</strong> next morning, after which your dispatch notification will be triggered.
                </p>
                <div className="pt-1 text-[11px] text-amber-900 border-t border-amber-200/60 flex flex-wrap items-center gap-2">
                  <span>Questions or support:</span>
                  <div className="flex items-center gap-3">
                    <a
                      href={`tel:${STORE_CONFIG.storePhone}`}
                      className="text-black hover:underline font-mono font-bold inline-flex items-center space-x-1"
                    >
                      <span>Call: {STORE_CONFIG.storePhone}</span>
                    </a>
                    <span>•</span>
                    <a
                      href={`https://wa.me/${STORE_CONFIG.storeWhatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-bold inline-flex items-center space-x-1"
                    >
                      <span>WhatsApp Text</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Item Breakdown (if available) */}
          {fallbackOrder.items.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-xs uppercase tracking-wider text-gray-700 mb-3 font-semibold">
                Order Items ({fallbackOrder.items.length})
              </h3>
              <div className="space-y-2">
                {fallbackOrder.items.map((it) => (
                  <div key={it.cartItemId} className="flex justify-between text-xs py-1">
                    <span className="text-gray-800">
                      {it.quantity}x {it.name} <span className="text-gray-500">({it.size})</span>
                    </span>
                    <span className="font-mono text-gray-900 font-semibold">₹{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-mono text-gray-900 font-medium">₹{fallbackOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delhivery Shipping:</span>
                  <span className="font-mono text-gray-900 font-medium">
                    {fallbackOrder.shippingFee === 0 ? 'FREE' : `₹${fallbackOrder.shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-black font-bold text-base">₹{fallbackOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Address */}
          {fallbackOrder.customer.address && (
            <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-600">
              <span className="block uppercase tracking-wider text-[10px] text-gray-500 font-semibold mb-1">
                Dispatch Address
              </span>
              <p className="text-gray-900 font-semibold">{fallbackOrder.customer.fullName} • {fallbackOrder.customer.phone}</p>
              <p>{fallbackOrder.customer.address}</p>
              <p>{fallbackOrder.customer.city}, {fallbackOrder.customer.state} - {fallbackOrder.customer.pincode}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSendWhatsAppConfirmation}
              className="flex-1 bg-[#25D366] hover:bg-[#20bd4d] text-white py-3.5 px-6 font-bold uppercase text-xs tracking-wider rounded-sm flex items-center justify-center space-x-2 transition-colors shadow-xs"
            >
              <WhatsappIcon />
              <span>Send Receipt on WhatsApp</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handlePrint}
              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 py-3.5 px-6 font-semibold uppercase text-xs tracking-wider rounded-sm transition-colors shadow-xs"
            >
              Print Receipt
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate({ name: 'home', props: { section: 'collection' } })}
              className="bg-black hover:bg-gray-800 text-white py-3.5 px-6 font-semibold uppercase text-xs tracking-wider rounded-sm transition-colors shadow-xs"
            >
              Back to Shop
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;