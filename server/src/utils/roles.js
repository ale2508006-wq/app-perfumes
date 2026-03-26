function normalizeRole(role) {
  const value = String(role || "").trim().toLowerCase();

  if (value === "admin" || value === "administrador") {
    return "administrador";
  }

  return "usuario";
}

module.exports = {
  normalizeRole,
};