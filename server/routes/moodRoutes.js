const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { mood, emoji, sentiment } = req.body;

    if (!mood || !emoji) {
      return res.status(400).json({ message: "Mood and emoji are required" });
    }

    if (mood < 1 || mood > 5) {
      return res.status(400).json({ message: "Mood must be between 1 and 5" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const moodEntry = {
      mood,
      emoji,
      timestamp: new Date(),
      sentiment: sentiment || null,
    };

    user.moodLogs.push(moodEntry);
    await user.save();

    return res.status(201).json({
      message: "Mood logged successfully",
      moodEntry,
      moodHistory: user.moodLogs,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to log mood", error: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("moodLogs");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ moodHistory: user.moodLogs });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch mood history", error: error.message });
  }
});

module.exports = router;
