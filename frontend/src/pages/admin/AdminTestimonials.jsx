import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { S } from "../../components/admin/adminStyles";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiStarFill } from "react-icons/ri";

const EMPTY = { name: "", role: "", message: "", rating: 5, isActive: true };

const AdminTestimonials = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getTestimonials();
      setItems(res.data.testimonials || res.data.data || []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name||"", role: item.role||"", message: item.message||"", rating: item.rating||5, isActive: item.isActive ?? true });
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.message) { toast.error("Name and message required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, rating: Number(form.rating) };
      if (editing) {
        await updateTestimonial(editing._id, payload);
        toast.success("Updated");
      } else {
        await createTestimonial(payload);
        toast.success("Created");
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try { await deleteTestimonial(id); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout
      title="Testimonials"
      actions={<button style={S.btnGold} onClick={openCreate}><RiAddLine /> Add Testimonial</button>}
    >
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Name","Role","Rating","Message","Active","Actions"].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", padding: "3rem" }}>Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", padding: "3rem", fontStyle: "italic" }}>No testimonials yet.</td></tr>
              ) : items.map((item) => (
                <tr key={item._id}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ ...S.td, color: "#f0ece4", fontWeight: 400 }}>{item.name}</td>
                  <td style={S.td}>{item.role || "—"}</td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <RiStarFill key={i} style={{ color: "#c4a064", fontSize: "0.75rem" }} />
                      ))}
                    </div>
                  </td>
                  <td style={{ ...S.td, maxWidth: "280px" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.8rem", color: "#6b6560" }}>
                      {item.message}
                    </div>
                  </td>
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

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Testimonial" : "Add Testimonial"} size="md">
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Client Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="John Smith" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Role / Location</label>
            <input name="role" value={form.role} onChange={handleChange} placeholder="Mayfair, London" style={S.input} />
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Testimonial *</label>
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="What did the client say…" style={S.textarea} />
        </div>
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Rating (1–5)</label>
            <select name="rating" value={form.rating} onChange={handleChange} style={S.select}>
              {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "1.5rem" }}>
            <input type="checkbox" id="tActive" name="isActive" checked={form.isActive} onChange={handleChange} style={{ accentColor: "#c4a064" }} />
            <label htmlFor="tActive" style={{ ...S.label, marginBottom: 0, cursor: "pointer" }}>Visible on site</label>
          </div>
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

export default AdminTestimonials;