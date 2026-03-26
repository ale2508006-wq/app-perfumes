const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { syncUser, getProfile } = require("../controllers/authController");

router.post("/sync", authMiddleware, syncUser);
router.get("/me", authMiddleware, getProfile);

module.exports = router;