const { validationResult } = require("express-validator");
const Enquiry = require("../models/Enquiry.model");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

// ─── POST /api/enquiries (public — form submit) ───────────────────────────────
const submitEnquiry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 400;
      return next(error);
    }

    const {
      name,
      email,
      phone,
      message,
      inquiryType,
      collectionRef,
      productRef,
      preferredContactMethod,
    } = req.body;

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      message,
      inquiryType: inquiryType || "general",
      collectionRef: collectionRef || null,
      productRef: productRef || null,
      preferredContactMethod: preferredContactMethod || "email",
      ipAddress: req.ip || "",
    });

    res.status(201).json({
      success: true,
      message: "Your enquiry has been submitted. We will get back to you shortly.",
      enquiry: {
        id: enquiry._id,
        name: enquiry.name,
        email: enquiry.email,
        createdAt: enquiry.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/enquiries (admin — all enquiries) ───────────────────────────────
const getAllEnquiries = async (req, res, next) => {
  try {
    const { status, inquiryType, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (inquiryType) filter.inquiryType = inquiryType;

    const skip = (Number(page) - 1) * Number(limit);

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Enquiry.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/enquiries/:id (admin) ──────────────────────────────────────────
const getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      const error = new Error("Enquiry not found.");
      error.statusCode = 404;
      return next(error);
    }

    // Auto-mark as read when admin opens it
    if (enquiry.status === "new") {
      enquiry.status = "read";
      await enquiry.save();
    }

    res.status(200).json({ success: true, enquiry });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/enquiries/:id (admin — update status + notes) ──────────────────
const updateEnquiry = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const allowedStatuses = ["new", "read", "in-progress", "resolved", "closed"];
    if (status && !allowedStatuses.includes(status)) {
      const error = new Error("Invalid status value.");
      error.statusCode = 400;
      return next(error);
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      const error = new Error("Enquiry not found.");
      error.statusCode = 404;
      return next(error);
    }

    // ─── SEND REPLIES BASED ON PREFERENCE ──────────────────────────────────────
    if (adminNotes && (status === "in-progress" || status === "resolved")) {
      // 1. If preferred method is Email
      if (enquiry.preferredContactMethod === "email") {
        try {
        await sendEmail({
          to: enquiry.email,
          subject: `UKS Interiors | Update regarding your ${enquiry.inquiryType} inquiry`,
          html: `
            <div style="background-color: #0a0a0a; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f0ece4; text-align: center;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #141414; border: 1px solid #2a2a2a; border-top: 4px solid #c4a064; padding: 40px; border-radius: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
                <h1 style="color: #c4a064; font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px; font-family: serif;">UKS Interiors</h1>
                
                <h2 style="color: #ffffff; font-size: 18px; font-weight: 400; margin-bottom: 20px;">Dear ${enquiry.name},</h2>
                
                <p style="font-size: 16px; line-height: 1.8; color: #a09880; margin-bottom: 30px; font-style: italic;">
                  "Thank you for your interest in our bespoke collections. Our team has reviewed your inquiry and we are pleased to provide the following update."
                </p>

                <div style="background-color: #1a1a1a; padding: 30px; border-radius: 4px; margin-bottom: 30px; border: 1px solid #222; text-align: left;">
                  <p style="margin: 0; font-size: 16px; line-height: 1.8; color: #f0ece4;">
                    ${adminNotes.replace(/\n/g, '<br/>')}
                  </p>
                </div>

                <p style="font-size: 13px; color: #666; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 40px;">
                  Inquiry Type: ${enquiry.inquiryType.toUpperCase()} | Reference: #${enquiry._id.toString().slice(-6).toUpperCase()}
                </p>

                <hr style="border: 0; border-top: 1px solid #222; margin-bottom: 30px;" />

                <p style="font-size: 14px; line-height: 1.6; color: #888;">
                  If you have further questions or would like to visit our showroom, please reply to this email or contact us directly on WhatsApp.
                </p>
                
                <p style="margin-top: 30px; font-size: 14px; color: #c4a064; letter-spacing: 1px;">
                  ELEGANCE IN EVERY DETAIL<br/>
                  <span style="color: #666;">www.uks-interiors.co.uk</span>
                </p>
              </div>
              <p style="margin-top: 20px; font-size: 11px; color: #444;">&copy; ${new Date().getFullYear()} UKS Interiors Luxury Collection. All rights reserved.</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send reply email:", emailErr.message);
      }
    }
  }
    res.status(200).json({ success: true, enquiry });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/enquiries/:id (admin) ───────────────────────────────────────
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      const error = new Error("Enquiry not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, message: "Enquiry deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/enquiries/stats (admin — counts by status) ─────────────────────
const getEnquiryStats = async (req, res, next) => {
  try {
    const stats = await Enquiry.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = {
      new: 0,
      read: 0,
      "in-progress": 0,
      resolved: 0,
      closed: 0,
      total: 0,
    };

    stats.forEach((s) => {
      formatted[s._id] = s.count;
      formatted.total += s.count;
    });

    res.status(200).json({ success: true, stats: formatted });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryStats,
};