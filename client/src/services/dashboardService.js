import api from "./api";

export const getDashboardStats = () => {
  return api.get("/dashboard/stats");
};

export const getRecentActivity = () => {
  return api.get("/dashboard/recent-activity");
};

export const getMyLostItems = () => {
  return api.get("/dashboard/my-lost-items");
};

export const getMyFoundItems = () => {
  return api.get("/dashboard/my-found-items");
};