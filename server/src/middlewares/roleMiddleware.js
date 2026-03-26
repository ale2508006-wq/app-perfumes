const { normalizeRole } = require("../utils/roles");

function roleMiddleware(...allowedRoles) {
  const normalizedAllowedRoles = allowedRoles.map((role) => normalizeRole(role));

  return (req, res, next) => {
    const userRole = normalizeRole(req.user?.role);

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción",
      });
    }

    next();
  };
}

module.exports = roleMiddleware;