import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { createRazorpayOrder, verifyPayment, createOrder } from "../../api/orderApi";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  RiShieldCheckLine, RiCheckLine,
  RiBankCard2Line, RiHomeLine,
} from "react-icons/ri";

const FALLBACK = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=60";

const INITIAL_FORM = {
  firstName: "", lastName: "",
  email: "", phone: "",
  address: "", city: "", postcode: "", country: "GB",
};

const inputBase = "w-full bg-[#0a0a0a] border text-[0.85rem] text-[#f0ece4] placeholder:text-[#3a3530] px-4 py-3 outline-none transition-colors duration-200 font-sans font-light";
const inputNormal = "border-white/10 focus:border-[#c4a064]/40";
const inputError  = "border-red-500/50 focus:border-red-500/60";

const Label = ({ htmlFor, required, children }) => (
  <label htmlFor={htmlFor} className="block text-[0.58rem] tracking-[0.16em] uppercase text-[#5a5550] mb-2">
    {children}{required && <span className="text-[#c4a064] ml-1">*</span>}
  </label>
);

const Checkout = () => {
  const navigate            = useNavigate();
  const { items, clearCart } = useCart();
  const [form, setForm]     = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const subtotal = items?.reduce((acc, item) => {
    const price = item.product?.salePrice || item.product?.price || 0;
    return acc + price * item.qty;
  }, 0) || 0;

  const shipping = subtotal > 500 ? 0 : 49;
  const total    = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim())  errs.lastName  = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Valid email required";
    if (!form.phone.trim())    errs.phone    = "Required";
    if (!form.address.trim())  errs.address  = "Required";
    if (!form.city.trim())     errs.city     = "Required";
    if (!form.postcode.trim()) errs.postcode = "Required";
    return errs;
  };

  const handlePlaceOrder = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data: rzpData } = await createRazorpayOrder({
        amount: Math.round(total * 100), currency: "INR",
      });
      const options = {
        key:         rzpData.key,
        amount:      rzpData.order.amount,
        currency:    "INR",
        name:        "UKS Interiors",
        description: "Luxury Interior Purchase",
        order_id:    rzpData.order.id,
        prefill: {
          name:    `${form.firstName} ${form.lastName}`,
          email:   form.email,
          contact: form.phone,
        },
        theme: { color: "#c4a064" },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            const { data: orderData } = await createOrder({
              items: items.map((item) => ({
                product:   item.product?._id,
                name:      item.product?.name,
                mainImage: item.product?.mainImage,
                qty:       item.qty,
                price:     item.product?.salePrice || item.product?.price,
              })),
              shippingAddress: {
                firstName: form.firstName, lastName: form.lastName,
                address: form.address, city: form.city,
                postcode: form.postcode, country: form.country,
                state: form.state || "N/A",
              },
              contactInfo: { email: form.email, phone: form.phone },
              subtotal, shipping, total,
              paymentMethod: "razorpay",
              paymentStatus: "paid",
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            });
            await clearCart();
            setSuccess(orderData.order);
          } catch {
            alert("Payment verified but order creation failed. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || "Order failed. Please try again.");
      setLoading(false);
    }
  };

  /* ── Success ── */
  if (success) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-6 text-center max-w-[440px]">
          <div className="w-16 h-16 rounded-full border border-[#c4a064]/40 bg-[#c4a064]/10 flex items-center justify-center text-[#c4a064] text-2xl">
            <RiCheckLine />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-[2rem] font-light text-[#f0ece4]">
              Order Confirmed
            </h2>
            <p className="text-[0.85rem] text-[#a09880] leading-[1.8]">
              Thank you for your purchase. We've received your order and will
              be in touch with delivery details shortly.
            </p>
            <p className="text-[0.7rem] tracking-[0.12em] uppercase text-[#5a5550] mt-2">
              Order ID: <span className="text-[#c4a064]">{success._id || success.id}</span>
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#c4a064] to-[#a07840] text-[#0a0a0a] text-[0.65rem] tracking-[0.15em] uppercase transition-all duration-300 hover:from-[#e8d5a3] hover:to-[#c4a064]"
          >
            <RiHomeLine /> Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  /* ── Empty cart ── */
  if (!items || items.length === 0) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-5 px-6">
        <p className="font-serif italic text-[1.6rem] text-[#5a5550]">Your cart is empty.</p>
        <Link to="/shop" className="text-[0.65rem] tracking-[0.15em] uppercase text-[#c4a064] border border-[#c4a064]/30 px-6 py-3 hover:bg-[#c4a064]/8 transition-all duration-200">
          Browse Shop →
        </Link>
      </main>
    );
  }

  const fieldCls = (name) => `${inputBase} ${errors[name] ? inputError : inputNormal}`;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] font-sans">

      {/* ── Header ── */}
      <section className="relative pt-32 pb-10 border-b border-white/7">
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)]">
          <span className="flex items-center gap-3 text-[0.65rem] tracking-[0.28em] uppercase text-[#c4a064] mb-3">
            <span className="block w-7 h-px bg-[#c4a064] flex-shrink-0" />
            Secure Checkout
          </span>
          <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-white">
            Complete Your Order
          </h1>
        </div>
      </section>

      {/* ── Steps ── */}
      <div className="border-b border-white/7">
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] flex items-center gap-0">
          {["Delivery Details", "Payment", "Confirmation"].map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-2.5 px-5 py-4 text-[0.6rem] tracking-[0.14em] uppercase border-b-2 -mb-px ${
                i === 0
                  ? "text-[#c4a064] border-[#c4a064]"
                  : "text-[#3a3530] border-transparent"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.55rem] flex-shrink-0 border ${
                i === 0
                  ? "border-[#c4a064] text-[#c4a064] bg-[#c4a064]/10"
                  : "border-white/15 text-[#3a3530]"
              }`}>
                {i + 1}
              </span>
              <span className="hidden sm:block">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Layout ── */}
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] py-10 pb-24 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-14 items-start">

        {/* Left — forms */}
        <div className="flex flex-col gap-6">

          {/* Delivery section */}
          <div className="border border-white/7 bg-[#111111]">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/7">
              <span className="w-6 h-6 rounded-full border border-[#c4a064]/50 text-[#c4a064] text-[0.6rem] flex items-center justify-center flex-shrink-0">1</span>
              <span className="text-[0.65rem] tracking-[0.18em] uppercase text-[#f0ece4]">Delivery Details</span>
            </div>
            <div className="p-6 flex flex-col gap-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="co-fn" required>First Name</Label>
                  <input id="co-fn" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" className={fieldCls("firstName")} />
                  {errors.firstName && <span className="block mt-1 text-[0.68rem] text-red-400">{errors.firstName}</span>}
                </div>
                <div>
                  <Label htmlFor="co-ln" required>Last Name</Label>
                  <input id="co-ln" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className={fieldCls("lastName")} />
                  {errors.lastName && <span className="block mt-1 text-[0.68rem] text-red-400">{errors.lastName}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="co-em" required>Email</Label>
                  <input id="co-em" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={fieldCls("email")} />
                  {errors.email && <span className="block mt-1 text-[0.68rem] text-red-400">{errors.email}</span>}
                </div>
                <div>
                  <Label htmlFor="co-ph" required>Phone</Label>
                  <input id="co-ph" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+44 7700 000000" className={fieldCls("phone")} />
                  {errors.phone && <span className="block mt-1 text-[0.68rem] text-red-400">{errors.phone}</span>}
                </div>
              </div>

              <div>
                <Label htmlFor="co-addr" required>Address</Label>
                <input id="co-addr" name="address" value={form.address} onChange={handleChange} placeholder="Street address" className={fieldCls("address")} />
                {errors.address && <span className="block mt-1 text-[0.68rem] text-red-400">{errors.address}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="co-city" required>City</Label>
                  <input id="co-city" name="city" value={form.city} onChange={handleChange} placeholder="City" className={fieldCls("city")} />
                  {errors.city && <span className="block mt-1 text-[0.68rem] text-red-400">{errors.city}</span>}
                </div>
                <div>
                  <Label htmlFor="co-pc" required>Postcode</Label>
                  <input id="co-pc" name="postcode" value={form.postcode} onChange={handleChange} placeholder="Postcode" className={fieldCls("postcode")} />
                  {errors.postcode && <span className="block mt-1 text-[0.68rem] text-red-400">{errors.postcode}</span>}
                </div>
              </div>

            </div>
          </div>

          {/* Payment section */}
          <div className="border border-white/7 bg-[#111111]">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/7">
              <span className="w-6 h-6 rounded-full border border-white/20 text-[#5a5550] text-[0.6rem] flex items-center justify-center flex-shrink-0">2</span>
              <span className="text-[0.65rem] tracking-[0.18em] uppercase text-[#f0ece4]">Payment Method</span>
            </div>
            <div className="p-6 flex flex-col gap-4">

              {/* Razorpay option */}
              <div className="flex items-center gap-4 p-4 border border-[#c4a064]/35 bg-[#c4a064]/5 cursor-pointer">
                <div className="w-4 h-4 rounded-full border border-[#c4a064] bg-[#c4a064]/15 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c4a064]" />
                </div>
                <RiBankCard2Line className="text-[#c4a064] flex-shrink-0" />
                <div>
                  <p className="text-[0.8rem] text-[#f0ece4]">Pay with Razorpay</p>
                  <p className="text-[0.68rem] text-[#5a5550]">Cards, UPI, Net Banking, Wallets</p>
                </div>
              </div>

              <div className="flex items-start gap-3 px-4 py-3.5 bg-[#0a0a0a] border border-white/7 text-[0.75rem] text-[#5a5550] leading-relaxed">
                <RiShieldCheckLine className="text-[#c4a064] flex-shrink-0 mt-0.5" />
                Your payment is secured by Razorpay's industry-leading encryption.
              </div>
            </div>
          </div>

        </div>

        {/* Right — summary */}
        <div className="border border-white/7 bg-[#111111] sticky top-24">

          <div className="px-6 py-5 border-b border-white/7">
            <span className="text-[0.58rem] tracking-[0.22em] uppercase text-[#c4a064]">
              Order Summary
            </span>
          </div>

          {/* Items */}
          <div className="px-6 py-4 flex flex-col gap-3 border-b border-white/7 max-h-[240px] overflow-y-auto scrollbar-none">
            {items.map((item) => (
              <div key={item.product?._id} className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0 border border-white/7 overflow-hidden">
                  <img
                    src={item.product?.mainImage || FALLBACK}
                    alt={item.product?.name}
                    onError={(e) => (e.currentTarget.src = FALLBACK)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.78rem] text-[#f0ece4] leading-snug line-clamp-1">{item.product?.name}</p>
                  <p className="text-[0.62rem] text-[#5a5550]">Qty: {item.qty}</p>
                </div>
                <span className="text-[0.82rem] text-[#a09880] flex-shrink-0">
                  {formatCurrency((item.product?.salePrice || item.product?.price || 0) * item.qty)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-6 py-4 flex flex-col gap-2.5 border-b border-white/7">
            <div className="flex items-center justify-between">
              <span className="text-[0.75rem] text-[#5a5550]">Subtotal</span>
              <span className="text-[0.85rem] text-[#f0ece4]">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.75rem] text-[#5a5550]">Delivery</span>
              <span className="text-[0.85rem] text-[#f0ece4]">
                {shipping === 0 ? <span className="text-[#c4a064]">Free</span> : formatCurrency(shipping)}
              </span>
            </div>
          </div>

          <div className="px-6 py-4 flex items-center justify-between border-b border-white/7">
            <span className="text-[0.6rem] tracking-[0.15em] uppercase text-[#a09880]">Total</span>
            <span className="font-serif text-[1.4rem] font-light text-[#c4a064]">{formatCurrency(total)}</span>
          </div>

          <div className="px-6 py-5">
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#c4a064] to-[#a07840] text-[#0a0a0a] text-[0.68rem] tracking-[0.15em] uppercase transition-all duration-300 hover:from-[#e8d5a3] hover:to-[#c4a064] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] animate-bounce [animation-delay:0s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] animate-bounce [animation-delay:0.3s]" />
                </span>
              ) : (
                <>{`Pay ${formatCurrency(total)}`} <RiShieldCheckLine /></>
              )}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Checkout;