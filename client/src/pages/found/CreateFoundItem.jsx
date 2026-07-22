import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import { createFoundItem } from "../../services/foundItemService";
import { HiArrowLeft, HiPhoto, HiTrash, HiCalendar, HiMapPin, HiTag, HiDocumentText } from "react-icons/hi2";

const CATEGORIES = [
  "Electronics", "Documents", "Wallet", "Keys",
  "Bags", "Clothing", "Accessories", "Books", "Others",
];

function CreateFoundItem() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [imageHover, setImageHover] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    dateFound: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, category, location, dateFound } = formData;

    if (!title || !description || !category || !location || !dateFound) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("category", category);
      data.append("location", location);
      data.append("dateFound", dateFound);
      if (imageFile) data.append("image", imageFile);

      await createFoundItem(data);
      toast.success("Found item reported successfully!");
      navigate("/found-items");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to report item.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    border: focusedField === name ? "1.5px solid #16A34A" : "1.5px solid #E2E8F0",
    borderRadius: 14,
    padding: "13px 16px",
    fontSize: 14,
    color: "#1E293B",
    fontFamily: "inherit",
    outline: "none",
    background: "#fff",
    transition: "all 0.25s ease",
    boxShadow: focusedField === name ? "0 0 0 4px rgba(22,163,74,0.1)" : "none",
  });

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
    marginBottom: 8,
  };

  return (
    <MainLayout>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 14, color: "#64748B", fontWeight: 500,
          background: "none", border: "none", cursor: "pointer",
          marginBottom: 24, padding: 0, transition: "color 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#1E293B"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
      >
        <HiArrowLeft /> Back
      </button>

      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        {/* ── Header Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "linear-gradient(135deg, #0F172A, #1E293B)",
            borderRadius: 24,
            padding: "32px 36px",
            marginBottom: 28,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", top: "-30%", right: "-5%",
            width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)",
            filter: "blur(30px)", pointerEvents: "none",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 2 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #16A34A, #22C55E)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: "#fff",
              boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
            }}>
              🟢
            </div>
            <div>
              <h1 style={{
                fontSize: 22, fontWeight: 800, color: "#fff",
                letterSpacing: "-0.4px", margin: 0,
              }}>
                Report Found Item
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, marginTop: 4 }}>
                Fill in details of the item you found so the owner can claim it
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Form Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: "#fff",
            borderRadius: 24,
            border: "1px solid #F1F5F9",
            padding: 36,
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Image upload box */}
            <div>
              <label style={labelStyle}>Item Photo (optional)</label>
              <div
                onClick={() => fileRef.current?.click()}
                onMouseEnter={() => setImageHover(true)}
                onMouseLeave={() => setImageHover(false)}
                style={{
                  border: imageHover ? "2px dashed #16A34A" : "2px dashed #E2E8F0",
                  borderRadius: 18,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: imageHover ? "#F0FDF4" : "#FAFBFC",
                }}
              >
                {imagePreview ? (
                  <div style={{ position: "relative", width: "100%", height: 220 }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(0,0,0,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 13, fontWeight: 600,
                      opacity: imageHover ? 1 : 0, transition: "opacity 0.2s",
                    }}>
                      Click to change photo
                    </div>
                  </div>
                ) : (
                  <div style={{
                    height: 180, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 8,
                    color: "#94A3B8",
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: "#F1F5F9", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      color: "#64748B", fontSize: 22,
                    }}>
                      <HiPhoto />
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", margin: 0 }}>
                      Click to upload image
                    </p>
                    <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    marginTop: 8, fontSize: 12, fontWeight: 600,
                    color: "#DC2626", background: "none", border: "none",
                    cursor: "pointer",
                  }}
                >
                  <HiTrash /> Remove photo
                </button>
              )}
            </div>

            {/* Item Title */}
            <div>
              <label style={labelStyle}>
                Item Name <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Blue Backpack with laptop"
                value={formData.title}
                onChange={handleChange}
                onFocus={() => setFocusedField("title")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle("title")}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>
                Description <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the item in detail (color, brand, distinguishing features, contents)..."
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
                style={{ ...inputStyle("description"), resize: "none" }}
              />
            </div>

            {/* Category & Location */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16
            }}>
              <div>
                <label style={labelStyle}>
                  Category <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("category")}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle("category"), cursor: "pointer" }}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Found Location <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Library 2nd Floor, Main Street"
                  value={formData.location}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("location")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle("location")}
                />
              </div>
            </div>

            {/* Date Found */}
            <div>
              <label style={labelStyle}>
                Date Found <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="date"
                name="dateFound"
                value={formData.dateFound}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                onFocus={() => setFocusedField("dateFound")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle("dateFound")}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #16A34A, #22C55E)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
                transition: "all 0.25s ease",
                marginTop: 8,
              }}
            >
              {loading ? "Submitting Report..." : "Report Found Item"}
            </button>
          </form>
        </motion.div>
      </div>
    </MainLayout>
  );
}

export default CreateFoundItem;
