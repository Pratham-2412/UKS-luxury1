import { useSettings } from "../../context/SettingsContext";

const Layout = () => {
  const { pathname } = useLocation();
  const { settings } = useSettings();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    // Update document title and meta description from settings
    if (settings?.seo) {
      document.title = settings.seo.metaTitle || "UKS Luxury Interiors";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", settings.seo.metaDescription || "");
      }
    }
  }, [pathname, settings]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 page-enter">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;