import api from "./api";

export const getMyClaims = () => {
  return api.get("/claims/my-requests");
};

export const getReceivedClaims = () => {
  return api.get("/claims/received");
};

export const createClaim = (data) => {
  return api.post("/claims", data);
};

export const acceptClaim = (id) => {
  return api.put(`/claims/${id}/accept`);
};

export const rejectClaim = (id) => {
  return api.put(`/claims/${id}/reject`);
};

export const deleteClaim = (id) => {
  return api.delete(`/claims/${id}`);
};
