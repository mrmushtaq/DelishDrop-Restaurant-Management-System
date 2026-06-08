/**
 * seedAdmin.js — Run this ONCE to create the admin account
 *
 * Usage:
 *   node seedAdmin.js
 *
 * This is the ONLY way to create an admin. Public registration
 * always creates regular "user" accounts.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const ADMIN = {
  name: "DelishDrop Admin",
  email: "admin@delishdrop.com",    // ← change this
  password: "Admin@123456",         // ← change this to something strong
  phone: "0300-0000000",
  address: "Restaurant HQ",
  role: "admin",                    // ← only set here, never via API
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Prevent duplicate admin
    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      console.log("⚠️  Admin already exists:", existing.email);
      process.exit(0);
    }

    const admin = await User.create(ADMIN);
    console.log("✅ Admin created successfully!");
    console.log("   Email   :", admin.email);
    console.log("   Role    :", admin.role);
    console.log("   ID      :", admin._id);
    console.log("\n🔐 Keep these credentials safe and delete this log.");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
