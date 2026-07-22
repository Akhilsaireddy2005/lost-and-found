import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import { getFoundItemById, updateFoundItem } from "../../services/foundItemService";
import { getImageUrl } from "../../utils/imageUtils";
import { HiArrowLeft, HiPhoto } from "react-icons/hi2";

const CATEGORIES = [
  "Electronics", "Documents", "Wallet", "Keys",
  "Bags", "Clothing", "Accessories", "Books", "Others",
];

function EditFoundItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "", description: "", category: "", location: "", dateFound: "",
  });

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await getFoundItemById(id);
      const item = res.data.foundItem;
      setFormData({
        title: item.title || "",
        description: item.description || "",
        category: item.category || "",
        location: item.location || "",
        dateFound: item.dateFound ? item.dateFound.split("T")[0] : "",
      });
      setExistingImage(getImageUrl(item.image));
    } catch {
      toast.error("Item not found.");
      navigate("/found-items");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
      setSaving(true);
      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("category", category);
      data.append("location", location);
      data.append("dateFound", dateFound);
      if (imageFile) data.append("image", imageFile);

      await updateFoundItem(id, data);
      toast.success("Item updated successfully!");
      navigate(`/found-items/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update item.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const currentImage = imagePreview || existingImage;

  return (
    <MainLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
        <HiArrowLeft /> Back
      </button>

      <div className="max-w-[840px] mx-auto">
        {/* Header Banner */}
        <div style={{
          background: "linear-gradient(135deg, #0F172A, #1E293B)",
          borderRadius: 24,
          padding: "32px 36px",
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
        }}>
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
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.4px", margin: 0 }}>
                Edit Found Item
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, marginTop: 4 }}>
                Update the details of your found item report
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Photo</label>
              <div onClick={() => fileRef.current?.click()} className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-green-400 transition">
                {currentImage ? (
                  <img src={currentImage} alt="Preview" className="w-full h-48 object-cover" />
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <HiPhoto className="text-4xl" />
                    <p className="text-sm">Click to upload image</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {imagePreview && <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="mt-2 text-xs text-red-500 hover:text-red-700">Remove new image</button>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Name <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white">
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location <span className="text-red-500">*</span></label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date Found <span className="text-red-500">*</span></label>
              <input type="date" name="dateFound" value={formData.dateFound} onChange={handleChange} max={new Date().toISOString().split("T")[0]} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-60 text-sm">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default EditFoundItem;
