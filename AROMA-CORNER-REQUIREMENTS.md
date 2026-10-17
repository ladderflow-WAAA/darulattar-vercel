# AROMA CORNER — Project Requirements & Asset Checklist

This checklist documents every input, asset, and credential required to convert the replicated platform into **Aroma Corner** with an elevated visual standard and active payment processing.

---

## 1. Merchant Payment Configuration

Provide these parameters to configure the Direct Merchant UPI engine in `src/config/storeConfig.ts`:

| Parameter | Current Placeholder | Required Aroma Corner Value | Where Used |
|---|---|---|---|
| **Merchant UPI VPA** | `paytm.s2gnznb@pty` | `your-vpa@bank` (e.g., `aromacorner@okaxis`) | Dynamic UPI QR & Intent Links |
| **Merchant Legal Name** | `Darul Attar and Oud` | Registered Business / Payee Name | UPI string `pn=` parameter |
| **WhatsApp Business Number** | `919361291810` | 10-digit mobile number with country code `91` | Cart WhatsApp dispatch & support links |
| **Support Phone (Calls)** | `+91 93612 91810` | Customer support dialer number | Overnight payment verification banner |
| **Verification Window** | `10:00 PM – 6:00 AM` | Desired overnight off-hours | Checkout verification notice |

---

## 2. Brand Visual Assets (Place in `/public` Folder)

All graphic assets must adhere strictly to the non-living guardrail: **no humans, faces, heads, silhouettes of living beings, or mannequins**.

| File Name | Format | Recommended Dimensions | Purpose |
|---|---|---|---|
| `logo.svg` | SVG (Vector) | Scalable (horizontal ratio ~ 4:1) | Navigation bar & footer |
| `logo-icon.svg` | SVG (Vector) | 1:1 Square (e.g., 512x512) | Mobile header badge & favicon |
| `favicon.ico` / `favicon.svg` | ICO / SVG | 32x32, 64x64 | Browser tab icon |
| `hero-bg.webp` (Optional) | WEBP / JPG | 1920x1080 (clean studio flat-lay) | Hero background layer |
| `site.webmanifest` | JSON | N/A | PWA manifest with updated store name |

---

## 3. Logistics & Delhivery Shipping Configuration

Parameters configured in `src/config/storeConfig.ts` and `src/utils/delhiveryCalculator.ts`:

| Parameter | Current Value | Required Aroma Corner Setting |
|---|---|---|
| **Warehouse Origin City** | `Chennai` | Origin dispatch hub |
| **Warehouse Origin PIN** | `600106` | Origin PIN code for distance calculation |
| **Free Shipping Threshold** | `₹799.00` | Minimum order value for zero delivery fee |
| **Standard Delhivery Fee** | `₹69.00` | Flat fee for orders below threshold |
| **Express Air Delivery Fee** | `₹119.00` | Optional express shipping rate |

---

## 4. Database & Cloud Backend Setup

To ensure orders and admin dashboard operate independently from previous projects:

### A. Supabase Project
1. Provide a new Supabase Project URL (`VITE_SUPABASE_URL`) and Anon Public Key (`VITE_SUPABASE_ANON_KEY`) in `.env.local`.
2. Run `CREATE-ORDERS-TABLE.sql` in the Supabase SQL Editor to establish the cloud order schema.
3. Run the `products` table SQL from `ENV-REQUIREMENTS.md` to establish the catalog schema.
4. Create an Admin user in **Supabase Auth > Users > Add User**.

### B. Cloudinary Image Uploads (Admin Panel)
- Cloud name and unsigned upload preset (e.g., `aromacorner_preset`) in `CloudinaryUploader.tsx`.

---

## 5. Design & Thematic Direction

The following architectural components will be styled for Aroma Corner using `motion/react`:

1. **Color Scheme**: High-contrast modern luxury palette (e.g., deep obsidian `#0A0A0A`, brushed copper/gold accents, crisp typography).
2. **Typography**: Google Fonts pairing with contrasting typeface for accent terms.
3. **Motion Specifications**:
   - Magnetic button micro-interactions.
   - Smooth 60fps card depth transitions.
   - Delhivery calculator expansion states.
   - Dynamic QR rendering on checkout.
