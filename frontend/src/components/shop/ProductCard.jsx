// src/components/shop/ProductCard.jsx
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { RiShoppingBagLine, RiHeartLine } from "react-icons/ri";
import { formatCurrency } from "../../utils/formatCurrency";

const FALLBACK = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80";

const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <article
      onClick={() => navigate(`/shop/${product.slug}`)}
      className="group flex flex-col gap-5 cursor-pointer animate-fade-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Image Box */}
      <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-[#111]">
        <img
          src={product.mainImage || FALLBACK}
          alt={product.name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = FALLBACK)}
          className="w-full h-full object-cover brightness-90 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.05] group-hover:brightness-100"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured && (
            <span className="px-3 py-1.5 bg-[#c4a064]/20 backdrop-blur-md border border-[#c4a064]/40 text-[#c4a064] text-[0.52rem] tracking-[0.18em] uppercase rounded-full">
              Featured
            </span>
          )}
          {hasDiscount && (
            <span className="px-3 py-1.5 bg-[#e07070]/20 backdrop-blur-md border border-[#e07070]/40 text-[#e07070] text-[0.52rem] tracking-[0.18em] uppercase rounded-full">
              Sale
            </span>
          )}
        </div>

        {/* Hover Arrow Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <div className="w-12 h-12 flex items-center justify-center border border-white/30 bg-black/40 backdrop-blur-md text-white rounded-full scale-90 group-hover:scale-100 transition-transform duration-500">
              <span className="text-xl">↗</span>
           </div>
        </div>
      </div>

      {/* Content Below */}
      <div className="flex flex-col gap-2.5 px-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[#c4a064] font-medium">
            {product.category?.name || "Bespoke Piece"}
          </span>
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-[1.1rem] font-light text-[#c4a064]">
                  {formatCurrency(product.salePrice)}
                </span>
                <span className="text-[0.75rem] text-white/30 line-through">
                  {formatCurrency(product.price)}
                </span>
              </>
            ) : (
              <span className="text-[1.1rem] font-light text-white/90">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>

        <h3 className="font-serif text-[1.45rem] sm:text-[1.6rem] font-light text-[#f0ece4] leading-tight group-hover:text-[#c4a064] transition-colors duration-300">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-[1rem] text-white/70 leading-relaxed font-light line-clamp-2 max-w-[90%]">
            {product.description}
          </p>
        )}

        <div className="flex items-center gap-4 mt-1">
           <div className="flex flex-col relative w-fit">
             <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#c4a064] font-medium pb-1">
               View Product
             </span>
             <div className="absolute bottom-0 left-0 w-0 h-px bg-[#c4a064] group-hover:w-full transition-all duration-500 ease-out" />
           </div>

           <button
             onClick={handleAdd}
             disabled={product.stock === 0}
             className="ml-auto w-10 h-10 flex items-center justify-center border border-white/10 text-white/60 hover:text-[#c4a064] hover:border-[#c4a064]/40 transition-all duration-300 rounded-full cursor-pointer disabled:opacity-20"
           >
             <RiShoppingBagLine className="text-sm" />
           </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;