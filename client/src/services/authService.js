import api from "./api";

export const registerUser = (userData) => {
  return api.post("/auth/register", userData);
};

export const loginUser = (userData) => {
  return api.post("/auth/login", userData);
};

export const getProfile = () => {
  return api.get("/auth/profile");
};

export const updateProfile = (formData) => {
  return api.put("/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const changePassword = (data) => {
  return api.put("/auth/change-password", data);
};