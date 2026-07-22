import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import { getLostItemById, updateLostItem } from "../../services/lostItemService";
import { getImageUrl } from "../../utils/imageUtils";
import { HiArrowLeft, HiPhoto } from "react-icons/hi2";

const CATEGORIES = [
  "Electronics", "Documents", "Wallet", "Keys",
  "Bags", "Clothing", "Accessories", "Books", "Others",
];

function EditLostItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [imageHover, setImageHover] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    dateLost: "",
  });

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await getLostItemById(id);
      const item = res.data.lostItem;
      setFormData({
        title: item.title || "",
        description: item.description || "",
        category: item.category || "",
        location: item.location || "",
        dateLost: item.dateLost ? item.dateLost.split("T")[0] : "",
      });
      setExistingImage(getImageUrl(item.image));
    } catch (error) {
      toast.error("Item not found.");
      navigate("/lost-items");
    } finally {
      setLoading(false);
    }
  };

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
    const { title, description, category, location, dateLost } = formData;

    if (!title || !description || !category || !location || !dateLost) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("category", category);
      data.append("location", location);
      data.append("dateLost", dateLost);
      if (imageFile) data.append("image", imageFile);

      await updateLostItem(id, data);
      toast.success("Item updated successfully!");
      navigate(`/lost-items/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update item.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    border: focusedField === name ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0",
    borderRadius: 14,
    padding: "13px 16px",
    fontSize: 14,
    color: "#1E293B",
    fontFamily: "inherit",
    outline: "none",
    background: "#fff",
    transition: "all 0.25s ease",
    boxShadow: focusedField === name ? "0 0 0 4px rgba(37,99,235,0.1)" : "none",
  });

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
    marginBottom: 8,
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 44, height: 44,
                border: "4px solid #E2E8F0",
                borderTopColor: "#2563EB",
                borderRadius: "50%",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "#94A3B8", fontSize: 14, fontWeight: 500 }}>Loading item...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const currentImage = imagePreview || existingImage;

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
            background: "radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)",
            filter: "blur(30px)", pointerEvents: "none",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 2 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #2563EB, #3B82F6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
            }}>
              ✏️
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>Edit Lost Item</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, marginTop: 4 }}>
                Update the details of your lost item report.
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
            padding: 36,
            border: "1px solid #F1F5F9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <form onSubmit={handleSubmit}>

            {/* Image Upload */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Item Photo</label>
              <div
                onClick={() => fileRef.current?.click()}
                onMouseEnter={() => setImageHover(true)}
                onMouseLeave={() => setImageHover(false)}
                style={{
                  border: imageHover ? "2px dashed #3B82F6" : "2px dashed #E2E8F0",
                  borderRadius: 16,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 0.25s",
                  height: currentImage ? "auto" : 180,
                }}
              >
                {currentImage ? (
                  <img src={currentImage} alt="Preview" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{
                    height: "100%", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 8,
                    color: "#94A3B8",
                  }}>
                    <HiPhoto style={{ fontSize: 40, color: imageHover ? "#3B82F6" : "#CBD5E1", transition: "color 0.2s" }} />
                    <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>Click to upload image</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setImageFile(null); }}
                  style={{
                    marginTop: 8, fontSize: 12, color: "#EF4444", fontWeight: 600,
                    background: "none", border: "none", cursor: "pointer",
                  }}
                >
                  Remove new image
                </button>
              )}
            </div>

            {/* Title */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Item Name <span style={{ color: "#EF4444" }}>*</span></label>
              <input
                type="text" name="title"
                value={formData.title} onChange={handleChange}
                onFocus={() => setFocusedField("title")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle("title")}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Description <span style={{ color: "#EF4444" }}>*</span></label>
              <textarea
                name="description" rows={4}
                value={formData.description} onChange={handleChange}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
                style={{ ...inputStyle("description"), resize: "none" }}
              />
            </div>

            {/* Category + Location */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Category <span style={{ color: "#EF4444" }}>*</span></label>
                <select
                  name="category" value={formData.category} onChange={handleChange}
                  onFocus={() => setFocusedField("category")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle("category")}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Location <span style={{ color: "#EF4444" }}>*</span></label>
                <input
                  type="text" name="location"
                  value={formData.location} onChange={handleChange}
                  onFocus={() => setFocusedField("location")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle("location")}
                />
              </div>
            </div>

            {/* Date Lost */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Date Lost <span style={{ color: "#EF4444" }}>*</span></label>
              <input
                type="date" name="dateLost"
                value={formData.dateLost} onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                onFocus={() => setFocusedField("dateLost")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle("dateLost")}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 14 }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  flex: 1, padding: 14, borderRadius: 14,
                  border: "1.5px solid #E2E8F0", background: "transparent",
                  color: "#475569", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.target.style.background = "#F8FAFC"; e.target.style.borderColor = "#CBD5E1"; }}
                onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "#E2E8F0"; }}
              >
                Cancel
              </button>
              <button
                type="submit" disabled={saving}
                style={{
                  flex: 1, padding: 14, borderRadius: 14,
                  border: "none", fontFamily: "inherit",
                  background: saving ? "rgba(37,99,235,0.5)" : "linear-gradient(135deg, #2563EB, #3B82F6)",
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: saving ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                  transition: "all 0.25s",
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </MainLayout>
  );
}

export default EditLostItem;
