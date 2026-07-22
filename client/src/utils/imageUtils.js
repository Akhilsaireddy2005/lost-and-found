const BASE_URL = import.meta.env.VITE_SERVER_URL || "https://lost-and-found-1-ryyr.onrender.com";

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${BASE_URL}${imagePath}`;
};
