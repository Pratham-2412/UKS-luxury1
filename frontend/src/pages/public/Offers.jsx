// src/pages/public/Offers.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllOffers } from "../../api/offerApi";
import { RiTimeLine, RiArrowRightLine } from "react-icons/ri";

const FALLBACK_OFFERS = [
  { _id: "1", title: "Free 3D Design Render", description: "Book a free consultation this month and receive a complimentary 3D design render of your chosen space — worth £500.", discountText: "Free Render", isActive: true, endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80" },
  { _id: "2", title: "Summer Kitchen Offer", description: "10% off all bespoke kitchen installations booked before the end of the summer.", discountText: "10% Off", isActive: true, endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80" },
  { _id: "3", title: "Wardrobe Upgrade Package", description: "Complimentary soft-close hinges and LED interior lighting on all wardrobe orders over £3,000.", discountText: "Free Upgrade", isActive: true, endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=900&q=80" },
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80";

const pad = (n) => String(n).padStart(2, "0");
const getTimeLeft = (endDate) => {
  const diff = new Date(endDate) - Date.now();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
};

const CountdownTimer = ({ endDate }) => {
  const [time, setTime] = useState(() => getTimeLeft(endDate));
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!time) return (
    <span className="text-[0.65rem] tracking-[0.12em] uppercase text-[#5a5550] px-3 py-2 border border-white/7">
      Offer Ended
    </span>
  );

  const urgent = time.d === 0;
  const numCls = `font-serif text-[1.3rem] font-light leading-none ${urgent ? "text-[#e07070]" : "text-[#f0ece4]"}`;

  const Unit = ({ val, label }) => (
    <div className="flex flex-col items-center gap-0.5">
      <span className={numCls}>{pad(val)}</span>
      <span className="text-[0.42rem] tracking-[0.14em] uppercase text-[#5a5550]">{label}</span>
    </div>
  );

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#111] border border-white/7 border-l-2 border-l-[#c4a064]">
      <span className="text-[0.52rem] tracking-[0.14em] uppercase text-[#5a5550] mr-1">Ends in</span>
      {time.d > 0 && <><Unit val={time.d} label="days" /><span className="text-[#c4a064]/50 font-serif text-lg pb-2">:</span></>}
      <Unit val={time.h} label="hrs" />
      <span className="text-[#c4a064]/50 font-serif text-lg pb-2">:</span>
      <Unit val={time.m} label="min" />
      <span className="text-[#c4a064]/50 font-serif text-lg pb-2">:</span>
      <Unit val={time.s} label="sec" />
    </div>
  );
};

const Offers = () => {
  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    getAllOffers()
      .then((res) => setOffers(res.data.offers || []))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, []);

  const data     = offers.length > 0 ? offers : FALLBACK_OFFERS;
  const featured = data[0];
  const rest     = data.slice(1);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] font-sans">

      {/* ── Hero ── */}
      <div className="relative aspect-[16/7] min-h-[320px] sm:min-h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80"
          alt="Exclusive Offers"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-12 sm:pb-16">
          <span className="flex items-center gap-3 text-[0.72rem] tracking-[0.28em] uppercase text-[#c4a064] mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="block w-8 h-px bg-[#c4a064] opacity-50" />
            Special Promotions
          </span>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-light text-white leading-[1.05] mb-4 animate-fade-up" style={{ animationDelay: '0.22s' }}>
            Crafted <em className="italic text-[#e8d5a3]">Value</em>
          </h1>
          <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] text-white/80 font-light max-w-[500px] leading-[1.8] animate-fade-up" style={{ animationDelay: '0.38s' }}>
            Seasonal promotions and exclusive packages from UKS Interiors.
            Every offer is designed to help you get more from your investment.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] py-16 pb-28 flex flex-col gap-16">

        {/* Featured */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-2 border border-white/7 animate-[fadeUp_0.65s_cubic-bezier(0.16,1,0.3,1)_both]">
            {/* Image */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] overflow-hidden">
              <img
                src={featured.image || FALLBACK_IMG}
                alt={featured.title}
                onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                className="w-full h-full object-cover brightness-75 transition-transform duration-700 hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1.5 bg-[#c4a064] text-[#0a0a0a] text-[0.55rem] tracking-[0.18em] uppercase">
                  {featured.discountText || "Exclusive Offer"}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-5 p-8 lg:p-12 bg-[#111111]">
              <span className="text-[0.6rem] tracking-[0.25em] uppercase text-[#c4a064]">
                Featured Offer
              </span>
              <h2 className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-light text-[#f0ece4] leading-[1.2]">
                {featured.title || <>"Transform Your Home<br /><em className="italic text-[#c4a064]">This Season</em>"</>}
              </h2>
              <p className="text-[0.88rem] text-[#a09880] leading-[1.8] font-light">
                {featured.description}
              </p>
              {featured.endDate && (
                <CountdownTimer endDate={featured.endDate} />
              )}
              <div className="flex items-center gap-4 flex-wrap pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#c4a064] to-[#a07840] text-[#0a0a0a] text-[0.68rem] tracking-[0.15em] uppercase transition-all duration-300 hover:from-[#e8d5a3] hover:to-[#c4a064] hover:-translate-y-0.5"
                >
                  Claim This Offer <RiArrowRightLine />
                </Link>
              </div>
              <div className="flex items-center gap-2 text-[0.7rem] text-[#5a5550]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c4a064] flex-shrink-0" />
                No obligation. Free design consultation included.
              </div>
            </div>
          </div>
        )}

        {/* More offers */}
        {rest.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[0.58rem] tracking-[0.22em] uppercase text-[#c4a064]">More Offers</span>
              <div className="flex-1 h-px bg-white/7" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
              {rest.map((offer, i) => (
                <div
                  key={offer._id}
                  className="group flex flex-col cursor-pointer animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {/* Image Box */}
                  <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-[#111]">
                    <img
                      src={offer.image || FALLBACK_IMG}
                      alt={offer.title}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                      className="w-full h-full object-cover brightness-90 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.05] group-hover:brightness-100"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 text-[0.55rem] tracking-[0.18em] uppercase rounded-full backdrop-blur-md border border-white/10 ${offer.isActive ? "bg-[#c4a064]/20 text-[#c4a064]" : "bg-[#333]/20 text-[#5a5550]"}`}>
                        {offer.discountText || "Offer"}
                      </span>
                    </div>

                    {/* Hover Arrow Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                       <div className="w-12 h-12 flex items-center justify-center border border-white/30 bg-black/40 backdrop-blur-md text-white rounded-full scale-90 group-hover:scale-100 transition-transform duration-500">
                          <span className="text-xl">↗</span>
                       </div>
                    </div>
                  </div>

                  {/* Content Below */}
                  <div className="flex flex-col gap-3 mt-6 px-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-serif text-[1.45rem] sm:text-[1.6rem] font-light text-[#f0ece4] leading-tight group-hover:text-[#c4a064] transition-colors duration-300">
                        {offer.title}
                      </h3>
                    </div>

                    {offer.description && (
                      <p className="text-[1rem] text-white/70 leading-relaxed font-light line-clamp-2 max-w-[90%]">
                        {offer.description}
                      </p>
                    )}

                    <div className="flex flex-col gap-4 mt-2">
                       {offer.endDate && (
                         <div className="flex items-center gap-2 text-[0.65rem] tracking-[0.1em] text-[#5a5550] uppercase font-medium">
                           <RiTimeLine className="text-[#c4a064]" />
                           Expires {formatDate(offer.endDate)}
                         </div>
                       )}

                       <div className="flex flex-col relative w-fit">
                         <Link to="/contact" className="text-[0.65rem] tracking-[0.18em] uppercase text-[#c4a064] font-medium pb-1">
                           Claim Offer
                         </Link>
                         <div className="absolute bottom-0 left-0 w-0 h-px bg-[#c4a064] group-hover:w-full transition-all duration-500 ease-out" />
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && data.length === 0 && (
          <p className="text-center py-20 font-serif italic text-[1.4rem] text-[#5a5550]">
            No active offers at the moment. Check back soon.
          </p>
        )}

      </div>
    </main>
  );
};

export default Offers;