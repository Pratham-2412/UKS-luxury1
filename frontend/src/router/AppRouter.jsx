import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";

// Public pages
import Home             from "../pages/public/Home";
import Collections      from "../pages/public/Collections";
import CollectionDetail from "../pages/public/CollectionDetail";
import Projects         from "../pages/public/Projects";
import ProjectDetail    from "../pages/public/ProjectDetail";
import Offers           from "../pages/public/Offers";
import Contact          from "../pages/public/Contact";
import Shop             from "../pages/public/Shop";
import ProductDetail    from "../pages/public/ProductDetail";
import Cart             from "../pages/public/Cart";
import Checkout         from "../pages/public/Checkout";

// Admin pages
import AdminLogin        from "../pages/admin/AdminLogin";
import AdminDashboard    from "../pages/admin/AdminDashboard";
import AdminCollections  from "../pages/admin/AdminCollections";
import AdminProjects     from "../pages/admin/AdminProjects";
import AdminProducts     from "../pages/admin/AdminProducts";
import AdminOffers       from "../pages/admin/AdminOffers";
import AdminInquiries    from "../pages/admin/AdminInquiries";
import AdminOrders       from "../pages/admin/AdminOrders";
import AdminTestimonials from "../pages/admin/AdminTestimonials";
import AdminHero         from "../pages/admin/AdminHero";
import AdminSettings     from "../pages/admin/AdminSettings";
import AdminCategories   from "../pages/admin/AdminCategories";

const AppRouter = () => (
  <Routes>
    {/* Public */}
    <Route element={<Layout />}>
      <Route path="/"                  element={<Home />} />
      <Route path="/collections"       element={<Collections />} />
      <Route path="/collections/:slug" element={<CollectionDetail />} />
      <Route path="/projects"          element={<Projects />} />
      <Route path="/projects/:slug"    element={<ProjectDetail />} />
      <Route path="/offers"            element={<Offers />} />
      <Route path="/contact"           element={<Contact />} />
      <Route path="/shop"              element={<Shop />} />
      <Route path="/shop/:slug"        element={<ProductDetail />} />
      <Route path="/cart"              element={<Cart />} />
      <Route path="/checkout"          element={<Checkout />} />
    </Route>

    {/* Admin Routes */}
    <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
    <Route path="/admin/login" element={<AdminLogin />} />
    
    <Route path="/admin/*" element={<ProtectedRoute />}>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="hero" element={<AdminHero />} />
      <Route path="categories" element={<AdminCategories />} />
      <Route path="collections" element={<AdminCollections />} />
      <Route path="projects" element={<AdminProjects />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="offers" element={<AdminOffers />} />
      <Route path="inquiries" element={<AdminInquiries />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="testimonials" element={<AdminTestimonials />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
  </Routes>
);

export default AppRouter;