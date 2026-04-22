import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { RiDeleteBinLine, RiAddLine, RiSubtractLine } from "react-icons/ri";
import { formatCurrency } from "../../utils/formatCurrency";

const FALLBACK = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80";

const CartItem = ({ item }) => {
  const { removeItem, updateItem, cartLoading } = useCart();

  const product = item.product;
  const price   = product?.salePrice || product?.price || 0;
  const total   = price * item.quantity;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_140px_40px] gap-4 items-center py-6">

      {/* Product info */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 flex-shrink-0 border border-white/7 overflow-hidden">
          <img
            src={product?.mainImage || FALLBACK}
            alt={product?.name}
            onError={(e) => (e.currentTarget.src = FALLBACK)}
            className="w-full h-full object-cover brightness-85"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Link
            to={`/shop/${product?.slug}`}
            className="font-serif text-[1rem] font-light text-[#f0ece4] hover:text-[#c4a064] transition-colors duration-200 leading-snug"
          >
            {product?.name}
          </Link>
          {product?.category?.name && (
            <span className="text-[0.55rem] tracking-[0.14em] uppercase text-[#5a5550]">
              {product.category.name}
            </span>
          )}
          {/* Mobile price */}
          <span className="md:hidden text-[0.85rem] text-[#c4a064] font-serif mt-1">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Unit price */}
      <div className="hidden md:flex items-center justify-center">
        <span className="font-serif text-[0.95rem] text-[#a09880]">
          {formatCurrency(price)}
        </span>
      </div>

      {/* Qty controls */}
      <div className="flex items-center justify-start md:justify-center gap-0 border border-white/10 w-fit">
        <button
          onClick={() => updateItem(product._id, item.quantity - 1)}
          disabled={item.quantity <= 1 || cartLoading}
          className="w-9 h-9 flex items-center justify-center text-[#5a5550] hover:text-[#c4a064] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border-r border-white/10"
        >
          <RiSubtractLine className="text-sm" />
        </button>
        <span className="w-10 text-center text-[0.82rem] text-[#f0ece4] font-sans">
          {item.quantity}
        </span>
        <button
          onClick={() => updateItem(product._id, item.quantity + 1)}
          disabled={cartLoading || item.quantity >= (product?.stock || 99)}
          className="w-9 h-9 flex items-center justify-center text-[#5a5550] hover:text-[#c4a064] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border-l border-white/10"
        >
          <RiAddLine className="text-sm" />
        </button>
      </div>

      {/* Remove */}
      <div className="flex items-center justify-end md:justify-center">
        <button
          onClick={() => removeItem(product._id)}
          disabled={cartLoading}
          aria-label="Remove item"
          className="w-8 h-8 flex items-center justify-center text-[#5a5550] hover:text-red-400 border border-white/7 hover:border-red-400/30 transition-all duration-200 disabled:opacity-40 cursor-pointer"
        >
          <RiDeleteBinLine className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;