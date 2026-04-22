import { useState, useEffect } from "react";
import { getAllProjects } from "../../api/projectApi";
import ProjectCard from "../../components/projects/ProjectCard";
import ProjectFilter from "../../components/projects/ProjectFilter";

const Projects = () => {
  const [projects, setProjects]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [apiError, setApiError]         = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);
    setApiError(false);

    getAllProjects({ limit: 40 })
      .then((res) => {
        const items = res.data.projects || res.data.data || res.data || [];
        setProjects(Array.isArray(items) ? items : []);
      })
      .catch((err) => {
        console.error("Projects API error:", err);
        setApiError(true);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] font-sans">

      {/* ── Hero ── */}
      <div className="relative aspect-[16/7] min-h-[320px] sm:min-h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600&q=80"
          alt="Our Projects"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-12 sm:pb-16">
          <span className="flex items-center gap-3 text-[0.72rem] tracking-[0.28em] uppercase text-[#c4a064] mb-4">
            <span className="block w-8 h-px bg-[#c4a064] opacity-50" />
            Our Portfolio
          </span>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-light text-white leading-[1.05] mb-4">
            Stories of <em className="italic text-[#e8d5a3]">Transformation</em>
          </h1>
          <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] text-white/80 font-light max-w-[500px] leading-[1.8] animate-fade-up" style={{ animationDelay: '0.38s' }}>
            Every project is a collaboration. Every space, a canvas. Browse our portfolio
            of completed interiors across London and beyond.
          </p>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] py-12 pb-28">

        {/* API error banner */}
        {apiError && (
          <div className="mb-8 px-5 py-4 border border-red-500/20 bg-red-500/5 text-[0.78rem] text-red-400 flex items-center gap-3 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
            Could not connect to the server. Check that your backend is running on port 8000.
          </div>
        )}

        {/* Grid with rounded container and gaps (no gap-px) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">

          {/* Loading skeletons */}
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#111111] rounded-2xl overflow-hidden">
              <div className="aspect-[16/11] bg-[#141414] animate-pulse rounded-2xl" />
            </div>
          ))}

          {/* Real projects */}
          {!loading && projects.map((p, i) => (
            <ProjectCard 
              key={p._id} 
              project={p} 
              index={i} 
            />
          ))}

        </div>

        {/* Empty state */}
        {!loading && !apiError && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="font-serif italic text-[1.5rem] text-[#5a5550]">
              No projects yet.
            </p>
          </div>
        )}

        {/* Project count */}
        {!loading && projects.length > 0 && (
          <p className="text-center mt-12 text-[0.7rem] tracking-[0.14em] uppercase text-[#3a3530]">
            Showing all {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        )}

      </div>
    </main>
  );
};

export default Projects;