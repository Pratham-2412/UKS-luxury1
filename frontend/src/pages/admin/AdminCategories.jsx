import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { S } from "../../components/admin/adminStyles";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiAddLine, RiEditLine, RiDeleteBinLine } from "react-icons/ri";

const AdminCategories = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", isActive: true });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setItems(res.data.categories || res.data.data || []);
    } catch { toast.error("Failed to load categories"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", isActive: true });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      description: item.description || "",
      isActive: item.isActive !== undefined ? item.isActive : true,
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name) return toast.error("Name is required");
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing._id, form);
        toast.success("Category updated");
      } else {
        await createCategory(form);
        toast.success("Category created");
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This might affect products using this category.`)) return;
    try {
      await deleteCategory(id);
      toast.success("Deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout
      title="Categories"
      actions={
        <button style={S.btnGold} onClick={openCreate}>
          <RiAddLine /> Add Category
        </button>
      }
    >
      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Name</th>
              <th style={S.th}>Description</th>
              <th style={S.th}>Status</th>
              <th style={S.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ ...S.td, textAlign: "center" }}>Loading...</td></tr>
            ) : items.map((item) => (
              <tr key={item._id}>
                <td style={S.td}>{item.name}</td>
                <td style={S.td}>{item.description || "—"}</td>
                <td style={S.td}>
                  <span style={S.badge(item.isActive ? "green" : "gray")}>
                    {item.isActive ? "Active" : "Inactive"}
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

      <AdminModal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Edit Category" : "Add Category"}
      >
        <div style={S.field}>
          <label style={S.label}>Category Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Appliances"
            style={S.input}
          />
        </div>
        <div style={S.field}>
          <label style={S.label}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description..."
            style={{ ...S.textarea, minHeight: "80px" }}
          />
        </div>
        <div style={S.field}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              style={{ accentColor: "#c4a064" }}
            />
            <span style={{ ...S.label, marginBottom: 0 }}>Active</span>
          </label>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "2rem" }}>
          <button style={S.btnOutline} onClick={() => setModal(false)}>Cancel</button>
          <button style={S.btnGold} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Category"}
          </button>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminCategories;
