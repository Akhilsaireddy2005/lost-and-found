import api from "./api";

export const getLostItems = (params) => {
  return api.get("/lost-items", { params });
};

export const getLostItemById = (id) => {
  return api.get(`/lost-items/${id}`);
};

export const createLostItem = (formData) => {
  return api.post("/lost-items", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateLostItem = (id, formData) => {
  return api.put(`/lost-items/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteLostItem = (id) => {
  return api.delete(`/lost-items/${id}`);
};