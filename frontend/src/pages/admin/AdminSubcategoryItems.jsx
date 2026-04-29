import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { S } from "../../components/admin/adminStyles";
import { getSubcategories, getSubcategoryItems, createSubcategoryItem, updateSubcategoryItem, deleteSubcategoryItem, uploadImages, uploadZip } from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiImageAddLine, RiCloseCircleLine } from "react-icons/ri";

const AdminSubcategoryItems = () => {
  const [items, setItems] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterSubcategory, setFilterSubcategory] = useState("");
  
  const [form, setForm] = useState({ 
    name: "", 
    parentSubcategory: "", 
    images: [], 
    status: "active", 
    order: 0 
  });
  
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [itemsRes, subCatsRes] = await Promise.all([
        getSubcategoryItems(filterSubcategory ? { subcategoryId: filterSubcategory } : {}),
        getSubcategories()
      ]);
      setItems(itemsRes.data.data || []);
      setSubcategories(subCatsRes.data.data || []);
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [filterSubcategory]);

  const openCreate = () => {
    setEditing(null);
    setForm({ 
      name: "", 
      parentSubcategory: filterSubcategory || (subcategories.length > 0 ? subcategories[0]._id : ""), 
      images: [], 
      status: "active", 
      order: 0 
    });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      parentSubcategory: item.parentSubcategory?._id || item.parentSubcategory || "",
      images: item.images || [],
      status: item.status || "active",
      order: item.order || 0
    });
    setModal(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("images", file);
      }
      
      const res = await uploadImages(formData);
      const newUrls = res.data.images.map(img => img.url);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }));
      toast.success(`${newUrls.length} image(s) uploaded`);
    } catch (err) {
      toast.error("Failed to upload images");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleZipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("zip", file);
      
      const res = await uploadZip(formData);
      const newUrls = res.data.images.map(img => img.url);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }));
      toast.success(`ZIP extracted: ${newUrls.length} image(s) added`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process ZIP file");
    } finally {
      setUploadingImage(false);
      e.target.value = ""; // Clear input
    }
  };

  const removeImage = (index) => {
    setForm(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleSave = async () => {
    if (!form.name) return toast.error("Name is required");
    if (!form.parentSubcategory) return toast.error("Please select a parent subcategory");
    if (form.images.length === 0) return toast.error("At least one image is required (thumbnail)");

    setSaving(true);
    try {
      if (editing) {
        await updateSubcategoryItem(editing._id, form);
        toast.success("Item updated");
      } else {
        await createSubcategoryItem(form);
        toast.success("Item created");
      }
      setModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteSubcategoryItem(id);
      toast.success("Deleted");
      loadData();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout
      title="Subcategory Items (Products)"
      actions={
        <div style={{ display: "flex", gap: "1rem" }}>
          <select 
            value={filterSubcategory} 
            onChange={(e) => setFilterSubcategory(e.target.value)}
            style={{...S.input, width: "200px"}}
          >
            <option value="">All Brands</option>
            {subcategories.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
          <button style={S.btnGold} onClick={openCreate}>
            <RiAddLine /> Add Item
          </button>
        </div>
      }
    >
      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Thumbnail</th>
              <th style={S.th}>Name</th>
              <th style={S.th}>Brand / Subcategory</th>
              <th style={S.th}>Gallery</th>
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
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.name} style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                  ) : "—"}
                </td>
                <td style={S.td}>{item.name}</td>
                <td style={S.td}>{item.parentSubcategory?.name || "—"}</td>
                <td style={S.td}>{item.images?.length || 0} images</td>
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
              <tr><td colSpan={6} style={{ ...S.td, textAlign: "center" }}>No items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Edit Item" : "Add Item"}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={S.field}>
            <label style={S.label}>Item Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Alles"
              style={S.input}
            />
          </div>
          
          <div style={S.field}>
            <label style={S.label}>Parent Subcategory (Brand) *</label>
            <select
              value={form.parentSubcategory}
              onChange={(e) => setForm({ ...form, parentSubcategory: e.target.value })}
              style={S.input}
            >
              <option value="" disabled>Select Brand...</option>
              {subcategories.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
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

          <div style={S.field}>
            <label style={S.label}>Order (Sorting)</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              style={S.input}
            />
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Gallery Images (First image is the thumbnail)</label>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
            {form.images.map((img, i) => (
              <div key={i} style={{ position: "relative", width: "100px", height: "100px" }}>
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                {i === 0 && (
                  <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "10px", textAlign: "center", padding: "2px", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}>
                    Thumbnail
                  </span>
                )}
                <button 
                  onClick={() => removeImage(i)}
                  style={{ position: "absolute", top: -8, right: -8, background: "#ff4444", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2 }}
                >
                  <RiCloseCircleLine />
                </button>
              </div>
            ))}
            
            <label style={{ width: "100px", height: "100px", border: "2px dashed rgba(196,160,100,0.5)", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#c4a064", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background="rgba(196,160,100,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
              <RiImageAddLine style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }} />
              <span style={{ fontSize: "0.7rem" }}>Add Images</span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploadingImage} />
            </label>

            <label style={{ width: "100px", height: "100px", border: "2px dashed #c4a064", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#c4a064", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background="rgba(196,160,100,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
              <RiAddLine style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }} />
              <span style={{ fontSize: "0.7rem" }}>Upload ZIP</span>
              <input type="file" accept=".zip" onChange={handleZipUpload} style={{ display: "none" }} disabled={uploadingImage} />
            </label>
          </div>
          {uploadingImage && <p style={{ fontSize: "0.8rem", color: "#c4a064" }}>Uploading images...</p>}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "2rem" }}>
          <button style={S.btnOutline} onClick={() => setModal(false)}>Cancel</button>
          <button style={S.btnGold} onClick={handleSave} disabled={saving || uploadingImage}>
            {saving ? "Saving..." : "Save Item"}
          </button>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminSubcategoryItems;
