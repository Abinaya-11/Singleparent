const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    doc: {
      type: String,
    },
    type: {
      type: String,
      enum: ["job", "thought", "hughand"],
      required: true,
    },
    // Job-specific fields
    jobDetails: {
      position: {
        type: String,
      },
      company: {
        type: String,
      },
      location: {
        type: String,
      },
      jobType: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Remote"],
      },
      jobDescription: {
        type: String,
      },
      applicationDeadline: {
        type: Date,
      },
      applicationLink: {
        type: String,
      },
    },
    // Hughand-specific fields
    hughandDetails: {
      title: {
        type: String,
      },
      category: {
        type: String,
        enum: ["Baby Gear", "Books & Toys", "Clothing", "Baby Essentials", "Hobbies", "Other"],
      },
      contactEmail: {
        type: String,
      },
      contactPhone: {
        type: String,
      },
      address: {
        type: String,
      },
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
