export function normalizeRole(role) {
  const value = String(role || "").trim().toLowerCase();

  if (value === "admin" || value === "administrador") {
    return "administrador";
  }

  return "usuario";
}

export function isAdminRole(role) {
  return normalizeRole(role) === "administrador";
}

export function isUserRole(role) {
  return normalizeRole(role) === "usuario";
}

export function getDefaultRouteByRole(role) {
  return isAdminRole(role) ? "/admin" : "/products";
}