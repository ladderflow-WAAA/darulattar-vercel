import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();
dotenv.config({ path: '.env.local', override: false });

async function parseBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.length > 0) {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

function sendJson(res: any, statusCode: number, data: any) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req: any, res: any) {
  // Allow only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const missing: string[] = [];
    if (!keyId) missing.push('RAZORPAY_KEY_ID');
    if (!keySecret) missing.push('RAZORPAY_KEY_SECRET');
    return sendJson(res, 401, {
      error: `Missing environment variable(s): ${missing.join(', ')}. Configure them in Vercel Project Settings > Environment Variables.`
    });
  }

  try {
    const body = await parseBody(req);
    const { amount, currency = 'INR', receipt, notes } = body;

    // Validate amount
    const parsedAmount = Number(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount < 100) {
      return sendJson(res, 400, {
        error: 'Invalid amount. Minimum amount is 100 paise (₹1.00).'
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const orderOptions = {
      amount: Math.round(parsedAmount),
      currency: (currency || 'INR').toUpperCase(),
      receipt: receipt || `rcpt_${Date.now().toString().slice(-8)}`,
      notes: notes || {}
    };

    const order = await razorpay.orders.create(orderOptions);

    return sendJson(res, 200, {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err: any) {
    console.error('Razorpay create-order error:', err);
    if (err.statusCode === 401 || err.error?.code === 'BAD_REQUEST_ERROR' && err.error?.description?.includes('authentication')) {
      return sendJson(res, 401, {
        error: err.error?.description || 'Razorpay authentication failed.'
      });
    }
    return sendJson(res, 500, {
      error: err.error?.description || err.message || 'Failed to create Razorpay order.'
    });
  }
}
