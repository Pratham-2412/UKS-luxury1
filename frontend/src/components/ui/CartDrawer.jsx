// src/components/common/CartDrawer.jsx
import { Link } from "react-router-dom";
import {
  RiCloseLine, RiShoppingBagLine, RiArrowRightLine,
  RiDeleteBinLine, RiAddLine, RiSubtractLine,
} from "react-icons/ri";
import { useCart } from "../../context/CartContext";

const CartDrawer = ({ open, onClose }) => {
  const { items, removeFromCart, updateQty, totalItems, totalPrice } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#111111] border-l border-white/7 z-[201] flex flex-col transition-transform duration-500 cubic-bezier(0.16,1,0.3,1) ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/7">
          <div className="flex items-center gap-3">
            <RiShoppingBagLine className="text-[#c4a064] text-xl" />
            <span className="text-[0.7rem] tracking-[0.2em] uppercase text-[#f0ece4]">
              Your Enquiry
            </span>
            {totalItems > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#c4a064] text-[#0a0a0a] text-[0.6rem] flex items-center justify-center font-normal">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center text-[#5a5550] hover:text-[#f0ece4] transition-colors cursor-pointer"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <RiShoppingBagLine className="text-[3rem] text-[#5a5550]/40" />
            <p className="font-serif text-[1.1rem] font-light text-[#f0ece4]">
              Your enquiry list is empty
            </p>
            <p className="text-[0.8rem] text-[#5a5550] leading-[1.7] max-w-[280px]">
              Add products you're interested in and we'll put together a tailored quote.
            </p>
            <button
              onClick={onClose}
              className="mt-2 text-[0.65rem] tracking-[0.18em] uppercase text-[#c4a064] border border-[#c4a064]/30 px-6 py-2.5 hover:bg-[#c4a064]/8 transition-all cursor-pointer"
            >
              <Link to="/shop">Browse Products</Link>
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto py-2 scrollbar-none">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 px-6 py-4 border-b border-white/5">
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-[#141414]">
                    <img
                      src={item.product.mainImage || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=70"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="text-[0.85rem] text-[#f0ece4] font-normal truncate">
                      {item.product.name}
                    </p>
                    {item.options?.finish && (
                      <p className="text-[0.7rem] text-[#5a5550]">Finish: {item.options.finish}</p>
                    )}
                    {item.options?.size && (
                      <p className="text-[0.7rem] text-[#5a5550]">Size: {item.options.size}</p>
                    )}
                    <p className="text-[0.82rem] text-[#c4a064]">
                      {item.product.price
                        ? `From £${(item.product.price * item.qty).toLocaleString()}`
                        : "POA"}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center border border-white/10">
                        <button
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#a09880] hover:text-[#c4a064] transition-colors cursor-pointer"
                        >
                          <RiSubtractLine className="text-xs" />
                        </button>
                        <span className="w-8 text-center text-[0.78rem] text-[#f0ece4]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#a09880] hover:text-[#c4a064] transition-colors cursor-pointer"
                        >
                          <RiAddLine className="text-xs" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        aria-label="Remove"
                        className="text-[#5a5550] hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-white/7 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[0.62rem] tracking-[0.15em] uppercase text-[#5a5550]">
                  Estimated Total
                </span>
                <span className="font-serif text-[1.1rem] font-light text-[#c4a064]">
                  {totalPrice > 0
                    ? `From £${totalPrice.toLocaleString()}`
                    : "Price on Application"}
                </span>
              </div>
              <p className="text-[0.7rem] text-[#5a5550] leading-[1.6]">
                Final pricing is confirmed after your free consultation.
              </p>
              <Link
                to="/checkout"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-[#c4a064] to-[#a07840] text-[#0a0a0a] text-[0.7rem] tracking-[0.15em] uppercase hover:from-[#e8d5a3] hover:to-[#c4a064] transition-all duration-300"
              >
                Proceed to Enquiry <RiArrowRightLine />
              </Link>
              <Link
                to="/cart"
                onClick={onClose}
                className="text-center text-[0.65rem] tracking-[0.15em] uppercase text-[#5a5550] hover:text-[#a09880] transition-colors py-1"
              >
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;