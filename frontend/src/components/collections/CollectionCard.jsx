// src/components/collections/CollectionCard.jsx
import { useNavigate } from "react-router-dom";

const FALLBACK =
  "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80";

const TYPE_LABEL = {
  Kitchen: "Bespoke Kitchen",
  LivingRoom: "Living Room",
  Wardrobe: "Wardrobe",
  Bedroom: "Bedroom",
  Bathroom: "Bathroom",
  HomeOffice: "Home Office",
  DiningRoom: "Dining Room",
  Entryway: "Entryway",
  Outdoor: "Outdoor",
};

const CollectionCard = ({ collection, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <>
    <article
      className="group flex flex-col gap-5 cursor-pointer animate-fade-up"
      onClick={() => {
        // Force redirect to the specialized Bespoke Kitchens landing page if slug matches kitchen terms
        const kSlugs = ["bespoke-kitchens", "kitchens", "kitchen", "modern-kitchens"];
        if (kSlugs.includes(collection.slug)) {
          navigate("/collections/bespoke-kitchens");
        } else {
          navigate(`/collections/${collection.slug}`);
        }
      }}
      style={{ animationDelay: `${0.07 * index}s` }}
    >
        {/* Image Box */}
        <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-[#111]">
          <img
            className="w-full h-full object-cover brightness-90 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.05] group-hover:brightness-100"
            src={collection.thumbnail || collection.image || FALLBACK}
            alt={collection.title}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = FALLBACK)}
          />
          
          {collection.featured && (
            <div className="absolute top-4 right-4">
              <span className="text-[0.55rem] tracking-[0.22em] uppercase px-3 py-1.5 bg-[#c4a064]/20 backdrop-blur-md border border-[#c4a064]/40 text-[#c4a064] rounded-full">
                Featured
              </span>
            </div>
          )}

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
              {TYPE_LABEL[collection.type] || collection.type || "Collection"}
            </span>
          </div>

          <h3 className="font-serif text-[1.45rem] sm:text-[1.6rem] font-light text-[#f0ece4] leading-tight group-hover:text-[#c4a064] transition-colors duration-300">
            {collection.title}
          </h3>

          {collection.shortDescription && (
            <p className="text-[1rem] text-white/70 leading-relaxed font-light line-clamp-2 max-w-[90%]">
              {collection.shortDescription}
            </p>
          )}

          <div className="mt-3">
            <div className="inline-flex flex-col relative">
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#c4a064] font-medium pb-1">
                View Collection
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-px bg-[#c4a064] group-hover:w-full transition-all duration-500 ease-out" />
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default CollectionCard;