import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminModal from "../../components/admin/AdminModal";
import { S } from "../../components/admin/adminStyles";
import {
  getAdminProjects, createProject,
  updateProject, deleteProject, uploadImage,
} from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiImageAddLine } from "react-icons/ri";

const EMPTY = {
  title: "", slug: "", shortDescription: "", longDescription: "",
  thumbnail: "", category: "", style: "", year: "", location: "",
  featured: false, status: "published", galleryImages: [],
};

const AdminProjects = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [galleryInput, setGalleryInput] = useState("");
  const [imgUploading, setImgUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAdminProjects();
      const list = res.data?.projects || res.data?.data || [];
      setItems(list);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setGalleryInput("");
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title:            item.title || "",
      slug:             item.slug  || "",
      shortDescription: item.shortDescription || "",
      longDescription:  item.longDescription  || "",
      thumbnail:        item.thumbnail  || "",
      category:         item.category   || "",
      style:            item.style      || "",
      year:             item.year       || "",
      location:         item.location   || "",
      featured:         item.featured   || false,
      status:           item.status     || "published",
      galleryImages:    item.galleryImages || [],
    });
    const gallery = item.galleryImages || [];
    const formattedGallery = gallery.map(img => 
      typeof img === 'string' ? img : `${img.url} | ${img.description || ''}`
    ).join("\n");
    setGalleryInput(formattedGallery);
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (name === "title" && !editing) {
      setForm((p) => ({
        ...p, title: value,
        slug: value.toLowerCase().trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-"),
      }));
    }
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
      const galleryLines = galleryInput.split("\n").map((s) => s.trim()).filter(Boolean);
      const parsedGallery = galleryLines.map(line => {
        const [url, ...descParts] = line.split("|");
        return {
          url: url.trim(),
          description: descParts.join("|").trim() || ""
        };
      });

      const payload = {
        ...form,
        galleryImages: parsedGallery,
      };
      if (editing) {
        await updateProject(editing._id, payload);
        toast.success("Project updated");
      } else {
        await createProject(payload);
        toast.success("Project created");
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteProject(id);
      toast.success("Deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout
      title="Projects"
      actions={
        <button style={S.btnGold} onClick={openCreate}>
          <RiAddLine /> Add Project
        </button>
      }
    >
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Thumbnail","Title","Category","Style","Year","Status","Featured","Actions"].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ ...S.td, textAlign: "center", padding: "3rem" }}>Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} style={{ ...S.td, textAlign: "center", padding: "3rem", fontStyle: "italic" }}>
                  No projects yet.
                </td></tr>
              ) : items.map((item) => (
                <tr key={item._id}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={S.td}>
                    {item.thumbnail
                      ? <img src={item.thumbnail} alt="" style={{ width: "52px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                      : <div style={{ width: "52px", height: "40px", background: "#1a1a1a", borderRadius: "4px" }} />
                    }
                  </td>
                  <td style={{ ...S.td, color: "#f0ece4", fontWeight: 400 }}>
                    {item.title}
                    <br />
                    <span style={{ fontSize: "0.7rem", color: "#5a5550" }}>/{item.slug}</span>
                  </td>
                  <td style={S.td}>{item.category || "—"}</td>
                  <td style={S.td}>{item.style    || "—"}</td>
                  <td style={S.td}>{item.year     || "—"}</td>
                  <td style={S.td}>
                    <span style={S.badge(["published", "active"].includes(item.status) ? "green" : "gray")}>
                      {item.status}
                    </span>
                  </td>
                  <td style={S.td}>
                    <span style={S.badge(item.featured ? "gold" : "gray")}>
                      {item.featured ? "Yes" : "No"}
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

      <AdminModal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Edit Project" : "Add Project"}
        size="lg"
      >
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Project name" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="project-slug" style={S.input} />
          </div>
        </div>

        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Category</label>
            <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Kitchen & Wardrobes" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Style</label>
            <input name="style" value={form.style} onChange={handleChange} placeholder="e.g. Contemporary" style={S.input} />
          </div>
        </div>

        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Year</label>
            <input name="year" value={form.year} onChange={handleChange} placeholder="2024" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Location</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="London" style={S.input} />
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Short Description</label>
          <input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief summary" style={S.input} />
        </div>

        <div style={S.field}>
          <label style={S.label}>Long Description (HTML supported)</label>
          <textarea name="longDescription" value={form.longDescription} onChange={handleChange} placeholder="Full project description…" style={{ ...S.textarea, minHeight: "120px" }} />
        </div>

        <div style={S.field}>
          <label style={S.label}>Thumbnail</label>
          <input name="thumbnail" value={form.thumbnail} onChange={handleChange} placeholder="Image URL" style={{ ...S.input, marginBottom: "0.5rem" }} />
          <label style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            padding: "0.5rem 1rem",
            background: "rgba(196,160,100,0.08)",
            border: "1px dashed rgba(196,160,100,0.3)",
            borderRadius: "4px", fontSize: "0.72rem", color: "#c4a064",
            cursor: "pointer", letterSpacing: "0.1em",
          }}>
            <RiImageAddLine />
            {imgUploading ? "Uploading…" : "Upload Image"}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImgUpload} disabled={imgUploading} />
          </label>
          {form.thumbnail && (
            <img src={form.thumbnail} alt="" style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "4px", marginTop: "0.5rem" }} />
          )}
        </div>

        <div style={S.field}>
          <label style={S.label}>Gallery Images (one URL per line)</label>
          <textarea
            value={galleryInput}
            onChange={(e) => setGalleryInput(e.target.value)}
            placeholder={"https://…/img1.jpg\nhttps://…/img2.jpg"}
            style={{ ...S.textarea, minHeight: "80px", fontFamily: "monospace", fontSize: "0.78rem" }}
          />
        </div>

        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} style={S.select}>
              <option value="published">Published</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "1.5rem" }}>
            <input type="checkbox" id="pjFeatured" name="featured" checked={form.featured} onChange={handleChange} style={{ accentColor: "#c4a064", width: "16px", height: "16px" }} />
            <label htmlFor="pjFeatured" style={{ ...S.label, marginBottom: 0, cursor: "pointer" }}>Featured Project</label>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button style={S.btnOutline} onClick={() => setModal(false)}>Cancel</button>
          <button style={S.btnGold} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : editing ? "Update Project" : "Create Project"}
          </button>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminProjects;