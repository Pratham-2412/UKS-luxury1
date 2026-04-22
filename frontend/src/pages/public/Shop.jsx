// src/pages/public/Shop.jsx
import { useState, useEffect, useCallback } from "react";
import { getAllProducts } from "../../api/productApi";
import ProductCard from "../../components/shop/ProductCard";
import ProductFilter from "../../components/shop/ProductFilter";
import {
  RiEqualizerLine, RiArrowLeftLine, RiArrowRightLine,
  RiCloseLine, RiLayoutGridLine, RiLayoutMasonryLine,
} from "react-icons/ri";

const SORT_OPTIONS = [
  { value: "createdAt:-1", label: "Newest First" },
  { value: "price:1",      label: "Price: Low to High" },
  { value: "price:-1",     label: "Price: High to Low" },
  { value: "name:1",       label: "Name: A – Z" },
];

const LIMIT = 12;

const Shop = () => {
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [total, setTotal]                   = useState(0);
  const [page, setPage]                     = useState(1);
  const [sort, setSort]                     = useState("createdAt:-1");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeStyle, setActiveStyle]       = useState("");
  const [activeMaterial, setActiveMaterial] = useState("");
  const [activeFinish, setActiveFinish]     = useState("");
  const [featured, setFeatured]             = useState(false);
  const [minPrice, setMinPrice]             = useState("");
  const [maxPrice, setMaxPrice]             = useState("");
  const [filtersOpen, setFiltersOpen]       = useState(false);
  const [gridCols, setGridCols]             = useState(3); // 2 or 3

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sortField, sortOrder] = sort.split(":");
      const params = {
        page, limit: LIMIT,
        sort: sortField, order: sortOrder,
        status: "active",
      };
      if (activeCategory) params.category = activeCategory;
      if (featured)        params.featured  = true;
      if (minPrice)        params.minPrice  = minPrice;
      if (maxPrice)        params.maxPrice  = maxPrice;
      if (activeStyle)     params.style     = activeStyle;
      if (activeMaterial)  params.material  = activeMaterial;
      if (activeFinish)    params.finish    = activeFinish;

      const res = await getAllProducts(params);
      setProducts(res.data.products || res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      setError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, sort, activeCategory, featured, minPrice, maxPrice, activeStyle, activeMaterial, activeFinish]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    load();
  }, [load]);

  const totalPages = Math.ceil(total / LIMIT);

  const handleCategory = (cat) => { setActiveCategory(cat); setPage(1); };
  const handleFeatured = (val) => { setFeatured(val);        setPage(1); };
  const handlePrice    = (mn, mx) => { setMinPrice(mn); setMaxPrice(mx); setPage(1); };
  const handleStyle    = (val) => { setActiveStyle(val);    setPage(1); };
  const handleMaterial = (val) => { setActiveMaterial(val); setPage(1); };
  const handleFinish   = (val) => { setActiveFinish(val);   setPage(1); };

  const activeFilterCount = [
    activeCategory, activeStyle, activeMaterial, activeFinish,
    featured ? "featured" : "",
    minPrice || maxPrice ? "price" : "",
  ].filter(Boolean).length;

  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  const gridClass = gridCols === 2
    ? "grid-cols-1 sm:grid-cols-2"
    : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] font-sans">

      {/* ── Hero ── */}
      <div className="relative aspect-[16/7] min-h-[320px] sm:min-h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80"
          alt="Our Shop"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-12 sm:pb-16">
          <span className="flex items-center gap-3 text-[0.72rem] tracking-[0.28em] uppercase text-[#c4a064] mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="block w-8 h-px bg-[#c4a064] opacity-50" />
            Curated Collection
          </span>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-light text-white leading-[1.05] mb-4 animate-fade-up" style={{ animationDelay: '0.22s' }}>
            Luxury Pieces <em className="italic text-[#e8d5a3]">Curated</em>
          </h1>
          <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] text-white/80 font-light max-w-[500px] leading-[1.8] animate-fade-up" style={{ animationDelay: '0.38s' }}>
            European craftsmanship brought to your doorstep. Browse our
            curated selection of bespoke furniture and interior pieces.
          </p>
        </div>
      </div>

      {/* ── Layout ── */}
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] py-10 pb-24 flex gap-10 items-start">

        {/* Sidebar overlay — mobile */}
        <div
          onClick={() => setFiltersOpen(false)}
          className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ${
            filtersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-[290px] bg-[#0f0f0f] border-r border-white/7 z-50 overflow-y-auto transition-transform duration-400 lg:static lg:translate-x-0 lg:h-auto lg:w-[240px] lg:flex-shrink-0 lg:bg-transparent lg:border-0 lg:z-auto ${
            filtersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/7 lg:hidden">
            <span className="text-[0.62rem] tracking-[0.18em] uppercase text-[#c4a064]">Filters</span>
            <button
              onClick={() => setFiltersOpen(false)}
              className="text-white/50 hover:text-white cursor-pointer"
            >
              <RiCloseLine className="text-xl" />
            </button>
          </div>

          <ProductFilter
            activeCategory={activeCategory} onCategory={handleCategory}
            activeStyle={activeStyle}       onStyle={handleStyle}
            activeMaterial={activeMaterial} onMaterial={handleMaterial}
            activeFinish={activeFinish}     onFinish={handleFinish}
            featured={featured}             onFeatured={handleFeatured}
            minPrice={minPrice}             maxPrice={maxPrice}
            onPriceApply={handlePrice}
          />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* ── Toolbar ── */}
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/7">
            <div className="flex items-center gap-4">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFiltersOpen((p) => !p)}
                className="lg:hidden inline-flex items-center gap-2 text-[0.65rem] tracking-[0.15em] uppercase text-[#a09880] border border-white/10 px-4 py-2.5 hover:text-[#c4a064] hover:border-[#c4a064]/30 transition-all duration-200 cursor-pointer"
              >
                <RiEqualizerLine />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 flex items-center justify-center bg-[#c4a064] text-[#0a0a0a] text-[0.5rem] rounded-full font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <p className="text-[0.78rem] text-[#5a5550]">
                <span className="text-[#f0ece4] font-normal">{total}</span> pieces
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Grid toggle — desktop */}
              <div className="hidden lg:flex items-center border border-white/10">
                <button
                  onClick={() => setGridCols(2)}
                  className={`w-8 h-8 flex items-center justify-center transition-colors duration-150 cursor-pointer ${
                    gridCols === 2 ? "text-[#c4a064] bg-[#c4a064]/8" : "text-[#5a5550] hover:text-[#a09880]"
                  }`}
                >
                  <RiLayoutMasonryLine className="text-sm" />
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  className={`w-8 h-8 flex items-center justify-center border-l border-white/10 transition-colors duration-150 cursor-pointer ${
                    gridCols === 3 ? "text-[#c4a064] bg-[#c4a064]/8" : "text-[#5a5550] hover:text-[#a09880]"
                  }`}
                >
                  <RiLayoutGridLine className="text-sm" />
                </button>
              </div>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="bg-[#111111] border border-white/10 text-[0.72rem] text-[#a09880] px-4 py-2.5 outline-none focus:border-[#c4a064]/40 transition-colors duration-200 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filters bar — desktop quick-clear */}
          {activeFilterCount > 0 && (
            <div className="hidden lg:flex items-center gap-2 flex-wrap -mt-2">
              <span className="text-[0.55rem] tracking-[0.15em] uppercase text-[#5a5550]">Active:</span>
              {activeCategory && (
                <button
                  onClick={() => handleCategory("")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#c4a064]/8 border border-[#c4a064]/25 text-[0.55rem] tracking-[0.1em] uppercase text-[#c4a064] hover:bg-[#c4a064]/15 transition-all duration-150 cursor-pointer"
                >
                  {activeCategory} ×
                </button>
              )}
              {activeStyle && (
                <button
                  onClick={() => handleStyle("")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#c4a064]/8 border border-[#c4a064]/25 text-[0.55rem] tracking-[0.1em] uppercase text-[#c4a064] hover:bg-[#c4a064]/15 transition-all duration-150 cursor-pointer"
                >
                  {activeStyle} ×
                </button>
              )}
              {activeMaterial && (
                <button
                  onClick={() => handleMaterial("")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#c4a064]/8 border border-[#c4a064]/25 text-[0.55rem] tracking-[0.1em] uppercase text-[#c4a064] hover:bg-[#c4a064]/15 transition-all duration-150 cursor-pointer"
                >
                  {activeMaterial} ×
                </button>
              )}
              {featured && (
                <button
                  onClick={() => handleFeatured(false)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#c4a064]/8 border border-[#c4a064]/25 text-[0.55rem] tracking-[0.1em] uppercase text-[#c4a064] hover:bg-[#c4a064]/15 transition-all duration-150 cursor-pointer"
                >
                  Featured ×
                </button>
              )}
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => handlePrice("", "")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#c4a064]/8 border border-[#c4a064]/25 text-[0.55rem] tracking-[0.1em] uppercase text-[#c4a064] hover:bg-[#c4a064]/15 transition-all duration-150 cursor-pointer"
                >
                  £{minPrice || "0"} – £{maxPrice || "∞"} ×
                </button>
              )}
            </div>
          )}

          {error && (
            <p className="text-center py-12 text-[0.85rem] text-[#5a5550]">{error}</p>
          )}

          {/* ── Grid ── */}
          <div className={`grid ${gridClass} gap-8 sm:gap-10 lg:gap-12`}>
            {loading
              ? Array.from({ length: LIMIT }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-5">
                    <div className="aspect-[4/3] rounded-2xl animate-shimmer" />
                    <div className="space-y-3 px-1">
                       <div className="h-2 w-24 rounded bg-white/5 animate-pulse" />
                       <div className="h-5 w-full rounded bg-white/5 animate-pulse" />
                       <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
                    </div>
                  </div>
                ))
              : products.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} />
                ))
            }
            {!loading && !error && products.length === 0 && (
              <p className="col-span-full text-center py-20 font-serif italic text-[1.3rem] text-[#5a5550]">
                No products found. Try adjusting your filters.
              </p>
            )}
          </div>

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-8">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center border border-white/10 text-[#a09880] hover:border-[#c4a064]/40 hover:text-[#c4a064] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <RiArrowLeftLine />
              </button>

              {pageNums.map((p, i) =>
                p === "..." ? (
                  <span key={`d-${i}`} className="w-9 h-9 flex items-center justify-center text-[#5a5550] text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 flex items-center justify-center text-[0.72rem] border transition-all duration-200 cursor-pointer ${
                      p === page
                        ? "border-[#c4a064] text-[#c4a064] bg-[#c4a064]/8"
                        : "border-white/10 text-[#a09880] hover:border-[#c4a064]/30 hover:text-[#c4a064]"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center border border-white/10 text-[#a09880] hover:border-[#c4a064]/40 hover:text-[#c4a064] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <RiArrowRightLine />
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default Shop;