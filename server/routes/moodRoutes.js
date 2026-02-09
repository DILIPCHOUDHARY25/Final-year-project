const express = require("express");
const auth = require("../middleware/auth");
const { logMood, getMoodHistory, getGamificationData } = require("../controllers/moodController");

const router = express.Router();

router.post("/", auth, logMood);
router.get("/", auth, getMoodHistory);
router.get("/gamification", auth, getGamificationData);

module.exports = router;
