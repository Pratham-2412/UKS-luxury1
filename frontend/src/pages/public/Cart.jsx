import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import { RiShoppingBagLine } from "react-icons/ri";

const Cart = () => {
  const { cart, cartLoading, emptyCart } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const isEmpty = !cart.items || cart.items.length === 0;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] font-sans">

      {/* ── Hero ── */}
      <div className="relative aspect-[16/7] min-h-[320px] sm:min-h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80"
          alt="Your Cart"
          className="w-full h-full object-cover brightness-[0.45]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-12 sm:pb-16">
          <span className="flex items-center gap-3 text-[0.72rem] tracking-[0.28em] uppercase text-[#c4a064] mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="block w-8 h-px bg-[#c4a064] opacity-50" />
            Your Selection
          </span>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-light text-white leading-[1.05] mb-4 animate-fade-up" style={{ animationDelay: '0.22s' }}>
            {isEmpty
              ? <>Your cart is <em>empty</em></>
              : <>Your <em>Selections</em></>}
          </h1>
          {!isEmpty && (
            <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] text-white/80 font-light max-w-[500px] leading-[1.8] animate-fade-up" style={{ animationDelay: '0.38s' }}>
              You have {cart.items.length} exquisite piece{cart.items.length !== 1 ? "s" : ""} ready for your home.
            </p>
          )}
        </div>
      </div>

      {/* ── Empty state ── */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-6 py-32 px-6 text-center">
          <div className="w-16 h-16 border border-white/10 flex items-center justify-center text-[#5a5550] text-2xl">
            <RiShoppingBagLine />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-[1.6rem] font-light text-[#f0ece4]">
              Nothing here yet
            </h2>
            <p className="text-[0.85rem] text-[#5a5550] max-w-[320px] leading-relaxed">
              Explore our collections and find something you love.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#c4a064] to-[#a07840] text-[#0a0a0a] text-[0.65rem] tracking-[0.15em] uppercase transition-all duration-300 hover:from-[#e8d5a3] hover:to-[#c4a064] hover:-translate-y-0.5"
          >
            Browse the Shop →
          </Link>
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] py-12 pb-24 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-14 items-start">

          {/* Items */}
          <div className="flex flex-col gap-0">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[1fr_100px_140px_40px] gap-4 pb-4 border-b border-white/7 text-[0.55rem] tracking-[0.18em] uppercase text-[#5a5550]">
              <span>Product</span>
              <span className="text-center">Price</span>
              <span className="text-center">Quantity</span>
              <span />
            </div>

            {/* Cart items */}
            <div className="flex flex-col divide-y divide-white/7">
              {cart.items.map((item) => (
                <CartItem key={item.product?._id || item._id} item={item} />
              ))}
            </div>

            {/* Clear cart */}
            <div className="flex justify-end mt-5 pt-5 border-t border-white/7">
              <button
                onClick={emptyCart}
                disabled={cartLoading}
                className="text-[0.6rem] tracking-[0.15em] uppercase text-[#5a5550] border border-white/7 px-4 py-2.5 hover:text-[#c4a064] hover:border-[#c4a064]/25 transition-all duration-200 disabled:opacity-40 cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <CartSummary />
        </div>
      )}
    </main>
  );
};

export default Cart;