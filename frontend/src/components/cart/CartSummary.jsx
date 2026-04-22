import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import {
  RiArrowRightLine, RiShieldCheckLine,
  RiTruckLine, RiRefreshLine,
} from "react-icons/ri";
import { formatCurrency } from "../../utils/formatCurrency";

const CartSummary = ({ showCheckout = true }) => {
  const { cart } = useCart();

  const subtotal = cart.items?.reduce((acc, item) => {
    const price = item.product?.salePrice || item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0) || 0;

  const shipping = subtotal > 500 ? 0 : 49;
  const total    = subtotal + shipping;

  const TRUST = [
    { icon: <RiShieldCheckLine />, text: "Secure SSL checkout" },
    { icon: <RiTruckLine />,       text: "Free delivery over £500" },
    { icon: <RiRefreshLine />,     text: "14-day return policy" },
  ];

  return (
    <div className="border border-white/7 bg-[#111111] sticky top-24">

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/7">
        <span className="text-[0.58rem] tracking-[0.22em] uppercase text-[#c4a064]">
          Order Summary
        </span>
      </div>

      {/* Rows */}
      <div className="px-6 py-5 flex flex-col gap-3 border-b border-white/7">
        <div className="flex items-center justify-between">
          <span className="text-[0.78rem] text-[#5a5550]">
            Subtotal ({cart.items?.length || 0} items)
          </span>
          <span className="text-[0.88rem] text-[#f0ece4]">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[0.78rem] text-[#5a5550]">Delivery</span>
          <span className="text-[0.88rem] text-[#f0ece4]">
            {shipping === 0
              ? <span className="text-[#c4a064]">Free</span>
              : formatCurrency(shipping)
            }
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-[0.65rem] text-[#3a3530] leading-relaxed">
            Add {formatCurrency(500 - subtotal)} more for free delivery
          </p>
        )}
      </div>

      {/* Total */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-white/7">
        <span className="text-[0.62rem] tracking-[0.15em] uppercase text-[#a09880]">
          Total
        </span>
        <span className="font-serif text-[1.4rem] font-light text-[#c4a064]">
          {formatCurrency(total)}
        </span>
      </div>

      {/* CTA */}
      {showCheckout && (
        <div className="px-6 py-5 flex flex-col gap-3 border-b border-white/7">
          <Link
            to="/checkout"
            className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#c4a064] to-[#a07840] text-[#0a0a0a] text-[0.65rem] tracking-[0.15em] uppercase transition-all duration-300 hover:from-[#e8d5a3] hover:to-[#c4a064] hover:-translate-y-0.5"
          >
            Proceed to Checkout
            <RiArrowRightLine />
          </Link>
          <Link
            to="/shop"
            className="text-center text-[0.62rem] tracking-[0.12em] uppercase text-[#5a5550] hover:text-[#c4a064] transition-colors duration-200 py-1"
          >
            ← Continue Shopping
          </Link>
        </div>
      )}

      {/* Trust badges */}
      <div className="px-6 py-5 flex flex-col gap-3">
        {TRUST.map((t) => (
          <div key={t.text} className="flex items-center gap-3 text-[0.72rem] text-[#5a5550]">
            <span className="text-[#c4a064] flex-shrink-0 text-sm">{t.icon}</span>
            {t.text}
          </div>
        ))}
      </div>

    </div>
  );
};

export default CartSummary;