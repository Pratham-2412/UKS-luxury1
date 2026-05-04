import api from "./axios";

// ── Auth ──────────────────────────────────────────────────────────────────
export const adminLogin    = (data) => api.post("/auth/login", data);
export const adminLogout   = ()     => api.post("/auth/logout");
export const getAdminMe    = ()     => api.get("/auth/me");

// ── Dashboard ─────────────────────────────────────────────────────────────
export const getDashboardStats = () => api.get("/admin/stats");

// ── Hero Sections ─────────────────────────────────────────────────────────
export const getHeros      = ()       => api.get("/hero-sections");
export const createHero    = (data)   => api.post("/hero-sections", data);
export const updateHero    = (id, d)  => api.put(`/hero-sections/${id}`, d);
export const deleteHero    = (id)     => api.delete(`/hero-sections/${id}`);

// ── Site Settings ─────────────────────────────────────────────────────────
export const getSettings   = ()     => api.get("/site-settings");
export const updateSettings= (data) => api.put("/site-settings", data);

// ── Collections ───────────────────────────────────────────────────────────
export const getAdminCollections  = (p) => api.get("/collections", { params: { ...p, limit: 100 } });
export const createCollection     = (d) => api.post("/collections", d);
export const updateCollection     = (id, d) => api.put(`/collections/${id}`, d);
export const deleteCollection     = (id)    => api.delete(`/collections/${id}`);

// ── Subcategories ─────────────────────────────────────────────────────────
export const getSubcategories    = (p)    => api.get("/subcategories", { params: p });
export const createSubcategory   = (d)    => api.post("/subcategories", d);
export const updateSubcategory   = (id,d) => api.put(`/subcategories/${id}`, d);
export const deleteSubcategory   = (id)   => api.delete(`/subcategories/${id}`);

// ── Subcategory Items ─────────────────────────────────────────────────────
export const getSubcategoryItems   = (p)    => api.get("/subcategory-items", { params: p });
export const createSubcategoryItem = (d)    => api.post("/subcategory-items", d);
export const updateSubcategoryItem = (id,d) => api.put(`/subcategory-items/${id}`, d);
export const deleteSubcategoryItem = (id)   => api.delete(`/subcategory-items/${id}`);

// ── Projects ──────────────────────────────────────────────────────────────
export const getAdminProjects  = (p) => api.get("/projects", { params: { ...p, limit: 100 } });
export const createProject     = (d) => api.post("/projects", d);
export const updateProject     = (id, d) => api.put(`/projects/${id}`, d);
export const deleteProject     = (id)    => api.delete(`/projects/${id}`);

// ── Categories ────────────────────────────────────────────────────────────
export const getCategories    = ()     => api.get("/categories");
export const createCategory   = (d)    => api.post("/categories", d);
export const updateCategory   = (id,d) => api.put(`/categories/${id}`, d);
export const deleteCategory   = (id)   => api.delete(`/categories/${id}`);

// ── Products ──────────────────────────────────────────────────────────────
export const getAdminProducts  = (p) => api.get("/products", { params: { ...p, limit: 100 } });
export const createProduct     = (d) => api.post("/products", d);
export const updateProduct     = (id, d) => api.put(`/products/${id}`, d);
export const deleteProduct     = (id)    => api.delete(`/products/${id}`);

// ── Offers ────────────────────────────────────────────────────────────────
export const getAdminOffers    = ()     => api.get("/offers/admin/all");
export const createOffer       = (d)    => api.post("/offers", d);
export const updateOffer       = (id,d) => api.put(`/offers/${id}`, d);
export const deleteOffer       = (id)   => api.delete(`/offers/${id}`);

// ── Enquiries ─────────────────────────────────────────────────────────────
export const getEnquiries      = (p)    => api.get("/enquiries", { params: p });
export const getEnquiry        = (id)   => api.get(`/enquiries/${id}`);
export const updateEnquiry     = (id,d) => api.put(`/enquiries/${id}`, d);
export const deleteEnquiry     = (id)   => api.delete(`/enquiries/${id}`);

// ── Orders ────────────────────────────────────────────────────────────────
export const getOrders         = (p)    => api.get("/orders", { params: p });
export const getOrder          = (id)   => api.get(`/orders/${id}`);
export const updateOrderStatus = (id,d) => api.put(`/orders/${id}/status`, d);
export const deleteOrder       = (id)    => api.delete(`/orders/${id}`);

// ── Testimonials ──────────────────────────────────────────────────────────
export const getTestimonials   = ()     => api.get("/testimonials");
export const createTestimonial = (d)    => api.post("/testimonials", d);
export const updateTestimonial = (id,d) => api.put(`/testimonials/${id}`, d);
export const deleteTestimonial = (id)   => api.delete(`/testimonials/${id}`);

// ── Brands ────────────────────────────────────────────────────────────
export const getBrands         = ()     => api.get("/brands");
export const createBrand       = (d)    => api.post("/brands", d);
export const updateBrand       = (id,d) => api.put(`/brands/${id}`, d);
export const deleteBrand       = (id)   => api.delete(`/brands/${id}`);

// ── Upload ────────────────────────────────────────────────────────────────
export const uploadImage  = (formData) =>
  api.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const uploadImages = (formData) =>
  api.post("/upload/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const uploadZip = (formData) =>
  api.post("/upload/zip", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });