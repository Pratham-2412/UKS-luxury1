import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { S } from "../../components/admin/adminStyles";
import { getAdminOffers, createOffer, updateOffer, deleteOffer, uploadImage } from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiImageAddLine } from "react-icons/ri";
import { formatDate } from "../../utils/formatDate";

const EMPTY = {
  title: "", description: "", discountText: "",
  thumbnail: "", startDate: "", endDate: "",
  ctaLabel: "", ctaLink: "", isActive: true, featured: false,
};

const AdminOffers = () => {
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
      const res = await getAdminOffers();
      setItems(res.data.offers || res.data.data || []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const fmt = (d) => d ? new Date(d).toISOString().split("T")[0] : "";

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title:        item.title || "",
      description:  item.description || "",
      discountText: item.discountText || "",
      thumbnail:    item.image || item.thumbnail || "",  // model stores as "image"
      startDate:    fmt(item.startDate),
      endDate:      fmt(item.endDate),
      ctaLabel:     item.ctaLabel || "",
      ctaLink:      item.ctaLink  || "",
      isActive:     item.isActive ?? true,
      featured:     item.featured || false,
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
      setForm((p) => ({ ...p, thumbnail: res.data.url || res.data.data?.url }));
      toast.success("Uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setImgUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateOffer(editing._id, form);
        toast.success("Offer updated");
      } else {
        await createOffer(form);
        toast.success("Offer created");
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try { await deleteOffer(id); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout
      title="Offers"
      actions={<button style={S.btnGold} onClick={openCreate}><RiAddLine /> Add Offer</button>}
    >
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Image","Title","Discount","Start","End","Active","Actions"].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", padding: "3rem" }}>Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", padding: "3rem", fontStyle: "italic" }}>No offers yet.</td></tr>
              ) : items.map((item) => (
                <tr key={item._id}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={S.td}>
                    {(item.image || item.thumbnail)
                      ? <img src={item.image || item.thumbnail} alt="" style={{ width: "52px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                      : <div style={{ width: "52px", height: "40px", background: "#1a1a1a", borderRadius: "4px" }} />
                    }
                  </td>
                  <td style={{ ...S.td, color: "#f0ece4", fontWeight: 400 }}>{item.title}</td>
                  <td style={{ ...S.td, color: "#c4a064" }}>{item.discountText || "—"}</td>
                  <td style={S.td}>{item.startDate ? formatDate(item.startDate) : "—"}</td>
                  <td style={S.td}>{item.endDate   ? formatDate(item.endDate)   : "—"}</td>
                  <td style={S.td}>
                    <span style={S.badge(item.isActive ? "green" : "gray")}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
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

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Offer" : "Add Offer"} size="lg">
        <div style={S.field}>
          <label style={S.label}>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Offer title" style={S.input} />
        </div>
        <div style={S.field}>
          <label style={S.label}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Offer details…" style={S.textarea} />
        </div>
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Discount Text</label>
            <input name="discountText" value={form.discountText} onChange={handleChange} placeholder="e.g. 20% OFF" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>CTA Label</label>
            <input name="ctaLabel" value={form.ctaLabel} onChange={handleChange} placeholder="View Offer" style={S.input} />
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>CTA Link</label>
          <input name="ctaLink" value={form.ctaLink} onChange={handleChange} placeholder="/collections/bespoke-kitchens" style={S.input} />
        </div>
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Start Date</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>End Date</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} style={S.input} />
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Thumbnail</label>
          <input name="thumbnail" value={form.thumbnail} onChange={handleChange} placeholder="Image URL" style={{ ...S.input, marginBottom: "0.5rem" }} />
          <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", background: "rgba(196,160,100,0.08)", border: "1px dashed rgba(196,160,100,0.3)", borderRadius: "4px", fontSize: "0.72rem", color: "#c4a064", cursor: "pointer" }}>
            <RiImageAddLine />
            {imgUploading ? "Uploading…" : "Upload Image"}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImgUpload} disabled={imgUploading} />
          </label>
          {form.thumbnail && <img src={form.thumbnail} alt="" style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "4px", marginTop: "0.5rem" }} />}
        </div>
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} style={{ accentColor: "#c4a064" }} />
            <span style={{ ...S.label, marginBottom: 0 }}>Active</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} style={{ accentColor: "#c4a064" }} />
            <span style={{ ...S.label, marginBottom: 0 }}>Featured</span>
          </label>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button style={S.btnOutline} onClick={() => setModal(false)}>Cancel</button>
          <button style={S.btnGold} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : editing ? "Update Offer" : "Create Offer"}
          </button>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminOffers;