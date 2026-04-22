import { useNavigate } from "react-router-dom";

const FALLBACK = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80";

const RelatedProjects = ({ projects = [] }) => {
  const navigate = useNavigate();

  if (!projects.length) return null;

  return (
    <section className="flex flex-col gap-8 pt-16 border-t border-white/7">
      <div className="flex items-center gap-4">
        <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[#c4a064]">
          More Projects
        </span>
        <div className="flex-1 h-px bg-white/7" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {projects.slice(0, 3).map((p, i) => (
          <article
            key={p._id}
            onClick={() => navigate(`/projects/${p.slug}`)}
            className="group relative flex flex-col bg-[#111111] hover:bg-[#141414] transition-colors duration-300 cursor-pointer animate-[fadeUp_0.55s_both] rounded-2xl overflow-hidden"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={p.thumbnail || FALLBACK}
                alt={p.title}
                loading="lazy"
                onError={(e) => (e.currentTarget.src = FALLBACK)}
                className="w-full h-full object-cover brightness-80 transition-transform duration-700 group-hover:scale-[1.06] group-hover:brightness-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c4a064] group-hover:w-full transition-all duration-500 rounded-b-2xl" />
            </div>
            <div className="flex flex-col gap-1.5 p-4 sm:p-5">
              <h4 className="font-serif text-[1.05rem] sm:text-[1.1rem] font-light text-[#f0ece4] group-hover:text-[#c4a064] transition-colors duration-200 leading-snug">
                {p.title}
              </h4>
              {p.category && (
                <span className="text-[0.6rem] sm:text-[0.62rem] tracking-[0.16em] uppercase text-[#5a5550]">
                  {p.category}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RelatedProjects;