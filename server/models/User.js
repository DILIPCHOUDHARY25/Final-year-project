const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["student", "parent", "educator"],
      default: "student"
    },
    children: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    moodLogs: [{
      mood: {
        type: Number,
        min: 1,
        max: 5
      },
      emoji: {
        type: String
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      sentiment: {
        label: {
          type: String
        },
        score: {
          type: Number
        }
      }
    }],
    parentPhone: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
