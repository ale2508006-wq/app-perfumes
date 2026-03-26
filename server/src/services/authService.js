const User = require("../models/User");

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function resolveRoleByEmail(email) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const adminEmails = getAdminEmails();

  if (adminEmails.includes(normalizedEmail)) {
    return "administrador";
  }

  return "usuario";
}

async function syncUserWithFirebase(decodedToken) {
  const firebaseUid = decodedToken.uid;
  const email = (decodedToken.email || "").trim().toLowerCase();
  const name =
    decodedToken.name ||
    decodedToken.displayName ||
    email.split("@")[0] ||
    "Usuario";

  const role = resolveRoleByEmail(email);

  let user = await User.findOne({
    $or: [{ firebaseUid }, { email }],
  });

  if (!user) {
    user = await User.create({
      firebaseUid,
      email,
      name,
      role,
    });

    return user;
  }

  user.firebaseUid = firebaseUid;
  user.email = email;
  user.name = name;
  user.role = role;

  await user.save();

  return user;
}

module.exports = {
  syncUserWithFirebase,
  resolveRoleByEmail,
};