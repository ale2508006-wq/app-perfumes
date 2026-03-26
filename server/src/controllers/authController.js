const User = require("../models/User");
const { normalizeRole } = require("../utils/roles");

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function syncUser(req, res) {
  try {
    const firebaseUid = req.user.uid;
    const email = (req.user.email || "").trim().toLowerCase();
    const name = req.user.name || email.split("@")[0] || "Usuario";

    const adminEmails = getAdminEmails();
    const selectedRole = String(req.body?.role || "usuario")
      .trim()
      .toLowerCase();

    const isAdminEmail = adminEmails.includes(email);
    const resolvedRole = isAdminEmail ? "administrador" : "usuario";

    if (selectedRole === "administrador" && !isAdminEmail) {
      return res.status(403).json({
        success: false,
        message: "Esta cuenta no tiene permisos de administrador",
      });
    }

    let user = await User.findOne({
      $or: [{ firebaseUid }, { email }],
    });

    if (!user) {
      user = await User.create({
        firebaseUid,
        email,
        name,
        role: normalizeRole(resolvedRole),
      });
    } else {
      user.firebaseUid = firebaseUid;
      user.email = email;
      user.name = name;
      user.role = normalizeRole(resolvedRole);
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Usuario sincronizado correctamente",
      data: user,
    });
  } catch (error) {
    console.error("Error en syncUser:", error);
    return res.status(500).json({
      success: false,
      message: "Error al sincronizar usuario",
    });
  }
}

async function getProfile(req, res) {
  try {
    const email = (req.user.email || "").trim().toLowerCase();

    const user = await User.findOne({
      $or: [{ firebaseUid: req.user.uid }, { email }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Perfil obtenido correctamente",
      data: user,
    });
  } catch (error) {
    console.error("Error en getProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener el perfil",
    });
  }
}

module.exports = {
  syncUser,
  getProfile,
};