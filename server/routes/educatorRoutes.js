const express = require("express");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roleAuth");
const { getMoodStats } = require("../controllers/educatorController");

const router = express.Router();

router.get("/stats", auth, authorizeRoles("educator"), getMoodStats);

module.exports = router;
