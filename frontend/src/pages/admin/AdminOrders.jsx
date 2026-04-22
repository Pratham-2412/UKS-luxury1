import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { S } from "../../components/admin/adminStyles";
import { getOrders, updateOrderStatus, deleteOrder } from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiEyeLine, RiDeleteBinLine } from "react-icons/ri";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

const DELIVERY_STATUSES = ["pending","processing","shipped","delivered","cancelled"];

const AdminOrders = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [selected, setSelected] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState("pending");
  const [saving, setSaving]   = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getOrders({ limit: 100, sort: "-createdAt" });
      setItems(res.data.orders || res.data.data || []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openView = (item) => {
    setSelected(item);
    setDeliveryStatus(item.deliveryStatus || "pending");
    setModal(true);
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await updateOrderStatus(selected._id, { deliveryStatus });
      toast.success("Order status updated");
      setModal(false);
      load();
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order permanently?")) return;
    try {
      await deleteOrder(id);
      toast.success("Order deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout title="Orders">
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Order ID","Customer","Items","Total","Payment","Delivery","Date","Actions"].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ ...S.td, textAlign: "center", padding: "3rem" }}>Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} style={{ ...S.td, textAlign: "center", padding: "3rem", fontStyle: "italic" }}>No orders yet.</td></tr>
              ) : items.map((item) => (
                <tr key={item._id}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ ...S.td, fontFamily: "monospace", fontSize: "0.7rem", color: "#5a5550" }}>
                    …{item._id.slice(-8)}
                  </td>
                  <td style={{ ...S.td, color: "#f0ece4" }}>
                    {item.customerEmail || "Guest"}
                    <br />
                    <span style={{ fontSize: "0.7rem", color: "#5a5550" }}>
                      {item.customerName || ""}
                    </span>
                  </td>
                  <td style={S.td}>{item.items?.length || 0}</td>
                  <td style={{ ...S.td, fontFamily: "'Cormorant Garamond', serif", color: "#c4a064", fontSize: "1rem" }}>
                    {formatCurrency(item.totalAmount || 0)}
                  </td>
                  <td style={S.td}>
                    <span style={S.badge(
                      item.paymentStatus === "paid" ? "green" :
                      item.paymentStatus === "pending" ? "gold" : "red"
                    )}>{item.paymentStatus || "pending"}</span>
                  </td>
                  <td style={S.td}>
                    <span style={S.badge(
                      item.deliveryStatus === "delivered" ? "green" :
                      item.deliveryStatus === "shipped"   ? "blue"  :
                      item.deliveryStatus === "cancelled" ? "red"   : "gray"
                    )}>{item.deliveryStatus || "pending"}</span>
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

      <AdminModal open={modal} onClose={() => setModal(false)} title="Order Details" size="md">
        {selected && (
          <div>
            {/* Customer info */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
              gap: "0.75rem", 
              marginBottom: "1.5rem" 
            }}>
              {[
                { l: "Email",   v: selected.customerEmail || "—" },
                { l: "Phone",   v: selected.customerPhone || "—" },
                { l: "Name",    v: selected.customerName || "—" },
                { l: "City",    v: selected.address?.city || "—" },
                { l: "Postcode",v: selected.address?.pincode || "—" },
                { l: "Country", v: selected.address?.country || "—" },
              ].map((r) => (
                <div key={r.l} style={{ padding: "0.75rem", background: "#1a1a1a", borderRadius: "4px" }}>
                  <p style={{ ...S.label, marginBottom: "0.2rem" }}>{r.l}</p>
                  <p style={{ fontSize: "1rem", color: "#ffffff", fontWeight: 400 }}>{r.v}</p>
                </div>
              ))}
            </div>

            {/* Items */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ ...S.label, marginBottom: "0.75rem" }}>Order Items</p>
              {selected.items?.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.65rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <span style={{ fontSize: "0.85rem", color: "#a09880", fontWeight: 300 }}>
                    {item.name || "Product"} × {item.quantity}
                  </span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "#c4a064" }}>
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#5a5550", textTransform: "uppercase", letterSpacing: "0.1em" }}>Total</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", color: "#c4a064" }}>
                  {formatCurrency(selected.totalAmount || 0)}
                </span>
              </div>
            </div>

            {/* Update delivery */}
            <div style={S.field}>
              <label style={S.label}>Delivery Status</label>
              <select value={deliveryStatus} onChange={(e) => setDeliveryStatus(e.target.value)} style={S.select}>
                {DELIVERY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button style={S.btnOutline} onClick={() => setModal(false)}>Close</button>
              <button style={S.btnGold} onClick={handleUpdate} disabled={saving}>
                {saving ? "Saving…" : "Update Status"}
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminOrders;