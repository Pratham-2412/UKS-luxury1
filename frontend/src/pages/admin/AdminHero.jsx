import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { S } from "../../components/admin/adminStyles";
import { getHeros, createHero, updateHero, deleteHero, uploadImage } from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiImageAddLine } from "react-icons/ri";

const EMPTY = { eyebrow: "", heading: "", subheading: "", image: "", ctaLabel: "", ctaLink: "", isActive: true, order: 0 };

const AdminHero = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [imgUploading, setImgUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getHeros();
      setItems(res.data.heroSections || res.data.data || []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      eyebrow:    item.eyebrow    || "",
      heading:    item.heading    || "",
      subheading: item.subheading || "",
      image:      item.image      || "",
      ctaLabel:   item.ctaLabel   || "",
      ctaLink:    item.ctaLink    || "",
      isActive:   item.isActive   ?? true,
      order:      item.order      || 0,
    });
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await uploadImage(fd);
      setForm((p) => ({ ...p, image: res.data.url || res.data.data?.url }));
      toast.success("Uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setImgUploading(false); }
  };

  const handleSave = async () => {
    if (!form.heading) { toast.error("Heading required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editing) { await updateHero(editing._id, payload); toast.success("Updated"); }
      else { await createHero(payload); toast.success("Created"); }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hero slide?")) return;
    try { await deleteHero(id); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout
      title="Hero Sections"
      actions={<button style={S.btnGold} onClick={openCreate}><RiAddLine /> Add Slide</button>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {loading ? (
          <p style={{ color: "#5a5550", textAlign: "center", padding: "3rem" }}>Loading…</p>
        ) : items.length === 0 ? (
          <p style={{ color: "#5a5550", textAlign: "center", padding: "3rem", fontStyle: "italic" }}>No hero slides. Click "Add Slide".</p>
        ) : items.map((item) => (
          <div key={item._id} style={{
            ...S.card,
            display: "grid",
            gridTemplateColumns: "140px 1fr auto",
            gap: "1.5rem",
            alignItems: "center",
          }}>
            <div style={{ position: "relative", height: "80px", borderRadius: "4px", overflow: "hidden", background: "#1a1a1a" }}>
              {item.image && <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
            <div>
              {item.eyebrow && <p style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "#c4a064", marginBottom: "0.3rem", textTransform: "uppercase" }}>{item.eyebrow}</p>}
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 400, color: "#f0ece4", marginBottom: "0.35rem" }}>{item.heading}</h4>
              {item.subheading && <p style={{ fontSize: "0.8rem", color: "#5a5550", fontWeight: 300 }}>{item.subheading}</p>}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <span style={S.badge(item.isActive ? "green" : "gray")}>{item.isActive ? "Active" : "Hidden"}</span>
                <span style={{ ...S.label, marginBottom: 0 }}>Order: {item.order}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button style={S.btnOutline} onClick={() => openEdit(item)}><RiEditLine /></button>
              <button style={S.btnDanger} onClick={() => handleDelete(item._id)}><RiDeleteBinLine /></button>
            </div>
          </div>
        ))}
      </div>

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Slide" : "Add Slide"} size="lg">
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Eyebrow Text</label>
            <input name="eyebrow" value={form.eyebrow} onChange={handleChange} placeholder="e.g. Bespoke Kitchens" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Display Order</label>
            <input name="order" type="number" value={form.order} onChange={handleChange} placeholder="0" style={S.input} />
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Heading *</label>
          <input name="heading" value={form.heading} onChange={handleChange} placeholder="Where Precision Meets Elegance" style={S.input} />
        </div>
        <div style={S.field}>
          <label style={S.label}>Sub Heading</label>
          <input name="subheading" value={form.subheading} onChange={handleChange} placeholder="Supporting text…" style={S.input} />
        </div>
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>CTA Button Label</label>
            <input name="ctaLabel" value={form.ctaLabel} onChange={handleChange} placeholder="Explore Collections" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>CTA Button Link</label>
            <input name="ctaLink" value={form.ctaLink} onChange={handleChange} placeholder="/collections" style={S.input} />
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Background Image</label>
          <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" style={{ ...S.input, marginBottom: "0.5rem" }} />
          <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", background: "rgba(196,160,100,0.08)", border: "1px dashed rgba(196,160,100,0.3)", borderRadius: "4px", fontSize: "0.72rem", color: "#c4a064", cursor: "pointer" }}>
            <RiImageAddLine />
            {imgUploading ? "Uploading…" : "Upload Image"}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImgUpload} disabled={imgUploading} />
          </label>
          {form.image && <img src={form.image} alt="" style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "4px", marginTop: "0.5rem" }} />}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <input type="checkbox" id="heroActive" name="isActive" checked={form.isActive} onChange={handleChange} style={{ accentColor: "#c4a064" }} />
          <label htmlFor="heroActive" style={{ ...S.label, marginBottom: 0, cursor: "pointer" }}>Show this slide</label>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button style={S.btnOutline} onClick={() => setModal(false)}>Cancel</button>
          <button style={S.btnGold} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : editing ? "Update Slide" : "Create Slide"}
          </button>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminHero;