import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import ItemCard from "../../components/ui/ItemCard";
import SkeletonCard from "../../components/ui/SkeletonCard";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile, changePassword } from "../../services/authService";
import { getMyLostItems, getMyFoundItems } from "../../services/dashboardService";
import { getImageUrl } from "../../utils/imageUtils";
import {
  HiCamera,
  HiUser,
  HiEnvelope,
  HiPhone,
  HiShieldCheck,
  HiPencilSquare,
  HiKey,
  HiLockClosed,
  HiMagnifyingGlass,
  HiArchiveBox,
  HiPlus,
  HiCheckCircle,
  HiSparkles,
  HiArrowPath,
  HiXMark,
} from "react-icons/hi2";

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
      const token = localStorage.getItem("token");
      if (token) login(token, res.data.user);
      toast.success("Profile updated successfully!");
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
      toast.error("Please fill in all password fields.");
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
      toast.success("Password updated successfully!");
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
        <div className="flex items-center justify-center min-h-[65vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-500">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const avatarUrl = avatarPreview || getImageUrl(profileData?.avatar);
  const initial = profileData?.name?.[0]?.toUpperCase() || "U";

  const tabConfig = [
    { id: "overview", label: "Overview", icon: HiUser },
    { id: "lost-items", label: "My Lost Items", icon: HiMagnifyingGlass, badge: lostItems.length || undefined },
    { id: "found-items", label: "My Found Items", icon: HiArchiveBox, badge: foundItems.length || undefined },
    { id: "security", label: "Security", icon: HiShieldCheck },
  ];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header Hero */}
        <div className="relative rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Header Cover Banner */}
          <div className="h-36 sm:h-44 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Profile Card Body */}
          <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Avatar Container */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-white shadow-md overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!editMode) setEditMode(true);
                    setTimeout(() => fileRef.current?.click(), 50);
                  }}
                  className="absolute bottom-1 right-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg border-2 border-white transition-all transform hover:scale-105"
                  title="Change avatar"
                >
                  <HiCamera className="text-sm" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>

              {/* User Identity Details */}
              <div className="space-y-1 sm:mb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {profileData?.name}
                  </h1>
                  <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold ${
                    profileData?.role === "admin"
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-blue-50 text-blue-700 border border-blue-100"
                  }`}>
                    {profileData?.role === "admin" ? (
                      <>
                        <HiSparkles className="text-amber-600" /> Admin
                      </>
                    ) : (
                      <>
                        <HiCheckCircle className="text-blue-600" /> Verified User
                      </>
                    )}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <HiEnvelope className="text-slate-400 text-base shrink-0" />
                  {profileData?.email}
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all hover:shadow"
              >
                <HiPencilSquare className="text-base" /> Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditMode(false);
                  setAvatarPreview(null);
                  setAvatarFile(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all"
              >
                <HiXMark className="text-base" /> Cancel Editing
              </button>
            )}
          </div>
        </div>

        {/* Layout Grid: Sidebar Tabs + Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-2 shadow-sm space-y-1">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`text-lg ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Display Panel */}
          <div className="lg:col-span-9">
            {/* Overview Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Form or Info Display */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                      <p className="text-xs text-slate-500">Manage your basic account details and contact information.</p>
                    </div>
                  </div>

                  {editMode ? (
                    <form onSubmit={handleProfileSave} className="space-y-5 max-w-xl">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <HiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                            placeholder="e.g. +91 9876543210"
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditMode(false);
                            setAvatarPreview(null);
                            setAvatarFile(null);
                          }}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition disabled:opacity-60"
                        >
                          {saving ? (
                            <>
                              <HiArrowPath className="animate-spin text-base" /> Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-blue-100/80 text-blue-600 shrink-0">
                          <HiUser className="text-xl" />
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</span>
                          <span className="text-sm font-bold text-slate-800">{profileData?.name}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-indigo-100/80 text-indigo-600 shrink-0">
                          <HiEnvelope className="text-xl" />
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</span>
                          <span className="text-sm font-bold text-slate-800">{profileData?.email}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-emerald-100/80 text-emerald-600 shrink-0">
                          <HiPhone className="text-xl" />
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</span>
                          <span className="text-sm font-bold text-slate-800">
                            {profileData?.phone || <span className="text-slate-400 italic">Not provided</span>}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-purple-100/80 text-purple-600 shrink-0">
                          <HiShieldCheck className="text-xl" />
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Role</span>
                          <span className="text-sm font-bold text-slate-800">
                            {profileData?.role === "admin" ? "Administrator" : "Regular Member"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* My Lost Items Tab */}
            {activeTab === "lost-items" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">My Reported Lost Items</h2>
                </div>

                {itemsLoading ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : lostItems.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                      <HiMagnifyingGlass />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base">No lost items reported yet</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                      If you have lost something recently, report it here so the community can help you find it.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {lostItems.map((item) => (
                      <ItemCard key={item._id} item={item} type="lost" />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Found Items Tab */}
            {activeTab === "found-items" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">My Reported Found Items</h2>
                </div>

                {itemsLoading ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : foundItems.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                      <HiArchiveBox />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base">No found items reported yet</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                      Found an item that doesn't belong to you? Report it to reunite it with its owner.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {foundItems.map((item) => (
                      <ItemCard key={item._id} item={item} type="found" />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Security Settings</h2>
                  <p className="text-xs text-slate-500">Update your password and maintain account security.</p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <HiKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <HiKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                        placeholder="Re-enter new password"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={changingPw}
                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition disabled:opacity-60"
                  >
                    {changingPw ? (
                      <>
                        <HiArrowPath className="animate-spin text-base" /> Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;