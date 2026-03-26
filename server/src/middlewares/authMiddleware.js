const admin = require("../config/firebaseAdmin");
const User = require("../models/User");
const { normalizeRole } = require("../utils/roles");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token no proporcionado",
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    const email = (decodedToken.email || "").trim().toLowerCase();

    const dbUser = await User.findOne({
      $or: [{ firebaseUid: decodedToken.uid }, { email }],
    });

    req.user = {
      uid: decodedToken.uid,
      email,
      name: decodedToken.name || decodedToken.displayName || "",
      role: normalizeRole(dbUser?.role),
      dbUserId: dbUser?._id || null,
    };

    next();
  } catch (error) {
    console.error("Error verificando token:", error);
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
}

module.exports = authMiddleware;