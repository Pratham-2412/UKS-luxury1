require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const connectDB = require("../config/db");

const seedAdmin = async () => {
  await connectDB();

  try {
    // Check if admin already exists
    const existing = await User.findOne({ email: "admin@luxuryinteriors.com" });

    if (existing) {
      console.log("⚠️  Admin user already exists.");
      console.log(`   Email: admin@luxuryinteriors.com`);
      process.exit(0);
    }

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@luxuryinteriors.com",
      password: "Admin@123456",
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   Name  : ${admin.name}`);
    console.log(`   Email : admin@luxuryinteriors.com`);
    console.log(`   Pass  : Admin@123456`);
    console.log("   ⚠️  Change this password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();