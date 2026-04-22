// src/components/contact/InquiryForm.jsx
import { useState } from "react";
import { submitEnquiry } from "../../api/enquiryApi";
import { RiSendPlaneLine, RiCheckLine, RiErrorWarningLine } from "react-icons/ri";

const INQUIRY_TYPES = [
  { value: "",                label: "Select Inquiry Type",         disabled: true },
  { value: "general",         label: "General Inquiry" },
  { value: "consultation",    label: "Free Consultation Request" },
  { value: "bespoke-kitchen", label: "Bespoke Kitchen" },
  { value: "wardrobe",        label: "Wardrobes & Storage" },
  { value: "living-room",     label: "Living Room Design" },
  { value: "dining-room",     label: "Dining Room Design" },
  { value: "home-office",     label: "Home Office Design" },
  { value: "full-project",    label: "Full Project / Renovation" },
  { value: "shop",            label: "Shop / Product Inquiry" },
  { value: "other",           label: "Other" },
];

const BUDGET_RANGES = [
  { value: "",          label: "Select Budget Range (optional)", disabled: true },
  { value: "under-5k",  label: "Under £5,000" },
  { value: "5k-15k",    label: "£5,000 – £15,000" },
  { value: "15k-30k",   label: "£15,000 – £30,000" },
  { value: "30k-60k",   label: "£30,000 – £60,000" },
  { value: "60k-plus",  label: "£60,000+" },
  { value: "undecided", label: "Not Decided Yet" },
];

const INITIAL = {
  name: "", email: "", phone: "",
  inquiryType: "", budget: "",
  message: "", preferredContact: "email",
};

const inputBase = "w-full bg-[#111111] border text-[0.85rem] text-[#f0ece4] placeholder:text-[#3a3530] px-4 py-3 outline-none transition-colors duration-200 font-sans font-light";
const inputNormal = "border-white/10 focus:border-[#c4a064]/50";
const inputError  = "border-red-500/50 focus:border-red-500/70";

const Label = ({ htmlFor, required, children }) => (
  <label htmlFor={htmlFor} className="block text-[0.65rem] tracking-[0.18em] uppercase text-white/60 font-medium mb-3">
    {children}
    {required && <span className="text-[#c4a064] ml-1.5">*</span>}
  </label>
);

const ErrorMsg = ({ msg }) => (
  <span className="block mt-2 text-[0.7rem] text-red-400/90 font-medium tracking-wide">{msg}</span>
);

