const express = require("express");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roleAuth");
const { linkChild } = require("../controllers/parentController");

const router = express.Router();

router.post("/link-child", auth, authorizeRoles("parent"), linkChild);

module.exports = router;
