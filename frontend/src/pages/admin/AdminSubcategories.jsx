import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { S } from "../../components/admin/adminStyles";
import { getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory, uploadImage, getAdminCollections } from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiAddLine, RiEditLine, RiDeleteBinLine } from "react-icons/ri";

const AdminSubcategories = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    name: "", collectionSlug: "bespoke-kitchens", tagline: "", description: "", 
    thumbnail: "", heroImage: "", features: "", 
    status: "active", order: 0 
  });
  const [collections, setCollections] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [res, colRes] = await Promise.all([
        getSubcategories(),
        getAdminCollections()
      ]);
      setItems(res.data.data || []);
      setCollections(colRes.data.data || []);
    } catch { toast.error("Failed to load subcategories"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ 
      name: "", collectionSlug: "bespoke-kitchens", tagline: "", description: "", 
      thumbnail: "", heroImage: "", features: "", 
      status: "active", order: 0 
    });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      collectionSlug: item.collectionSlug || "bespoke-kitchens",
      tagline: item.tagline || "",
      description: item.description || "",
      thumbnail: item.thumbnail || "",
      heroImage: item.heroImage || "",
      features: item.features ? item.features.join(", ") : "",
      status: item.status || "active",
      order: item.order || 0
    });
    setModal(true);
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    try {
      const res = await uploadImage(formData);
      setForm((prev) => ({ ...prev, [field]: res.data.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!form.name) return toast.error("Name is required");
    
    // Convert features from string to array
    const submitData = {
      ...form,
      features: form.features.split(",").map(f => f.trim()).filter(f => f)
    };

    setSaving(true);
    try {
      if (editing) {
        await updateSubcategory(editing._id, submitData);
        toast.success("Subcategory updated");
      } else {
        await createSubcategory(submitData);
        toast.success("Subcategory created");
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This will delete all associated items as well.`)) return;
    try {
      await deleteSubcategory(id);
      toast.success("Deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout
      title="Subcategories (Brands)"
      actions={
        <button style={S.btnGold} onClick={openCreate}>
          <RiAddLine /> Add Subcategory
        </button>
      }
    >
      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Thumbnail</th>
              <th style={S.th}>Name</th>
              <th style={S.th}>Tagline</th>
              <th style={S.th}>Order</th>
              <th style={S.th}>Status</th>
              <th style={S.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ ...S.td, textAlign: "center" }}>Loading...</td></tr>
            ) : items.map((item) => (
              <tr key={item._id}>
                <td style={S.td}>
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.name} style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                  ) : "—"}
                </td>
                <td style={S.td}>{item.name} <br/><span style={{fontSize: "0.7em", opacity: 0.6}}>{item.collectionSlug}</span></td>
                <td style={S.td}>{item.tagline || "—"}</td>
                <td style={S.td}>{item.order}</td>
                <td style={S.td}>
                  <span style={S.badge(item.status === 'active' ? "green" : item.status === 'draft' ? "orange" : "gray")}>
                    {item.status}
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
            {!loading && items.length === 0 && (
              <tr><td colSpan={6} style={{ ...S.td, textAlign: "center" }}>No subcategories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Edit Subcategory" : "Add Subcategory"}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={S.field}>
            <label style={S.label}>Brand Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Leicht"
              style={S.input}
            />
          </div>
          <div style={S.field}>
            <label style={S.label}>Parent Collection</label>
            <select
              value={form.collectionSlug}
              onChange={(e) => setForm({ ...form, collectionSlug: e.target.value })}
              style={S.input}
            >
              <option value="bespoke-kitchens">Bespoke Kitchens (Default)</option>
              {collections.map(col => (
                <option key={col._id} value={col.slug}>{col.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={S.field}>
            <label style={S.label}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={S.input}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Tagline</label>
          <input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            placeholder="e.g. German Engineering, Timeless Design"
            style={S.input}
          />
        </div>

        <div style={S.field}>
          <label style={S.label}>Long Description (HTML allowed)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="<p>Full description here...</p>"
            style={{ ...S.textarea, minHeight: "120px", fontFamily: "monospace" }}
          />
        </div>

        <div style={S.field}>
          <label style={S.label}>Features (Comma separated)</label>
          <input
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
            placeholder="Handleless Design Systems, Premium Lacquer, German Precision"
            style={S.input}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={S.field}>
            <label style={S.label}>Thumbnail Image (Grid)</label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              {form.thumbnail && (
                <img src={form.thumbnail} alt="Thumbnail" style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
              )}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "thumbnail")} disabled={uploadingImage} style={{ fontSize: "0.8rem", color: "#a09880" }} />
            </div>
          </div>
          
          <div style={S.field}>
            <label style={S.label}>Hero Image (Detail Page)</label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              {form.heroImage && (
                <img src={form.heroImage} alt="Hero" style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
              )}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "heroImage")} disabled={uploadingImage} style={{ fontSize: "0.8rem", color: "#a09880" }} />
            </div>
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Order (Sorting)</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            style={S.input}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "2rem" }}>
          <button style={S.btnOutline} onClick={() => setModal(false)}>Cancel</button>
          <button style={S.btnGold} onClick={handleSave} disabled={saving || uploadingImage}>
            {saving ? "Saving..." : "Save Subcategory"}
          </button>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminSubcategories;
