import dotenv from 'dotenv';
import crypto from 'crypto';

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
    return sendJson(res, 405, { success: false, error: 'Method not allowed. Use POST.' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return sendJson(res, 401, {
      success: false,
      error: 'Missing environment variable: RAZORPAY_KEY_SECRET. Configure it in Vercel Project Settings > Environment Variables.'
    });
  }

  try {
    const body = await parseBody(req);
    const orderId = body.razorpay_order_id || body.order_id;
    const paymentId = body.razorpay_payment_id || body.payment_id;
    const signature = body.razorpay_signature || body.signature;

    // Check for missing fields
    if (!orderId || !paymentId || !signature) {
      return sendJson(res, 400, {
        success: false,
        error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.'
      });
    }

    // Generate expected HMAC-SHA256 signature
    const payload = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    // Secure timing-safe signature comparison
    let isMatch = false;
    if (expectedSignature.length === signature.length) {
      isMatch = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(signature, 'utf-8')
      );
    }

    if (!isMatch) {
      return sendJson(res, 400, {
        success: false,
        error: 'Payment verification failed: Signature mismatch.'
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: 'Payment verified successfully.',
      order_id: orderId,
      payment_id: paymentId
    });
  } catch (err: any) {
    console.error('Razorpay signature verification error:', err);
    return sendJson(res, 500, {
      success: false,
      error: err.message || 'Internal server error verifying signature.'
    });
  }
}
