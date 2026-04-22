import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { S } from "../../components/admin/adminStyles";
import {
  getAdminProducts, createProduct, updateProduct,
  deleteProduct, getCategories, createCategory, uploadImage,
} from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiImageAddLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import { formatCurrency } from "../../utils/formatCurrency";

const EMPTY = {
  name: "", slug: "", shortDescription: "", longDescription: "",
  mainImage: "", gallery: [], category: "", price: "",
  salePrice: "", stock: "", featured: false, recommended: false,
  status: "active", specifications: "",
};

// Fixed shop categories — always shown regardless of DB
const DEFAULT_CATEGORIES = [
  "Hobs", "Ovens", "Quooker", "Kitchen Sinks", "Hoods",
  "Accessories", "Coffee Machines", "Microwaves", "Warming Drawers", "Dishwashers",
];

// Handles any response shape from /categories
const extractCategories = (data) => {
  if (Array.isArray(data))                   return data;
  if (Array.isArray(data?.categories))       return data.categories;
  if (Array.isArray(data?.data?.categories)) return data.data.categories;
  if (Array.isArray(data?.data))             return data.data;
  return [];
};

const AdminProducts = () => {
  const [items, setItems]               = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [modal, setModal]               = useState(false);
  const [editing, setEditing]           = useState(null);
  const [form, setForm]                 = useState(EMPTY);
  const [saving, setSaving]             = useState(false);
  const [galleryInput, setGalleryInput] = useState("");
  const [imgUploading, setImgUploading] = useState(false);

  // ── inline add-category state ──
  const [addingCat, setAddingCat]   = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [savingCat, setSavingCat]   = useState(false);

  // Merge DB categories with DEFAULT_CATEGORIES (no duplicates by name)
  const mergeCategories = (dbCats) => {
    const dbNames = dbCats.map((c) => c.name.toLowerCase());
    const extras = DEFAULT_CATEGORIES
      .filter((name) => !dbNames.includes(name.toLowerCase()))
      .map((name) => ({ _id: name, name })); // use name as id for defaults
    return [...dbCats, ...extras];
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      const arr = extractCategories(res.data);
      const merged = mergeCategories(arr);
      setCategories(merged);
      return merged;
    } catch {
      // Even if API fails, show default categories
      const defaults = DEFAULT_CATEGORIES.map((name) => ({ _id: name, name }));
      setCategories(defaults);
      return defaults;
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const [prodRes] = await Promise.all([
        getAdminProducts(),
        loadCategories(),
      ]);
      const raw = prodRes.data.products ?? prodRes.data.data ?? prodRes.data;
      setItems(Array.isArray(raw) ? raw : []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setGalleryInput("");
    setAddingCat(false);
    setNewCatName("");
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name:             item.name  || "",
      slug:             item.slug  || "",
      shortDescription: item.shortDescription || "",
      longDescription:  item.longDescription  || "",
      mainImage:        item.mainImage  || "",
      gallery:          item.gallery    || [],
      category:         item.category?._id || item.category || "",
      price:            item.price     || "",
      salePrice:        item.salePrice || "",
      stock:            item.stock     || "",
      featured:         item.featured  || false,
      recommended:      item.recommended || false,
      status:           item.status    || "active",
      specifications:   item.specifications
        ? JSON.stringify(item.specifications, null, 2)
        : "",
    });
    setGalleryInput((item.gallery || []).join("\n"));
    setAddingCat(false);
    setNewCatName("");
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (name === "name" && !editing) {
      setForm((p) => ({
        ...p, name: value,
        slug: value.toLowerCase().trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-"),
      }));
    }
  };

  const handleImgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await uploadImage(fd);
      setForm((p) => ({ ...p, mainImage: res.data.url || res.data.data?.url }));
      toast.success("Uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setImgUploading(false); }
  };

  // ── Create new category inline then auto-select it ──
  const handleSaveNewCategory = async () => {
    if (!newCatName.trim()) { toast.error("Category name is required"); return; }
    setSavingCat(true);
    try {
      const res     = await createCategory({ name: newCatName.trim() });
      const created = res.data?.category ?? res.data?.data ?? res.data;
      const newId   = created?._id ?? created?.id ?? "";
      const updated = await loadCategories();
      const selectId = newId || updated.find(
        (c) => c.name.toLowerCase() === newCatName.trim().toLowerCase()
      )?._id || "";
      if (selectId) setForm((p) => ({ ...p, category: selectId }));
      toast.success(`"${newCatName.trim()}" added`);
      setNewCatName("");
      setAddingCat(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally { setSavingCat(false); }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error("Name and Price are required");
      return;
    }
    setSaving(true);
    try {
      let specs = undefined;
      if (form.specifications.trim()) {
        try { specs = JSON.parse(form.specifications); }
        catch { toast.error("Specifications must be valid JSON"); setSaving(false); return; }
      }
      const payload = {
        ...form,
        category:  form.category || null,
        price:     Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        stock:     Number(form.stock) || 0,
        gallery:   galleryInput.split("\n").map((s) => s.trim()).filter(Boolean),
        specifications: specs,
      };
      if (editing) {
        await updateProduct(editing._id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success("Deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout
      title="Products"
      actions={
        <button style={S.btnGold} onClick={openCreate}>
          <RiAddLine /> Add Product
        </button>
      }
    >
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Image","Name","Category","Price","Stock","Status","Featured","Actions"].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ ...S.td, textAlign: "center", padding: "3rem" }}>Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} style={{ ...S.td, textAlign: "center", padding: "3rem", fontStyle: "italic" }}>
                  No products yet.
                </td></tr>
              ) : items.map((item) => (
                <tr key={item._id}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={S.td}>
                    {item.mainImage
                      ? <img src={item.mainImage} alt="" style={{ width: "52px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                      : <div style={{ width: "52px", height: "40px", background: "#1a1a1a", borderRadius: "4px" }} />
                    }
                  </td>
                  <td style={{ ...S.td, color: "#f0ece4", fontWeight: 400, maxWidth: "200px" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                    <span style={{ fontSize: "0.7rem", color: "#5a5550" }}>/{item.slug}</span>
                  </td>
                  <td style={S.td}>{item.category?.name || "—"}</td>
                  <td style={S.td}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "#c4a064" }}>
                      {formatCurrency(item.salePrice || item.price)}
                    </div>
                    {item.salePrice && item.salePrice < item.price && (
                      <div style={{ fontSize: "0.72rem", color: "#5a5550", textDecoration: "line-through" }}>
                        {formatCurrency(item.price)}
                      </div>
                    )}
                  </td>
                  <td style={S.td}>
                    <span style={S.badge(
                      item.stock === 0 ? "red" :
                      item.stock <= 5  ? "gold" : "green"
                    )}>{item.stock}</span>
                  </td>
                  <td style={S.td}>
                    <span style={S.badge(item.status === "active" ? "green" : "gray")}>{item.status}</span>
                  </td>
                  <td style={S.td}>
                    <span style={S.badge(item.featured ? "gold" : "gray")}>
                      {item.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button style={S.btnOutline} onClick={() => openEdit(item)}><RiEditLine /></button>
                      <button style={S.btnDanger} onClick={() => handleDelete(item._id, item.name)}><RiDeleteBinLine /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Edit Product" : "Add Product"}
        size="xl"
      >
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="product-slug" style={S.input} />
          </div>
        </div>

        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Category</label>

            {/* ── Dropdown: DB categories merged with default shop categories ── */}
            <select name="category" value={form.category} onChange={handleChange} style={S.select}>
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            {/* ── Inline add new category ── */}
            {!addingCat ? (
              <button
                onClick={() => setAddingCat(true)}
                style={{
                  marginTop: "0.45rem",
                  display: "inline-flex", alignItems: "center", gap: "0.3rem",
                  background: "transparent", border: "none", padding: 0,
                  color: "#c4a064", fontSize: "0.7rem",
                  letterSpacing: "0.08em", cursor: "pointer",
                }}
              >
                <RiAddLine /> Add New Category
              </button>
            ) : (
              <div style={{ marginTop: "0.45rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <input
                  autoFocus
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")  handleSaveNewCategory();
                    if (e.key === "Escape") { setAddingCat(false); setNewCatName(""); }
                  }}
                  placeholder="Category name…"
                  style={{ ...S.input, flex: 1, padding: "0.38rem 0.6rem", fontSize: "0.78rem" }}
                />
                <button
                  onClick={handleSaveNewCategory}
                  disabled={savingCat}
                  style={{
                    width: "28px", height: "28px", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(196,160,100,0.12)",
                    border: "1px solid rgba(196,160,100,0.35)",
                    color: "#c4a064", borderRadius: "4px", cursor: "pointer",
                  }}
                >
                  {savingCat ? "…" : <RiCheckLine />}
                </button>
                <button
                  onClick={() => { setAddingCat(false); setNewCatName(""); }}
                  style={{
                    width: "28px", height: "28px", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#5a5550", borderRadius: "4px", cursor: "pointer",
                  }}
                >
                  <RiCloseLine />
                </button>
              </div>
            )}
          </div>

          <div style={S.field}>
            <label style={S.label}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} style={S.select}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Price (£) *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Sale Price (£)</label>
            <input name="salePrice" type="number" value={form.salePrice} onChange={handleChange} placeholder="Leave blank if no sale" style={S.input} />
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Stock Quantity</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" style={S.input} />
        </div>

        <div style={S.field}>
          <label style={S.label}>Short Description</label>
          <input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief product summary" style={S.input} />
        </div>

        <div style={S.field}>
          <label style={S.label}>Long Description (HTML supported)</label>
          <textarea name="longDescription" value={form.longDescription} onChange={handleChange} placeholder="Full product description…" style={{ ...S.textarea, minHeight: "120px" }} />
        </div>

        <div style={S.field}>
          <label style={S.label}>Main Image</label>
          <input name="mainImage" value={form.mainImage} onChange={handleChange} placeholder="Image URL" style={{ ...S.input, marginBottom: "0.5rem" }} />
          <label style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            padding: "0.5rem 1rem",
            background: "rgba(196,160,100,0.08)",
            border: "1px dashed rgba(196,160,100,0.3)",
            borderRadius: "4px", fontSize: "0.72rem", color: "#c4a064", cursor: "pointer",
          }}>
            <RiImageAddLine />
            {imgUploading ? "Uploading…" : "Upload Image"}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImgUpload} disabled={imgUploading} />
          </label>
          {form.mainImage && (
            <img src={form.mainImage} alt="" style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "4px", marginTop: "0.5rem" }} />
          )}
        </div>

        <div style={S.field}>
          <label style={S.label}>Gallery Images (one URL per line)</label>
          <textarea
            value={galleryInput}
            onChange={(e) => setGalleryInput(e.target.value)}
            placeholder={"https://…/img1.jpg\nhttps://…/img2.jpg"}
            style={{ ...S.textarea, minHeight: "80px", fontFamily: "monospace", fontSize: "0.78rem" }}
          />
        </div>

        <div style={S.field}>
          <label style={S.label}>Specifications (JSON format)</label>
          <textarea
            name="specifications"
            value={form.specifications}
            onChange={handleChange}
            placeholder={'{\n  "Material": "Solid Oak",\n  "Dimensions": "200 x 90 x 220 cm"\n}'}
            style={{ ...S.textarea, minHeight: "100px", fontFamily: "monospace", fontSize: "0.78rem" }}
          />
        </div>

        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} style={{ accentColor: "#c4a064" }} />
            <span style={{ ...S.label, marginBottom: 0 }}>Featured</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
            <input type="checkbox" name="recommended" checked={form.recommended} onChange={handleChange} style={{ accentColor: "#c4a064" }} />
            <span style={{ ...S.label, marginBottom: 0 }}>Recommended</span>
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button style={S.btnOutline} onClick={() => setModal(false)}>Cancel</button>
          <button style={S.btnGold} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : editing ? "Update Product" : "Create Product"}
          </button>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminProducts;