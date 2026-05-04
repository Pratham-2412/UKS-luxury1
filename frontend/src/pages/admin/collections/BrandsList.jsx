import { useState, useEffect } from "react";
import AdminModal from "../../../components/admin/AdminModal";
import { S } from "../../../components/admin/adminStyles";
import { getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory, uploadImage } from "../../../api/adminApi";
import toast from "react-hot-toast";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiArrowLeftLine, RiFolderOpenLine } from "react-icons/ri";

const EMPTY = { name: "", collectionSlug: "", tagline: "", description: "", thumbnail: "", heroImage: "", logo: "", features: "", status: "active", order: 0, externalUrl: "" };

const BrandsList = ({ collection, onBack, onManageItems }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const legacySlug = collection.type === "Bespoke Kitchens" ? "bespoke-kitchens" : null;
      
      const res = await getSubcategories(); // fetch all
      const all = res.data.data || [];
      
      setItems(all.filter(i => 
        i.collectionSlug === collection.slug || 
        (legacySlug && i.collectionSlug === legacySlug)
      ));
    } catch { toast.error("Failed to load brands"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [collection.slug]);

  const openCreate = () => { 
    setEditing(null); 
    const targetSlug = collection.type === "Bespoke Kitchens" ? "bespoke-kitchens" : collection.slug;
    setForm({ ...EMPTY, collectionSlug: targetSlug }); 
    setModal(true); 
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...EMPTY, ...item, features: item.features ? item.features.join(", ") : "" });
    setModal(true);
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData(); formData.append("image", file);
    setUploadingImage(true);
    try {
      const res = await uploadImage(formData);
      setForm((prev) => ({ ...prev, [field]: res.data.url }));
      toast.success("Image uploaded");
    } catch { toast.error("Failed to upload image"); } 
    finally { setUploadingImage(false); }
  };

  const handleSave = async () => {
    if (!form.name) return toast.error("Name is required");
    const submitData = { ...form, features: typeof form.features === 'string' ? form.features.split(",").map(f => f.trim()).filter(f => f) : form.features };
    setSaving(true);
    try {
      if (editing) await updateSubcategory(editing._id, submitData);
      else await createSubcategory(submitData);
      toast.success("Brand saved");
      setModal(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || "Save failed"); } 
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This deletes all items inside it too.`)) return;
    try {
      await deleteSubcategory(id);
      toast.success("Deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#a09880", cursor: "pointer", fontSize: "1.5rem", display: "flex" }}><RiArrowLeftLine /></button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#f0ece4", margin: 0, fontWeight: 400 }}>Brands in {collection.title}</h2>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#a09880", marginTop: "0.2rem" }}>Manage brands/subcategories for this collection</p>
        </div>
        <button style={S.btnGold} onClick={openCreate}><RiAddLine /> Add Brand</button>
      </div>

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Thumbnail</th>
              <th style={S.th}>Name</th>
              <th style={S.th}>Tagline</th>
              <th style={S.th}>Status</th>
              <th style={S.th}>Hierarchy</th>
              <th style={S.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ ...S.td, textAlign: "center" }}>Loading...</td></tr> :
            items.length === 0 ? <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", fontStyle: "italic" }}>No brands found.</td></tr> :
            items.map((item) => (
              <tr key={item._id}>
                <td style={S.td}>{item.thumbnail ? <img src={item.thumbnail} alt={item.name} style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }} /> : "—"}</td>
                <td style={S.td}>{item.name}</td>
                <td style={S.td}>{item.tagline || "—"}</td>
                <td style={S.td}><span style={S.badge(item.status === 'active' ? "green" : item.status === 'draft' ? "orange" : "gray")}>{item.status}</span></td>
                <td style={S.td}>
                  <button style={{ ...S.btnOutline, background: "rgba(196,160,100,0.1)", borderColor: "#c4a064", color: "#c4a064", fontSize: "0.75rem", padding: "0.4rem 0.8rem" }} onClick={() => onManageItems(item)}>
                    <RiFolderOpenLine /> Manage Items
                  </button>
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

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Brand" : "Add Brand"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={S.field}><label style={S.label}>Brand Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Leicht" style={S.input} /></div>
          <div style={S.field}><label style={S.label}>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={S.input}><option value="active">Active</option><option value="inactive">Inactive</option><option value="draft">Draft</option></select></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={S.field}><label style={S.label}>Order (Sort Index)</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} style={S.input} /></div>
          <div style={S.field}><label style={S.label}>Tagline</label><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="e.g. German Engineering, Timeless Design" style={S.input} /></div>
        </div>
        <div style={S.field}>
          <label style={S.label}>External URL (Optional)</label>
          <input value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} placeholder="e.g. https://www.website.com" style={S.input} />
          <span style={{ fontSize: "0.75rem", color: "gray", marginTop: "4px", display: "inline-block" }}>If provided, the brand card will link directly to this website instead of an internal page.</span>
        </div>
        <div style={S.field}><label style={S.label}>Long Description (HTML allowed)</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="<p>Full description here...</p>" style={{ ...S.textarea, minHeight: "120px", fontFamily: "monospace" }} /></div>
        <div style={S.field}><label style={S.label}>Features (Comma separated)</label><input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Feature 1, Feature 2" style={S.input} /></div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={S.field}>
            <label style={S.label}>Thumbnail Image (Grid)</label>
            <input value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="Paste URL here..." style={{...S.input, marginBottom: "0.5rem"}} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "thumbnail")} disabled={uploadingImage} style={{ fontSize: "0.8rem", color: "#a09880" }} />
            {form.thumbnail && <img src={form.thumbnail} alt="Thumbnail" style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px", marginTop: "0.5rem" }} />}
          </div>
          <div style={S.field}>
            <label style={S.label}>Hero Image (Detail Page)</label>
            <input value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} placeholder="Paste URL here..." style={{...S.input, marginBottom: "0.5rem"}} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "heroImage")} disabled={uploadingImage} style={{ fontSize: "0.8rem", color: "#a09880" }} />
            {form.heroImage && <img src={form.heroImage} alt="Hero" style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px", marginTop: "0.5rem" }} />}
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Brand Logo (Optional)</label>
          <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="Paste Logo URL here..." style={{...S.input, marginBottom: "0.5rem"}} />
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} disabled={uploadingImage} style={{ fontSize: "0.8rem", color: "#a09880" }} />
          {form.logo && <img src={form.logo} alt="Logo" style={{ width: "80px", height: "50px", objectFit: "contain", background: "#222", padding: "4px", borderRadius: "4px", marginTop: "0.5rem" }} />}
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "2rem" }}>
          <button style={S.btnOutline} onClick={() => setModal(false)}>Cancel</button>
          <button style={S.btnGold} onClick={handleSave} disabled={saving || uploadingImage}>{saving ? "Saving..." : "Save Brand"}</button>
        </div>
      </AdminModal>
    </>
  );
};
export default BrandsList;
