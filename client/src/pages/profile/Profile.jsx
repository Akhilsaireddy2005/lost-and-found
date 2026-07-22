import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import ItemCard from "../../components/ui/ItemCard";
import SkeletonCard from "../../components/ui/SkeletonCard";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile, changePassword } from "../../services/authService";
import { getMyLostItems, getMyFoundItems } from "../../services/dashboardService";
import { getImageUrl } from "../../utils/imageUtils";
import { HiCamera, HiUser, HiEnvelope, HiPhone, HiShieldCheck } from "react-icons/hi2";

const TABS = ["overview", "lost-items", "found-items", "security"];

function Profile() {
  const { user: authUser, login } = useAuth();
  const fileRef = useRef(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // Edit profile
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });

  // Change password
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "lost-items") fetchMyLostItems();
    if (activeTab === "found-items") fetchMyFoundItems();
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfileData(res.data.user);
      setProfileForm({ name: res.data.user.name || "", phone: res.data.user.phone || "" });
    } catch {
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLostItems = async () => {
    setItemsLoading(true);
    try {
      const res = await getMyLostItems();
      setLostItems(res.data.lostItems || []);
    } catch { } finally {
      setItemsLoading(false);
    }
  };

  const fetchMyFoundItems = async () => {
    setItemsLoading(true);
    try {
      const res = await getMyFoundItems();
      setFoundItems(res.data.foundItems || []);
    } catch { } finally {
      setItemsLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    try {
      setSaving(true);
      const data = new FormData();
      data.append("name", profileForm.name);
      data.append("phone", profileForm.phone);
      if (avatarFile) data.append("avatar", avatarFile);

      const res = await updateProfile(data);
      setProfileData(res.data.user);
      // Update auth context with new name
      const token = localStorage.getItem("token");
      if (token) login(token, res.data.user);
      toast.success("Profile updated!");
      setEditMode(false);
      setAvatarPreview(null);
      setAvatarFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      setChangingPw(true);
      await changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password.");
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const avatarUrl = avatarPreview || getImageUrl(profileData?.avatar);
  const initial = profileData?.name?.[0]?.toUpperCase() || "U";

  const tabConfig = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "lost-items", label: "My Lost Items", icon: "🔴" },
    { id: "found-items", label: "My Found Items", icon: "🟢" },
    { id: "security", label: "Security", icon: "🔒" },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {initial}
                </div>
              )}
              {editMode && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition"
                >
                  <HiCamera className="text-xs" />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{profileData?.name}</h1>
              <p className="text-gray-500 text-sm">{profileData?.email}</p>
              {profileData?.phone && (
                <p className="text-gray-500 text-sm">{profileData.phone}</p>
              )}
              <span className="inline-flex mt-2 items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {profileData?.role === "admin" ? "👑 Admin" : "👤 User"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="e.g. +91 9876543210"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setEditMode(false); setAvatarPreview(null); setAvatarFile(null); }} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-60">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {[
                  { icon: <HiUser />, label: "Full Name", value: profileData?.name },
                  { icon: <HiEnvelope />, label: "Email Address", value: profileData?.email },
                  { icon: <HiPhone />, label: "Phone Number", value: profileData?.phone || "Not provided" },
                  { icon: <HiShieldCheck />, label: "Account Role", value: profileData?.role === "admin" ? "Administrator" : "Regular User" },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-blue-500 text-lg">{icon}</span>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-sm font-medium text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "lost-items" && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Lost Items</h2>
            {itemsLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : lostItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-5xl mb-4">🔍</p>
                <p className="font-semibold text-gray-800">No lost items yet</p>
                <p className="text-gray-500 text-sm mt-1">Items you report as lost will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {lostItems.map((item) => <ItemCard key={item._id} item={item} type="lost" />)}
              </div>
            )}
          </div>
        )}

        {activeTab === "found-items" && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Found Items</h2>
            {itemsLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : foundItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-5xl mb-4">📦</p>
                <p className="font-semibold text-gray-800">No found items yet</p>
                <p className="text-gray-500 text-sm mt-1">Items you report as found will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {foundItems.map((item) => <ItemCard key={item._id} item={item} type="found" />)}
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="At least 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <button
                type="submit"
                disabled={changingPw}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition disabled:opacity-60"
              >
                {changingPw ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Profile;