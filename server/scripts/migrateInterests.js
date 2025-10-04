const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("../models/user"); // adjust path if needed

// 🔑 Replace with your MongoDB connection string
const MONGO_URI = "mongodb://127.0.0.1:27017/yourDBname";

async function backupUsers(users) {
  const backupPath = path.join(__dirname, "users-backup.json");
  fs.writeFileSync(backupPath, JSON.stringify(users, null, 2));
  console.log(`📂 Backup saved to ${backupPath}`);
}

async function migrateInterests() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const users = await User.find({});
    console.log(`👥 Found ${users.length} users. Starting migration...`);

    // Backup before migration
    await backupUsers(users);

    for (let user of users) {
      let interests = user.interests;

      // Case 1: Already an array ✅
      if (Array.isArray(interests)) {
        // clean up any null/empty values
        user.interests = interests.filter(i => i && i.trim());
      } 
      // Case 2: String → try parse JSON
      else if (typeof interests === "string") {
        try {
          const parsed = JSON.parse(interests);
          if (Array.isArray(parsed)) {
            user.interests = parsed.filter(i => i && i.trim());
          } else if (parsed) {
            user.interests = [parsed];
          } else {
            user.interests = [];
          }
        } catch (err) {
          // Not JSON → maybe comma separated
          if (interests.includes(",")) {
            user.interests = interests.split(",").map(s => s.trim()).filter(Boolean);
          } else {
            user.interests = interests.trim() ? [interests.trim()] : [];
          }
        }
      } 
      // Case 3: Null/Undefined
      else {
        user.interests = [];
      }

      await user.save();
      console.log(`✅ Migrated: ${user.email} → ${JSON.stringify(user.interests)}`);
    }

    console.log("🎉 Migration completed successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Migration failed:", err);
    mongoose.disconnect();
  }
}

migrateInterests();
