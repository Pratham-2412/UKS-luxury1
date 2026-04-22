import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { S } from "../../components/admin/adminStyles";
import { getEnquiries, updateEnquiry, deleteEnquiry } from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiEyeLine, RiDeleteBinLine, RiWhatsappLine } from "react-icons/ri";
import { formatDate } from "../../utils/formatDate";

const STATUS_OPTIONS = ["new", "in-progress", "resolved", "closed"];

const AdminInquiries = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("new");
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getEnquiries({ limit: 100, sort: "-createdAt" });
      setItems(res.data.enquiries || res.data.data || []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openView = (item) => {
    setSelected(item);
    setNote(item.adminNotes || "");
    setStatus(item.status || "new");
    setModal(true);
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await updateEnquiry(selected._id, { status, adminNotes: note });
      toast.success("Updated");

      // Handle manual messaging after save if notes are present
      if (note && selected.phone) {
        if (selected.preferredContactMethod === "phone") {
          // Open SMS app with pre-filled message (Free)
          const smsLink = `sms:${selected.phone.replace(/\D/g, "")}?body=${encodeURIComponent("UKS Interiors Update: " + note)}`;
          window.location.href = smsLink;
        } else if (selected.preferredContactMethod === "whatsapp") {
          // Open WhatsApp with pre-filled message (Free)
          const waLink = `https://wa.me/${selected.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hello " + selected.name + ",\n\n" + note)}`;
          window.open(waLink, "_blank");
        }
      }

      setModal(false);
      load();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    try { await deleteEnquiry(id); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout title="Inquiries">
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Name", "Email", "Type", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", padding: "3rem" }}>Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} style={{ ...S.td, textAlign: "center", padding: "3rem", fontStyle: "italic" }}>No inquiries yet.</td></tr>
              ) : items.map((item) => (
                <tr key={item._id}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ ...S.td, color: "#f0ece4", fontWeight: 400 }}>{item.name}</td>
                  <td style={S.td}>{item.email}</td>
                  <td style={S.td}>{item.inquiryType || "General"}</td>
                  <td style={S.td}>
                    <span style={S.badge(
                      item.status === "resolved" ? "green" :
                        item.status === "in-progress" ? "gold" :
                          item.status === "closed" ? "gray" : "blue"
                    )}>{item.status || "new"}</span>
                  </td>
                  <td style={S.td}>{formatDate(item.createdAt)}</td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button style={S.btnOutline} onClick={() => openView(item)}><RiEyeLine /></button>
                      <button style={S.btnDanger} onClick={() => handleDelete(item._id)}><RiDeleteBinLine /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal open={modal} onClose={() => setModal(false)} title="Inquiry Details" size="md">
        {selected && (
          <div>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
              gap: "1rem", 
              marginBottom: "1.5rem" 
            }}>
              {[
                { l: "Name", v: selected.name },
                { l: "Email", v: selected.email },
                {
                  l: "Phone",
                  v: (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span>{selected.phone || "—"}</span>
                      {selected.phone && (
                        <a 
                          href={`https://wa.me/${selected.phone.startsWith('0') ? '44' + selected.phone.slice(1).replace(/\D/g, '') : selected.phone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          title="Chat on WhatsApp"
                          style={{ color: "#25D366", fontSize: "1.1rem", display: "flex", alignItems: "center" }}
                        >
                          <RiWhatsappLine />
                        </a>
                      )}
                    </div>
                  )
                },
                { l: "Type", v: selected.inquiryType || "General" },
                { l: "Preferred Method", v: <span style={{ textTransform: "capitalize" }}>{selected.preferredContactMethod || "Email"}</span> },
              ].map((r) => (
                <div key={r.l} style={{ padding: "0.75rem", background: "#1a1a1a", borderRadius: "4px" }}>
                  <p style={{ ...S.label, marginBottom: "0.25rem" }}>{r.l}</p>
                  <div style={{ fontSize: "1rem", color: "#ffffff", fontWeight: 400 }}>{r.v}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "1rem", background: "#1a1a1a", borderRadius: "4px", marginBottom: "1.5rem" }}>
              <p style={{ ...S.label, marginBottom: "0.5rem" }}>Message</p>
              <p style={{ fontSize: "0.875rem", color: "#a09880", lineHeight: 1.7, fontWeight: 300 }}>
                {selected.message}
              </p>
            </div>

            <div style={S.field}>
              <label style={S.label}>Update Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={S.select}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={S.field}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ ...S.label, marginBottom: 0 }}>Admin Notes / Reply</label>
                {selected.phone && (selected.preferredContactMethod === "whatsapp" || selected.preferredContactMethod === "phone") && (
                  <a 
                    href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=${encodeURIComponent("Hello " + selected.name + ",\n\n" + note)}`} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ ...S.btnOutline, padding: "4px 8px", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "4px", color: "#25D366", borderColor: "rgba(37, 211, 102, 0.3)" }}
                  >
                    <RiWhatsappLine /> Send via WhatsApp
                  </a>
                )}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Internal notes or reply message…"
                style={S.textarea}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button style={S.btnOutline} onClick={() => setModal(false)}>Close</button>
              <button style={S.btnGold} onClick={handleUpdate} disabled={saving}>
                {saving ? "Saving…" : "Update Inquiry"}
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminInquiries;