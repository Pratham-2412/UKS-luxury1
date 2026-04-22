import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductBySlug, getAllProducts } from "../../api/productApi";
import { useCart } from "../../context/CartContext";
import ProductGallery from "../../components/shop/ProductGallery";
import ProductCard from "../../components/shop/ProductCard";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  RiShoppingBagLine, RiHeartLine, RiShieldCheckLine,
  RiTruckLine, RiRefreshLine, RiCheckLine,
  RiAddLine, RiSubtractLine, RiArrowLeftLine,
} from "react-icons/ri";

const FALLBACK = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80";

const ProductDetail = () => {
  const { slug }                 = useParams();
  const { addItem, cartLoading } = useCart();
  const [product, setProduct]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [qty, setQty]           = useState(1);
  const [added, setAdded]       = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true); setError(null); setQty(1); setAdded(false);

    getProductBySlug(slug)
      .then(async (res) => {
        const prod = res.data.product || res.data.data;
        setProduct(prod);
        try {
          const rel = await getAllProducts({
            category: prod.category?._id || prod.category || "",
            limit: 4, status: "active",
          });
          const items = rel.data.products || rel.data.data || [];
          setRelated(items.filter((p) => p.slug !== slug).slice(0, 4));
        } catch { /* silent */ }
      })
      .catch((err) => setError(err.response?.status === 404 ? "404" : "error"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    await addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const hasDiscount = product?.salePrice && product.salePrice < product.price;
  const stockStatus = product?.stock === 0 ? "out" : product?.stock <= 5 ? "low" : "in";

  const inputBase = "w-full bg-[#111111] border text-[0.85rem] text-[#f0ece4] px-4 py-3 outline-none transition-colors duration-200 font-sans font-light";

  /* ── Loading ── */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] pt-24">
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[4/3] bg-[#141414] animate-pulse" />
          <div className="flex flex-col gap-4 pt-4">
            {[30, 60, 45, 70, 55, 40].map((w, i) => (
              <div key={i} className="h-3 bg-[#1a1a1a] rounded animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ── Error ── */
  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6 px-6">
        <p className="font-serif italic text-[1.6rem] text-[#5a5550]">
          {error === "404" ? "Product not found." : "Something went wrong."}
        </p>
        <Link to="/shop" className="text-[0.65rem] tracking-[0.15em] uppercase text-[#c4a064] border border-[#c4a064]/30 px-6 py-3 hover:bg-[#c4a064]/8 transition-all duration-200">
          ← Back to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] font-sans">

      {/* ── Hero ── */}
      <section className="relative aspect-[16/7] min-h-[320px] sm:min-h-[420px] overflow-hidden">
        <img
          className="w-full h-full object-cover brightness-50 transition-transform duration-1000 group-hover:scale-105"
          src={product.mainImage || FALLBACK}
          alt={product.name}
          onError={(e) => (e.currentTarget.src = FALLBACK)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-12 sm:pb-16">
           <Link to="/shop" className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.2em] uppercase text-[#c4a064] mb-8 hover:opacity-70 transition-opacity animate-fade-up">
             ← Back to Shop
           </Link>

          <span className="flex items-center gap-3 text-[0.72rem] tracking-[0.28em] uppercase text-[#c4a064] mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="block w-8 h-px bg-[#c4a064] opacity-50" />
            Curated Piece
          </span>
          <h1 className="font-serif text-[clamp(2.2rem,6vw,5rem)] font-light text-white leading-[1.05] mb-4 animate-fade-up" style={{ animationDelay: '0.22s' }}>
            {product.name}
          </h1>
          {product.shortDescription && (
            <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] text-white/80 font-light max-w-[500px] leading-[1.8] animate-fade-up" style={{ animationDelay: '0.38s' }}>
              {product.shortDescription}
            </p>
          )}
        </div>
      </section>

      <div className="pt-16"></div>

      {/* ── Main grid ── */}
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* Gallery */}
        <ProductGallery images={product.gallery || []} mainImage={product.mainImage} />

        {/* Info */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">

          {/* Category + name */}
          {product.category?.name && (
            <span className="text-[0.55rem] tracking-[0.2em] uppercase text-[#c4a064]">
              {product.category.name}
            </span>
          )}
          <h1 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] font-light text-[#f0ece4] leading-[1.15]">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 pb-5 border-b border-white/7">
            {hasDiscount ? (
              <>
                <span className="font-serif text-[1.8rem] font-light text-[#c4a064]">
                  {formatCurrency(product.salePrice)}
                </span>
                <span className="font-serif text-[1.1rem] text-[#5a5550] line-through">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-[0.6rem] tracking-[0.12em] uppercase px-2 py-1 bg-[#c4a064]/12 border border-[#c4a064]/25 text-[#c4a064]">
                  Save {formatCurrency(product.price - product.salePrice)}
                </span>
              </>
            ) : (
              <span className="font-serif text-[1.8rem] font-light text-[#f0ece4]">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.shortDescription && (
            <p className="text-[0.88rem] text-[#a09880] leading-[1.85] font-light">
              {product.shortDescription}
            </p>
          )}

          {/* Specs */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-[0.55rem] tracking-[0.2em] uppercase text-[#5a5550]">
                Specifications
              </span>
              <div className="border border-white/7">
                {Object.entries(product.specifications).map(([key, val], i, arr) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? "border-b border-white/7" : ""}`}
                  >
                    <span className="text-[0.72rem] text-[#5a5550]">{key}</span>
                    <span className="text-[0.82rem] text-[#a09880]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
              stockStatus === "in"  ? "bg-emerald-500" :
              stockStatus === "low" ? "bg-amber-500" : "bg-red-500"
            }`} />
            <span className={`text-[0.72rem] ${
              stockStatus === "in"  ? "text-emerald-400" :
              stockStatus === "low" ? "text-amber-400" : "text-red-400"
            }`}>
              {stockStatus === "in"  && `In Stock (${product.stock} available)`}
              {stockStatus === "low" && `Low Stock — only ${product.stock} left`}
              {stockStatus === "out" && "Out of Stock"}
            </span>
          </div>

          {/* Qty + Add to cart */}
          <div className="flex items-center gap-3 pt-2">
            {/* Qty */}
            <div className="flex items-center border border-white/10">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="w-10 h-12 flex items-center justify-center text-[#5a5550] hover:text-[#c4a064] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border-r border-white/10"
              >
                <RiSubtractLine />
              </button>
              <span className="w-12 text-center text-[0.9rem] text-[#f0ece4]">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                disabled={qty >= (product.stock || 99)}
                className="w-10 h-12 flex items-center justify-center text-[#5a5550] hover:text-[#c4a064] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border-l border-white/10"
              >
                <RiAddLine />
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || product.stock === 0}
              className={`flex-1 h-12 flex items-center justify-center gap-2 text-[0.68rem] tracking-[0.15em] uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                added
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400"
                  : "bg-gradient-to-r from-[#c4a064] to-[#a07840] text-[#0a0a0a] hover:from-[#e8d5a3] hover:to-[#c4a064] hover:-translate-y-0.5"
              }`}
            >
              {added ? <><RiCheckLine /> Added to Cart</> : <><RiShoppingBagLine /> Add to Cart</>}
            </button>

            {/* Wishlist */}
            <button
              aria-label="Add to wishlist"
              className="w-12 h-12 flex items-center justify-center border border-white/10 text-[#5a5550] hover:text-[#c4a064] hover:border-[#c4a064]/30 transition-all duration-200 cursor-pointer flex-shrink-0"
            >
              <RiHeartLine />
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-white/7">
            {[
              { icon: <RiShieldCheckLine />, text: "Secure payment & data protection" },
              { icon: <RiTruckLine />,       text: "Free delivery on orders over £500" },
              { icon: <RiRefreshLine />,     text: "14-day return policy" },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-3 text-[0.72rem] text-[#5a5550]">
                <span className="text-[#c4a064] flex-shrink-0">{t.icon}</span>
                {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Long description ── */}
      {product.longDescription && (
        <div className="border-t border-white/7">
          <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] py-14">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[0.58rem] tracking-[0.22em] uppercase text-[#c4a064]">
                Product Details
              </span>
              <div className="flex-1 h-px bg-white/7" />
            </div>
            <div
              className="text-[0.9rem] text-[#a09880] leading-[1.9] font-light max-w-[720px] [&_h2]:font-serif [&_h2]:text-[#f0ece4] [&_h2]:text-[1.3rem] [&_h2]:font-light [&_h2]:mb-4 [&_p]:mb-4 [&_ul]:list-none [&_li]:flex [&_li]:gap-2 [&_li]:before:content-['—'] [&_li]:before:text-[#c4a064]"
              dangerouslySetInnerHTML={{ __html: product.longDescription }}
            />
          </div>
        </div>
      )}

      {/* ── Related ── */}
      {related.length > 0 && (
        <div className="border-t border-white/7">
          <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] py-14 pb-24">
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[0.62rem] tracking-[0.25em] uppercase text-[#c4a064] font-medium">
                You May Also Like
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default ProductDetail;