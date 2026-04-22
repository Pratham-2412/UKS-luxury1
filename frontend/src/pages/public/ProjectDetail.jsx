import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectBySlug } from "../../api/projectApi";
import ProjectGallery from "../../components/projects/ProjectGallery";
import RelatedProjects from "../../components/projects/RelatedProjects";
import { RiMapPinLine, RiArrowLeftLine } from "react-icons/ri";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80";

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);
    setError(null);

    getProjectBySlug(slug)
      .then((res) => {
        // Backend sends: { success, data: project, related: [...] }
        const proj = res.data.data || res.data.project;
        const rel  = res.data.related || [];
        setProject(proj);
        setRelated(rel.filter((p) => p.slug !== slug).slice(0, 3));
      })
      .catch((err) => setError(err.response?.status === 404 ? "404" : "error"))
      .finally(() => setLoading(false));
  }, [slug]);

  /* ── Loading ── */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a]">
        <div className="aspect-[16/7] bg-[#141414] animate-pulse" />
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] py-16 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          <div className="space-y-4">
            <div className="h-4 w-[30%] bg-[#1a1a1a] rounded animate-pulse" />
            <div className="h-8 w-[60%] bg-[#1a1a1a] rounded animate-pulse" />
            <div className="h-3 w-full bg-[#1a1a1a] rounded animate-pulse" />
            <div className="h-3 w-[85%] bg-[#1a1a1a] rounded animate-pulse" />
          </div>
          <div className="h-48 bg-[#1a1a1a] rounded animate-pulse" />
        </div>
      </main>
    );
  }

  /* ── Error ── */
  if (error || !project) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6 px-6">
        <p className="font-serif italic text-[1.6rem] text-[#5a5550]">
          {error === "404" ? "Project not found." : "Something went wrong."}
        </p>
        <Link
          to="/projects"
          className="text-[0.72rem] tracking-[0.15em] uppercase text-[#c4a064] border border-[#c4a064]/30 px-6 py-3 hover:bg-[#c4a064]/8 transition-all duration-200 rounded-full"
        >
          ← All Projects
        </Link>
      </main>
    );
  }

  const gallery = project.galleryImages || project.gallery || [];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] font-sans">

      {/* ── Hero image ── */}
      <div className="relative aspect-[16/7] min-h-[280px] sm:min-h-[360px] overflow-hidden">
        <img
          src={project.thumbnail || FALLBACK_IMG}
          alt={project.title}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
          className="w-full h-full object-cover brightness-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-transparent" />

        {/* Tags */}
        <div className="absolute top-6 sm:top-8 left-[clamp(1.5rem,5vw,5rem)] flex items-center gap-2 flex-wrap">
          {project.category && (
            <span className="text-[0.58rem] sm:text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1 border border-[#c4a064]/50 text-[#c4a064] bg-black/30 backdrop-blur-sm rounded-full">
              {project.category}
            </span>
          )}
          {project.style && (
            <span className="text-[0.58rem] sm:text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1 border border-white/20 text-white/60 bg-black/30 backdrop-blur-sm rounded-full">
              {project.style}
            </span>
          )}
        </div>

        {/* Title over image */}
        <div className="absolute bottom-0 left-0 right-0 max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-10 sm:pb-14">
          <h1 className="font-serif text-[clamp(2rem,5vw,4rem)] font-light text-white leading-[1.1] mb-3">
            {project.title}
          </h1>
          {project.shortDescription && (
            <p className="text-[clamp(0.88rem,1.5vw,1.05rem)] text-white/60 font-light max-w-[500px] leading-[1.7]">
              {project.shortDescription}
            </p>
          )}
        </div>
      </div>

      {/* ── Back link ── */}
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pt-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.15em] uppercase text-[#5a5550] hover:text-[#c4a064] transition-colors duration-200"
        >
          <RiArrowLeftLine />
          All Projects
        </Link>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-16">

        {/* Left — description + gallery */}
        <div className="flex flex-col gap-10 sm:gap-12">
          {project.longDescription && (
            <div
              className="prose-custom text-[0.96rem] sm:text-[1rem] text-[#a09880] leading-[1.9] font-light [&_h2]:font-serif [&_h2]:text-[#f0ece4] [&_h2]:text-[1.5rem] [&_h2]:font-light [&_h2]:mb-4 [&_p]:mb-4 [&_ul]:list-none [&_ul]:pl-0 [&_li]:flex [&_li]:gap-2 [&_li]:before:content-['—'] [&_li]:before:text-[#c4a064] [&_li]:before:flex-shrink-0"
              dangerouslySetInnerHTML={{ __html: project.longDescription }}
            />
          )}

          {gallery.length > 0 && (
            <ProjectGallery images={gallery} />
          )}
        </div>

        {/* Right — sidebar */}
        <aside className="flex flex-col gap-5 sm:gap-6 lg:sticky lg:top-8 lg:self-start">
          {/* Details card */}
          <div className="border border-white/10 bg-[#111111] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/7">
              <span className="text-[0.62rem] tracking-[0.2em] uppercase text-[#c4a064]">
                Project Details
              </span>
            </div>
            <div className="flex flex-col">
              {[
                project.location && { key: "Location", val: project.location },
                project.year     && { key: "Year",     val: project.year },
                project.style    && { key: "Style",    val: project.style },
                project.category && { key: "Category", val: project.category },
              ].filter(Boolean).map((row, i, arr) => (
                <div
                  key={row.key}
                  className={`flex items-start justify-between gap-4 px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-white/7" : ""}`}
                >
                  <span className="text-[0.64rem] tracking-[0.14em] uppercase text-[#5a5550] flex-shrink-0">
                    {row.key}
                  </span>
                  <span className="text-[0.88rem] text-[#a09880] text-right">{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location pill */}
          {project.location && (
            <div className="flex items-center gap-2 text-[0.8rem] text-[#5a5550]">
              <RiMapPinLine className="text-[#c4a064] flex-shrink-0" />
              {project.location}
            </div>
          )}

          {/* CTA */}
          <Link
            to="/contact"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#c4a064] to-[#a07840] text-[#0a0a0a] text-[0.7rem] tracking-[0.15em] uppercase transition-all duration-300 hover:from-[#e8d5a3] hover:to-[#c4a064] hover:-translate-y-0.5 rounded-xl font-medium"
          >
            Start a Similar Project
          </Link>

          <p className="text-[0.72rem] text-[#3a3530] text-center leading-relaxed">
            Free consultation • No obligation
          </p>
        </aside>
      </div>

      {/* ── Related ── */}
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-24">
        <RelatedProjects projects={related} />
      </div>

    </main>
  );
};

export default ProjectDetail;