const InquiryForm = () => {
  const [form, setForm]     = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())    errs.name = "Your name is required.";
    if (!form.email.trim())   errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email address.";
    if (!form.inquiryType)    errs.inquiryType = "Please select an inquiry type.";
    if (!form.message.trim()) errs.message = "Please tell us about your project.";
    else if (form.message.trim().length < 20)
      errs.message = "Message must be at least 20 characters.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStatus("loading");
    setErrMsg("");
    try {
      await submitEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        inquiryType: form.inquiryType,
        message: form.message.trim(),
        preferredContactMethod: form.preferredContact,
        // Any other meta data if needed
      });
      setStatus("success");
      setForm(INITIAL);
    } catch (err) {
      setStatus("error");
      setErrMsg(err.response?.data?.message || "Something went wrong. Please try again or email us directly.");
    }
  };

  /* ── Success state ── */
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 border border-white/7 bg-[#111111] text-center px-8">
        <div className="w-14 h-14 rounded-full border border-[#c4a064]/40 bg-[#c4a064]/10 flex items-center justify-center text-[#c4a064] text-2xl">
          <RiCheckLine />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-serif text-[1.5rem] font-light text-[#f0ece4]">
            Inquiry Received
          </h3>
          <p className="text-[0.85rem] text-[#a09880] leading-[1.8] max-w-[380px]">
            Thank you for reaching out. A member of our team will be in touch
            within 24 hours to discuss your project.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="text-[0.65rem] tracking-[0.15em] uppercase text-[#c4a064] border border-[#c4a064]/30 px-6 py-3 hover:bg-[#c4a064]/8 transition-all duration-200 cursor-pointer"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] border border-white/7 p-8 lg:p-10">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">

        {/* Header */}
        <div className="flex flex-col gap-3 pb-8 border-b border-white/7 mb-4">
          <span className="flex items-center gap-2 text-[0.6rem] tracking-[0.25em] uppercase text-[#c4a064] animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="w-6 h-px bg-[#c4a064] opacity-50" />
            Send a Message
          </span>
          <h3 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-light text-[#f0ece4] animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Start Your <em className="italic text-[#c4a064]">Project</em>
          </h3>
          <p className="text-[0.9rem] text-white/60 leading-relaxed font-light animate-fade-up" style={{ animationDelay: '0.3s' }}>
            Fill in the details below and we'll get back to you within 24 hours.
          </p>
        </div>

        {/* Row 1 — Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="ct-name" required>Full Name</Label>
            <input
              id="ct-name" name="name" type="text"
              value={form.name} onChange={handleChange}
              placeholder="Your full name" autoComplete="name"
              className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
            />
            {errors.name && <ErrorMsg msg={errors.name} />}
          </div>
          <div>
            <Label htmlFor="ct-email" required>Email Address</Label>
            <input
              id="ct-email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="your@email.com" autoComplete="email"
              className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
            />
            {errors.email && <ErrorMsg msg={errors.email} />}
          </div>
        </div>

        {/* Row 2 — Phone + Inquiry Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="ct-phone" required>Phone Number</Label>
            <input
              id="ct-phone" name="phone" type="tel"
              value={form.phone} onChange={handleChange}
              placeholder="+44 7700 000000" autoComplete="tel"
              className={`${inputBase} ${errors.phone ? inputError : inputNormal}`}
            />
            {errors.phone && <ErrorMsg msg={errors.phone} />}
          </div>
          <div>
            <Label htmlFor="ct-type" required>Inquiry Type</Label>
            <select
              id="ct-type" name="inquiryType"
              value={form.inquiryType} onChange={handleChange}
              className={`${inputBase} ${errors.inquiryType ? inputError : inputNormal} cursor-pointer`}
            >
              {INQUIRY_TYPES.map((t) => (
                <option key={t.value} value={t.value} disabled={t.disabled}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.inquiryType && <ErrorMsg msg={errors.inquiryType} />}
          </div>
        </div>

        {/* Row 3 — Budget + Preferred Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="ct-budget">Budget Range</Label>
            <select
              id="ct-budget" name="budget"
              value={form.budget} onChange={handleChange}
              className={`${inputBase} ${inputNormal} cursor-pointer`}
            >
              {BUDGET_RANGES.map((b) => (
                <option key={b.value} value={b.value} disabled={b.disabled}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Preferred Contact Method</Label>
            <div className="flex items-center gap-5 h-[46px]">
              {["email", "phone", "whatsapp"].map((method) => (
                <label key={method} className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-150 ${form.preferredContact === method ? "border-[#c4a064] bg-[#c4a064]/15" : "border-white/20 group-hover:border-white/40"}`}>
                    {form.preferredContact === method && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c4a064]" />
                    )}
                  </div>
                  <input
                    type="radio" name="preferredContact" value={method}
                    checked={form.preferredContact === method}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-[0.75rem] text-white/80 group-hover:text-[#c4a064] transition-colors duration-150 capitalize font-light">
                    {method}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="ct-message" required>Tell Us About Your Project</Label>
          <textarea
            id="ct-message" name="message"
            value={form.message} onChange={handleChange}
            placeholder="Describe your space, vision, timeline, and any specific requirements..."
            rows={6}
            className={`${inputBase} resize-none leading-relaxed ${errors.message ? inputError : inputNormal}`}
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className={`text-[0.65rem] ${form.message.length > 0 && form.message.length < 20 ? "text-amber-500" : "text-[#3a3530]"}`}>
              {form.message.length} characters
              {form.message.length > 0 && form.message.length < 20 && " (minimum 20)"}
            </span>
          </div>
          {errors.message && <ErrorMsg msg={errors.message} />}
        </div>

        {/* API error */}
        {status === "error" && (
          <div className="flex items-start gap-3 px-4 py-3.5 bg-red-500/8 border border-red-500/25 text-[0.82rem] text-red-400">
            <RiErrorWarningLine className="text-base flex-shrink-0 mt-0.5" />
            <span>{errMsg}</span>
          </div>
        )}

        {/* Privacy */}
        <p className="text-[0.68rem] text-[#a09880] leading-relaxed">
          By submitting this form you agree to our privacy policy.
          We never share your information with third parties.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#c4a064] to-[#a07840] text-[#0a0a0a] text-[0.68rem] tracking-[0.15em] uppercase transition-all duration-300 hover:from-[#e8d5a3] hover:to-[#c4a064] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
        >
          {status === "loading" ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] animate-bounce [animation-delay:0s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] animate-bounce [animation-delay:0.3s]" />
            </span>
          ) : (
            <>Send Inquiry <RiSendPlaneLine className="text-sm" /></>
          )}
        </button>

      </form>
    </div>
  );
};

export default InquiryForm;