export const setAccessType = (type) => {
  localStorage.setItem("accessType", type);
};

export const getAccessType = () => {
  return localStorage.getItem("accessType");
};

export const isAdminAccess = () => {
  return getAccessType() === "admin";
};

export const isUserAccess = () => {
  return getAccessType() === "user";
};

export const clearAccess = () => {
  localStorage.removeItem("accessType");
};