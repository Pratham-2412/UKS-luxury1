import { useState, useEffect } from "react";
import AdminModal from "../../../components/admin/AdminModal";
import { S } from "../../../components/admin/adminStyles";
import { getAdminCollections, createCollection, updateCollection, deleteCollection, uploadImage } from "../../../api/adminApi";
import toast from "react-hot-toast";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiImageAddLine, RiFolderOpenLine } from "react-icons/ri";

const COLLECTION_TYPES = [
  "Bespoke Kitchens","Dining Rooms","Living Room","Offices",
  "Bookcases","Hinged Wardrobes","Sliding Wardrobes",
  "Walk In Closet","Storage Units",
];
const STATUS_OPTIONS = ["active","inactive","draft"];
const EMPTY = { title: "", slug: "", type: "", shortDescription: "", longDescription: "", thumbnail: "", bannerImage: "", gallery: [], featured: false, status: "active", order: 0 };

const CollectionsList = ({ onManageBrands }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [galleryInput, setGalleryInput] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAdminCollections();
      setItems(res.data.data || res.data.collections || []);
    } catch { toast.error("Failed to load collections"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setGalleryInput(""); setModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...EMPTY, ...item });
    setGalleryInput((item.gallery || []).join("\n"));
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (name === "title" && !editing) {
      setForm((p) => ({ ...p, title: value, slug: value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") }));
    }
  };

  const handleImgUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await uploadImage(fd);
      const url = res.data.url || res.data.data?.url;
      setForm((p) => ({ ...p, [field]: url }));
      toast.success("Image uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setImgUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title || !form.type) return toast.error("Title and Type are required");
    setSaving(true);
    try {
      const payload = { ...form, gallery: galleryInput.split("\n").map((s) => s.trim()).filter(Boolean) };
      if (editing) await updateCollection(editing._id, payload);
      else await createCollection(payload);
      toast.success(editing ? "Collection updated" : "Collection created");
      setModal(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || "Save failed"); } 
    finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteCollection(id);
      toast.success("Deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#f0ece4", margin: 0, fontWeight: 400 }}>Collections</h2>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#a09880", marginTop: "0.2rem" }}>Manage top-level collection types</p>
        </div>
        <button style={S.btnGold} onClick={openCreate}><RiAddLine /> Add Collection</button>
      </div>

      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Thumbnail</th>
                <th style={S.th}>Title</th>
                <th style={S.th}>Type</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Hierarchy</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", padding: "3rem" }}>Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", padding: "3rem", fontStyle: "italic" }}>No collections yet. Click "Add Collection" to create one.</td></tr>
              ) : items.map((item) => (
                <tr key={item._id} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={S.td}>
                    {item.thumbnail ? <img src={item.thumbnail} alt={item.title} style={{ width: "52px", height: "40px", objectFit: "cover", borderRadius: "4px" }} /> : <div style={{ width: "52px", height: "40px", background: "#1a1a1a", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "#3a3530" }}><RiImageAddLine /></div>}
                  </td>
                  <td style={{ ...S.td, color: "#f0ece4", fontWeight: 400 }}>{item.title}<br /><span style={{ fontSize: "0.7rem", color: "#5a5550" }}>/{item.slug}</span></td>
                  <td style={S.td}>{item.type}</td>
                  <td style={S.td}><span style={S.badge(item.status === "active" ? "green" : item.status === "draft" ? "gold" : "gray")}>{item.status}</span></td>
                  <td style={S.td}>
                    <button style={{ ...S.btnOutline, background: "rgba(196,160,100,0.1)", borderColor: "#c4a064", color: "#c4a064", fontSize: "0.75rem", padding: "0.4rem 0.8rem" }} onClick={() => onManageBrands(item)}>
                      <RiFolderOpenLine /> Manage Brands
                    </button>
                  </td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button style={S.btnOutline} onClick={() => openEdit(item)}><RiEditLine /></button>
                      <button style={S.btnDanger} onClick={() => handleDelete(item._id, item.title)}><RiDeleteBinLine /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Collection" : "Add Collection"} size="lg">
        <div style={S.row}>
          <div style={S.field}><label style={S.label}>Title *</label><input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Mayfair Kitchen" style={S.input} /></div>
          <div style={S.field}><label style={S.label}>Slug *</label><input name="slug" value={form.slug} onChange={handleChange} placeholder="mayfair-kitchen" style={S.input} /></div>
        </div>
        <div style={S.row}>
          <div style={S.field}><label style={S.label}>Type *</label><select name="type" value={form.type} onChange={handleChange} style={S.select}><option value="">Select type…</option>{COLLECTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
          <div style={S.field}><label style={S.label}>Status</label><select name="status" value={form.status} onChange={handleChange} style={S.select}>{STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
        </div>
        <div style={S.row}>
          <div style={S.field}><label style={S.label}>Order (Sort Index)</label><input type="number" name="order" value={form.order} onChange={handleChange} style={S.input} /></div>
          <div style={{ ...S.field, display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} id="featured-check" />
            <label htmlFor="featured-check" style={{ ...S.label, marginBottom: 0, cursor: "pointer" }}>Featured Collection</label>
          </div>
        </div>
        <div style={S.field}><label style={S.label}>Short Description</label><input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief one-line description" style={S.input} /></div>
        <div style={S.field}><label style={S.label}>Long Description (HTML supported)</label><textarea name="longDescription" value={form.longDescription} onChange={handleChange} placeholder="Full description… HTML is supported" style={{ ...S.textarea, minHeight: "120px" }} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
          <div style={S.field}>
            <label style={S.label}>Thumbnail</label>
            <input value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="Paste URL here..." style={{...S.input, marginBottom: "0.5rem"}} />
            <input type="file" accept="image/*" onChange={(e) => handleImgUpload(e, "thumbnail")} disabled={imgUploading} style={{ fontSize: "0.8rem", color: "#a09880" }} />
            {form.thumbnail && <img src={form.thumbnail} alt="thumb" style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px", marginTop: "0.5rem" }} />}
          </div>
          <div style={S.field}>
            <label style={S.label}>Banner Image</label>
            <input value={form.bannerImage} onChange={(e) => setForm({ ...form, bannerImage: e.target.value })} placeholder="Paste URL here..." style={{...S.input, marginBottom: "0.5rem"}} />
            <input type="file" accept="image/*" onChange={(e) => handleImgUpload(e, "bannerImage")} disabled={imgUploading} style={{ fontSize: "0.8rem", color: "#a09880" }} />
            {form.bannerImage && <img src={form.bannerImage} alt="banner" style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px", marginTop: "0.5rem" }} />}
          </div>
        </div>
        <div style={S.field}><label style={S.label}>Gallery Images (one URL per line)</label><textarea value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} placeholder={"URL1\nURL2"} style={{ ...S.textarea, minHeight: "80px", fontFamily: "monospace", fontSize: "0.78rem" }} /></div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button style={S.btnOutline} onClick={() => setModal(false)}>Cancel</button>
          <button style={S.btnGold} onClick={handleSave} disabled={saving}>{saving ? "Saving…" : editing ? "Update" : "Create"}</button>
        </div>
      </AdminModal>
    </>
  );
};
export default CollectionsList;
