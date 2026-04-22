// src/components/common/EnquiryModal.jsx
import { useState } from "react";
import { RiCloseLine, RiSendPlaneLine } from "react-icons/ri";
import api from "../../api/axios";

const EnquiryModal = ({ onClose, defaultSubject = "" }) => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: defaultSubject, message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await api.post("/enquiries", form);
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-white/12 py-3 text-[0.875rem] text-[#f0ece4] placeholder:text-[#5a5550] outline-none focus:border-[#c4a064] transition-colors duration-200";
  const labelClass = "text-[0.6rem] tracking-[0.2em] uppercase text-[#5a5550] mb-1 block";

  return (
    <div
      className="fixed inset-0 z-[250] bg-black/75 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[580px] bg-[#111111] border border-white/7 border-t-2 border-t-[#c4a064]/60 p-8 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-[#5a5550] hover:text-[#f0ece4] transition-colors cursor-pointer text-xl"
        >
          <RiCloseLine />
        </button>

        {sent ? (
          <div className="flex flex-col items-center gap-5 py-8 text-center">
            <div className="w-14 h-14 rounded-full border border-[#c4a064]/40 flex items-center justify-center text-[#c4a064] text-2xl">
              ✓
            </div>
            <h3 className="font-serif text-[1.5rem] font-light text-[#f0ece4]">
              Enquiry Sent
            </h3>
            <p className="text-[0.85rem] text-[#5a5550] leading-[1.7]">
              Thank you, we'll be in touch within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-8 py-3 bg-gradient-to-r from-[#c4a064] to-[#a07840] text-[#0a0a0a] text-[0.7rem] tracking-[0.15em] uppercase cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="text-[0.6rem] tracking-[0.25em] uppercase text-[#c4a064]">
                Get in Touch
              </span>
              <h3 className="font-serif text-[1.6rem] font-light text-[#f0ece4] mt-1">
                Send an Enquiry
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Name *</label>
                  <input className={inputClass} name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input className={inputClass} name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input className={inputClass} name="phone" value={form.phone} onChange={handleChange} placeholder="+44 7700 000000" />
                </div>
                <div>
                  <label className={labelClass}>Subject</label>
                  <input className={inputClass} name="subject" value={form.subject} onChange={handleChange} placeholder="What can we help with?" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Message *</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  rows={5}
                  required
                />
              </div>

              {error && (
                <p className="text-[0.78rem] text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[#c4a064] to-[#a07840] text-[#0a0a0a] text-[0.72rem] tracking-[0.15em] uppercase transition-all duration-300 hover:from-[#e8d5a3] hover:to-[#c4a064] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {sending ? "Sending…" : <><RiSendPlaneLine /> Send Enquiry</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;