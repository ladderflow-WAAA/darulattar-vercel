import { supabase } from '../lib/supabase';

export interface OrderItem {
  id?: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PaymentInfo {
  method: string;
  utrNumber?: string;
  vpa?: string;
  status: 'VERIFICATION_PENDING' | 'VERIFIED_PAID' | 'DISPATCHED' | 'CANCELLED' | 'WHATSAPP_ENQUIRY' | string;
}

export interface OrderRecord {
  orderId: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingSpeed: string;
  estimatedDeliveryDate?: string;
  payment: PaymentInfo;
  delhiveryTrackingAwb?: string;
  createdAt: string;
}

const LOCAL_STORAGE_KEY = 'darulattar_orders';

/**
 * Save an order to both Supabase (for cross-device admin visibility) and LocalStorage (local backup)
 */
export async function saveOrder(order: OrderRecord): Promise<void> {
  // 1. Always save to LocalStorage backup
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const filtered = existing.filter((o: OrderRecord) => o.orderId !== order.orderId);
    filtered.unshift(order);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered.slice(0, 50)));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }

  // 2. Save to Supabase Cloud Database
  try {
    const payload = {
      order_id: order.orderId,
      customer_name: order.customer.fullName,
      customer_phone: order.customer.phone,
      customer_email: order.customer.email || '',
      customer_address: order.customer.address,
      city: order.customer.city || 'Chennai',
      state: order.customer.state || 'Tamil Nadu',
      pincode: order.customer.pincode || '',
      items: order.items,
      subtotal: order.subtotal,
      shipping_fee: order.shippingFee,
      total: order.total,
      shipping_speed: order.shippingSpeed,
      estimated_delivery_date: order.estimatedDeliveryDate || '',
      payment_method: order.payment.method,
      utr_number: order.payment.utrNumber || '',
      payment_vpa: order.payment.vpa || '',
      payment_status: order.payment.status,
      delhivery_tracking_awb: order.delhiveryTrackingAwb || '',
      created_at: order.createdAt
    };

    const { error } = await supabase.from('orders').upsert(payload, { onConflict: 'order_id' });
    if (error) {
      console.warn('Supabase order insert warning (run CREATE-ORDERS-TABLE.sql if table does not exist):', error.message);
    }
  } catch (err) {
    console.warn('Supabase connection error:', err);
  }
}

/**
 * Fetch all orders for the Admin Dashboard (combines Supabase cloud database with local backup)
 */
export async function fetchAllOrders(): Promise<OrderRecord[]> {
  let cloudOrders: OrderRecord[] = [];

  // 1. Attempt to fetch from Supabase
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      cloudOrders = data.map((row: any) => ({
        orderId: row.order_id,
        customer: {
          fullName: row.customer_name,
          phone: row.customer_phone,
          email: row.customer_email,
          address: row.customer_address,
          city: row.city,
          state: row.state,
          pincode: row.pincode
        },
        items: Array.isArray(row.items) ? row.items : [],
        subtotal: Number(row.subtotal) || 0,
        shippingFee: Number(row.shipping_fee) || 0,
        total: Number(row.total) || 0,
        shippingSpeed: row.shipping_speed,
        estimatedDeliveryDate: row.estimated_delivery_date,
        payment: {
          method: row.payment_method,
          utrNumber: row.utr_number,
          vpa: row.payment_vpa,
          status: row.payment_status
        },
        delhiveryTrackingAwb: row.delhivery_tracking_awb,
        createdAt: row.created_at
      }));
    }
  } catch (err) {
    console.warn('Supabase fetch failed, relying on local backup:', err);
  }

  // 2. Fetch local storage orders
  let localOrders: OrderRecord[] = [];
  try {
    localOrders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  } catch {}

  // 3. Merge unique orders
  const map = new Map<string, OrderRecord>();
  cloudOrders.forEach(o => map.set(o.orderId, o));
  localOrders.forEach(o => {
    if (!map.has(o.orderId)) {
      map.set(o.orderId, o);
    }
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Update order status across Supabase and LocalStorage
 */
export async function updateOrderStatus(orderId: string, updates: { paymentStatus?: string; delhiveryTrackingAwb?: string }): Promise<void> {
  // Update LocalStorage
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const updated = existing.map((o: OrderRecord) => {
      if (o.orderId === orderId) {
        return {
          ...o,
          payment: {
            ...o.payment,
            status: updates.paymentStatus || o.payment.status
          },
          delhiveryTrackingAwb: updates.delhiveryTrackingAwb !== undefined ? updates.delhiveryTrackingAwb : o.delhiveryTrackingAwb
        };
      }
      return o;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  // Update Supabase
  try {
    const payload: any = {};
    if (updates.paymentStatus) payload.payment_status = updates.paymentStatus;
    if (updates.delhiveryTrackingAwb !== undefined) payload.delhivery_tracking_awb = updates.delhiveryTrackingAwb;

    await supabase.from('orders').update(payload).eq('order_id', orderId);
  } catch (err) {
    console.warn('Supabase update order error:', err);
  }
}

/**
 * Delete order from both Supabase and LocalStorage
 */
export async function deleteOrderRecord(orderId: string): Promise<void> {
  // Delete from LocalStorage
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const filtered = existing.filter((o: OrderRecord) => o.orderId !== orderId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch {}

  // Delete from Supabase
  try {
    await supabase.from('orders').delete().eq('order_id', orderId);
  } catch (err) {
    console.warn('Supabase delete order error:', err);
  }
}

/**
 * Check if the orders table exists and is accessible in Supabase
 */
export async function checkOrdersCloudSyncStatus(): Promise<{ connected: boolean; message: string }> {
  try {
    const { error } = await supabase.from('orders').select('order_id').limit(1);
    if (error) {
      return { connected: false, message: error.message };
    }
    return { connected: true, message: 'Cloud database active and synchronized.' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Connection error' };
  }
}
