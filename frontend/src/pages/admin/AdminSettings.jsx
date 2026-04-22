import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { S } from "../../components/admin/adminStyles";
import { getSettings, updateSettings } from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiSaveLine } from "react-icons/ri";

const EMPTY = {
  businessName: "", tagline: "", email: "", phone: "",
  logo: "",
  address: "", city: "", postcode: "", country: "",
  instagram: "", facebook: "", pinterest: "", linkedin: "",
  metaTitle: "", metaDescription: "",
};

const AdminSettings = () => {
  const [form, setForm]   = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getSettings()
      .then((res) => {
        const d = res.data.settings || res.data.data || {};
        setForm({
          businessName:    d.businessName    || "",
          tagline:         d.tagline         || "",
          email:           d.email           || d.contact?.email || "",
          phone:           d.phone           || d.contact?.phone || "",
          address:         d.address         || d.contact?.address || "",
          city:            d.city            || "",
          postcode:        d.postcode        || "",
          country:         d.country         || "",
          instagram:       d.instagram       || d.social?.instagram || "",
          facebook:        d.facebook        || d.social?.facebook  || "",
          pinterest:       d.pinterest       || d.social?.pinterest || "",
          linkedin:        d.linkedin        || d.social?.linkedin  || "",
          logo:            d.logo            || "",
          metaTitle:       d.metaTitle       || d.seo?.title        || "",
          metaDescription: d.metaDescription || d.seo?.description  || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(form);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const Section = ({ title, children }) => (
    <div style={{ ...S.card, marginBottom: "1.5rem" }}>
      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.15rem",
        fontWeight: 400,
        color: "#f0ece4",
        marginBottom: "1.5rem",
        paddingBottom: "0.75rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>{title}</h3>
      {children}
    </div>
  );

  if (loading) return (
    <AdminLayout title="Site Settings">
      <p style={{ color: "#5a5550", textAlign: "center", padding: "3rem" }}>Loading settings…</p>
    </AdminLayout>
  );

  return (
    <AdminLayout
      title="Site Settings"
      actions={
        <button style={S.btnGold} onClick={handleSave} disabled={saving}>
          <RiSaveLine />
          {saving ? "Saving…" : "Save Settings"}
        </button>
      }
    >
      <Section title="Business Information">
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Business Name</label>
            <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="UKS Interiors" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Tagline</label>
            <input name="tagline" value={form.tagline} onChange={handleChange} placeholder="Award-winning European luxury design" style={S.input} />
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Logo URL</label>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <input 
               name="logo" 
               value={form.logo} 
               onChange={handleChange} 
               placeholder="/logo.png" 
               style={{ ...S.input, flex: 1 }} 
            />
            {form.logo && (
              <img 
                src={form.logo} 
                alt="Logo Preview" 
                style={{ height: "30px", border: "1px solid rgba(255,255,255,0.1)", padding: "2px", background: "#000" }} 
              />
            )}
          </div>
          <p style={{ fontSize: "0.65rem", color: "#5a5550", marginTop: "0.25rem" }}>
            Use "/logo.png" for the local logo or paste a Cloudinary URL.
          </p>
        </div>
      </Section>

      <Section title="Contact Information">
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="info@uksinteriors.com" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+44 123 456 7890" style={S.input} />
          </div>
        </div>
        <div style={S.field}>
          <label style={S.label}>Address</label>
          <input name="address" value={form.address} onChange={handleChange} placeholder="123 Design Quarter" style={S.input} />
        </div>
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>City</label>
            <input name="city" value={form.city} onChange={handleChange} placeholder="London" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Postcode</label>
            <input name="postcode" value={form.postcode} onChange={handleChange} placeholder="W1K 4AB" style={S.input} />
          </div>
        </div>
      </Section>

      <Section title="Social Media">
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Instagram URL</label>
            <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://instagram.com/uksinteriors" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Facebook URL</label>
            <input name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://facebook.com/uksinteriors" style={S.input} />
          </div>
        </div>
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Pinterest URL</label>
            <input name="pinterest" value={form.pinterest} onChange={handleChange} placeholder="https://pinterest.com/uksinteriors" style={S.input} />
          </div>
          <div style={S.field}>
            <label style={S.label}>LinkedIn URL</label>
            <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/company/uksinteriors" style={S.input} />
          </div>
        </div>
      </Section>

      <Section title="SEO Defaults">
        <div style={S.field}>
          <label style={S.label}>Default Meta Title</label>
          <input name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder="UKS Interiors | Luxury European Design" style={S.input} />
        </div>
        <div style={S.field}>
          <label style={S.label}>Default Meta Description</label>
          <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} placeholder="Award-winning European luxury interior design…" style={{ ...S.textarea, minHeight: "80px" }} />
        </div>
      </Section>
    </AdminLayout>
  );
};

export default AdminSettings;