import api from "./api";

export const getFoundItems = (params) => {
  return api.get("/found-items", { params });
};

export const getFoundItemById = (id) => {
  return api.get(`/found-items/${id}`);
};

export const createFoundItem = (formData) => {
  return api.post("/found-items", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateFoundItem = (id, formData) => {
  return api.put(`/found-items/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteFoundItem = (id) => {
  return api.delete(`/found-items/${id}`);
};
