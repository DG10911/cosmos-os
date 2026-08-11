/**
 * Real Razorpay Checkout — opens the actual Razorpay payment modal (UPI, cards,
 * wallets) using ONLY the public key-id. Safe for the browser by design; the
 * secret key is never involved here (it's only needed server-side to verify a
 * payment, which is the production Edge-Function step).
 *
 * In TEST mode (rzp_test_...) this shows the real UI and accepts test payments
 * with no real money. If no key is configured, callers fall back gracefully.
 */
const KEY = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

export function razorpayReady(): boolean {
  return !!KEY && KEY.startsWith("rzp_");
}

let scriptLoaded = false;
function loadCheckout(): Promise<boolean> {
  if (scriptLoaded) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => {
      scriptLoaded = true;
      resolve(true);
    };
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export async function openRazorpay(opts: {
  amountInr: number;
  description: string;
  onSuccess: (paymentId: string) => void;
  onDismiss?: () => void;
}): Promise<boolean> {
  if (!razorpayReady()) return false;
  const ok = await loadCheckout();
  if (!ok) return false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Razorpay = (window as any).Razorpay;
  if (!Razorpay) return false;

  const rzp = new Razorpay({
    key: KEY,
    amount: Math.round(opts.amountInr * 100), // paise
    currency: "INR",
    name: "COSMOS OS",
    description: opts.description,
    theme: { color: "#FF6B2C" },
    prefill: { name: "Anya Sharma", email: "anya@example.com", contact: "9876543210" },
    notes: { product: opts.description },
    handler: (resp: { razorpay_payment_id: string }) => {
      opts.onSuccess(resp.razorpay_payment_id);
    },
    modal: { ondismiss: () => opts.onDismiss?.() },
  });
  rzp.open();
  return true;
}
