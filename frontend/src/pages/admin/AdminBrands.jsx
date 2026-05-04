import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { S } from "../../components/admin/adminStyles";
import { getBrands, createBrand, updateBrand, deleteBrand, uploadImage } from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiUploadCloud2Line } from "react-icons/ri";

const EMPTY = { name: "", logo: "", link: "", order: 0, isActive: true };

const AdminBrands = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getBrands();
      setItems(res.data.brands || res.data.data || []);
    } catch { toast.error("Failed to load brands"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      logo: item.logo || "",
      link: item.link || "",
      order: item.order || 0,
      isActive: item.isActive ?? true,
    });
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await uploadImage(fd);
      setForm((p) => ({ ...p, logo: res.data.url }));
      toast.success("Logo uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name) { toast.error("Brand name is required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editing) {
        await updateBrand(editing._id, payload);
        toast.success("Brand updated");
      } else {
        await createBrand(payload);
        toast.success("Brand created");
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this brand?")) return;
    try { await deleteBrand(id); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout
      title="Brands"
      actions={<button style={S.btnGold} onClick={openCreate}><RiAddLine /> Add Brand</button>}
    >
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Logo", "Name", "Link", "Order", "Active", "Actions"].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", padding: "3rem" }}>Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", padding: "3rem", fontStyle: "italic" }}>No brands yet.</td></tr>
              ) : items.map((item) => (
                <tr key={item._id}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={S.td}>
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.name}
                        style={{
                          height: "36px",
                          maxWidth: "100px",
                          objectFit: "contain",
                          opacity: 0.7,
                        }}
                      />
                    ) : (
                      <span style={{ color: "#5a5550", fontSize: "0.8rem", fontStyle: "italic" }}>No logo</span>
                    )}
                  </td>
                  <td style={{ ...S.td, color: "#f0ece4", fontWeight: 400 }}>{item.name}</td>
                  <td style={{ ...S.td, fontSize: "0.8rem", color: "#c4a064" }}>
                    {item.link ? item.link : <span style={{ color: "#5a5550", fontStyle: "italic" }}>—</span>}
                  </td>
                  <td style={S.td}>{item.order}</td>
                  <td style={S.td}>
                    <span style={S.badge(item.isActive ? "green" : "gray")}>
                      {item.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button style={S.btnOutline} onClick={() => openEdit(item)}><RiEditLine /></button>
                      <button style={S.btnDanger} onClick={() => handleDelete(item._id)}><RiDeleteBinLine /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Brand" : "Add Brand"} size="md">
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Brand Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Leicht" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Display Order</label>
            <input name="order" type="number" value={form.order} onChange={handleChange} style={S.input} />
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Link URL</label>
          <input name="link" value={form.link} onChange={handleChange} placeholder="e.g. /collections/bespoke-kitchens" style={S.input} />
          <span style={{ fontSize: "0.65rem", color: "#5a5550", marginTop: "0.25rem" }}>Internal path (e.g. /collections/bespoke-kitchens) or external URL (e.g. https://...)</span>
        </div>

        {/* Logo upload */}
        <div style={S.field}>
          <label style={S.label}>Brand Logo</label>
          {form.logo && (
            <div style={{
              marginBottom: "0.75rem",
              padding: "1rem",
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <img src={form.logo} alt="Preview" style={{ height: "48px", maxWidth: "160px", objectFit: "contain" }} />
            </div>
          )}
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.75rem 1.5rem",
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "6px",
              cursor: uploading ? "wait" : "pointer",
              fontSize: "0.8rem",
              color: "#c4a064",
              fontFamily: "'Jost', sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}
          >
            <RiUploadCloud2Line style={{ fontSize: "1.1rem" }} />
            {uploading ? "Uploading…" : "Upload Logo"}
            <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} disabled={uploading} />
          </label>
          <div style={{ marginTop: "0.5rem" }}>
            <span style={{ fontSize: "0.7rem", color: "#5a5550" }}>Or paste a URL:</span>
            <input name="logo" value={form.logo} onChange={handleChange} placeholder="https://..." style={{ ...S.input, marginTop: "0.4rem" }} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <input type="checkbox" id="brandActive" name="isActive" checked={form.isActive} onChange={handleChange} style={{ accentColor: "#c4a064" }} />
          <label htmlFor="brandActive" style={{ ...S.label, marginBottom: 0, cursor: "pointer" }}>Visible on site</label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button style={S.btnOutline} onClick={() => setModal(false)}>Cancel</button>
          <button style={S.btnGold} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : editing ? "Update" : "Create"}
          </button>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminBrands;
