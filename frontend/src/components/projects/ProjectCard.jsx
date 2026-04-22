import { useNavigate } from "react-router-dom";

const FALLBACK = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=80";

const ProjectCard = ({ project, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/projects/${project.slug}`)}
      aria-label={`View project: ${project.title}`}
      className="group flex flex-col gap-5 cursor-pointer animate-[fadeUp_0.55s_both]"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Image Box */}
      <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-[#111]">
        <img
          src={project.thumbnail || FALLBACK}
          alt={project.title}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = FALLBACK)}
          className="w-full h-full object-cover brightness-90 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.05] group-hover:brightness-100"
        />
        
        {/* Category Badge */}
        {project.category && (
          <div className="absolute top-4 left-4">
            <span className="text-[0.58rem] tracking-[0.2em] uppercase px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 text-white/80 rounded-full">
              {project.category}
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
          <h3 className="font-serif text-[1.45rem] sm:text-[1.6rem] font-light text-[#f0ece4] leading-tight group-hover:text-[#c4a064] transition-colors duration-300">
            {project.title}
          </h3>
          <span className="text-[0.65rem] tracking-[0.15em] uppercase text-[#5a5550] flex-shrink-0">
            {project.year || ""}
          </span>
        </div>

        {project.shortDescription && (
          <p className="text-[1rem] text-white/70 leading-relaxed font-light line-clamp-2 max-w-[90%]">
            {project.shortDescription}
          </p>
        )}

        <div className="mt-3">
          <div className="inline-flex flex-col relative">
            <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#c4a064] font-medium pb-1">
              Explore Project
            </span>
            <div className="absolute bottom-0 left-0 w-0 h-px bg-[#c4a064] group-hover:w-full transition-all duration-500 ease-out" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;