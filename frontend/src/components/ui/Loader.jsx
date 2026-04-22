// src/components/ui/Loader.jsx
const Loader = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center gap-8">
        <div className="font-serif text-[2rem] font-light tracking-[0.3em] text-[#c4a064]">
          UKS
        </div>
        <div className="w-48 h-px bg-white/7 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-[#c4a064] to-transparent animate-shimmer w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 rounded-full border border-[#c4a064]/20 border-t-[#c4a064] animate-spin" />
    </div>
  );
};

export default Loader;