import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
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
  HiCheckCircle,
  HiSparkles,
  HiArrowPath,
  HiXMark,
} from "react-icons/hi2";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "65vh" }}>
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
            <p style={{ color: "#94A3B8", fontSize: 14, fontWeight: 500 }}>Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const avatarUrl = avatarPreview || getImageUrl(profileData?.avatar);
  const initial = profileData?.name?.[0]?.toUpperCase() || "U";

  const tabs = [
    { id: "overview", label: "Overview", icon: HiUser },
    { id: "lost-items", label: "My Lost Items", icon: HiMagnifyingGlass, count: lostItems.length },
    { id: "found-items", label: "My Found Items", icon: HiArchiveBox, count: foundItems.length },
    { id: "security", label: "Security & Password", icon: HiShieldCheck },
  ];

  return (
    <MainLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* ── Executive Header Banner Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: "linear-gradient(135deg, #0F172A, #1E293B)",
            borderRadius: 24,
            padding: "36px 36px 32px",
            marginBottom: 24,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
          }}
        >
          {/* Subtle Ambient Background Gradients */}
          <div style={{
            position: "absolute", top: "-30%", right: "-5%",
            width: 320, height: 320, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 70%)",
            filter: "blur(40px)", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-40%", left: "15%",
            width: 280, height: 280, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
            filter: "blur(40px)", pointerEvents: "none",
          }} />

          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24,
          }}>
            {/* Left: Avatar & Info */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {/* Avatar Ring Container */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 84, height: 84, borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  padding: 3,
                  boxShadow: "0 8px 24px rgba(37,99,235,0.35)",
                }}>
                  <div style={{
                    width: "100%", height: "100%", borderRadius: "50%",
                    overflow: "hidden", background: "#1E293B",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 30, fontWeight: 800,
                  }}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span>{initial}</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!editMode) setEditMode(true);
                    setTimeout(() => fileRef.current?.click(), 50);
                  }}
                  style={{
                    position: "absolute", bottom: 0, right: 0,
                    width: 28, height: 28, borderRadius: "50%",
                    background: "#2563EB", color: "#fff",
                    border: "2px solid #0F172A",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: 13,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    transition: "transform 0.2s ease",
                  }}
                  title="Change avatar image"
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <HiCamera />
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
              </div>

              {/* Identity Details */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <h1 style={{
                    fontSize: 26, fontWeight: 800, color: "#FFFFFF",
                    letterSpacing: "-0.5px", margin: 0, lineHeight: 1.2,
                  }}>
                    {profileData?.name}
                  </h1>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "4px 12px", borderRadius: 99,
                    fontSize: 12, fontWeight: 700,
                    background: profileData?.role === "admin" ? "rgba(245,158,11,0.15)" : "rgba(37,99,235,0.2)",
                    color: profileData?.role === "admin" ? "#FBBF24" : "#60A5FA",
                    border: `1px solid ${profileData?.role === "admin" ? "rgba(245,158,11,0.3)" : "rgba(37,99,235,0.3)"}`,
                  }}>
                    {profileData?.role === "admin" ? (
                      <> <HiSparkles /> Admin </>
                    ) : (
                      <> <HiCheckCircle /> Verified Member </>
                    )}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                    <HiEnvelope style={{ color: "#60A5FA" }} /> {profileData?.email}
                  </span>
                  {profileData?.phone && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                      <HiPhone style={{ color: "#34D399" }} /> {profileData.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Action Button */}
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                  color: "#FFFFFF", border: "none", borderRadius: 14,
                  padding: "12px 22px", fontSize: 14, fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <HiPencilSquare style={{ fontSize: 18 }} /> Edit Profile
              </button>
            ) : (
              <button
                onClick={() => { setEditMode(false); setAvatarPreview(null); setAvatarFile(null); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.12)", color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14,
                  padding: "12px 20px", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              >
                <HiXMark style={{ fontSize: 18 }} /> Cancel Editing
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Stats Overview Bar ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16, marginBottom: 24,
        }}>
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            style={{
              background: "#FFF", borderRadius: 18, padding: "20px 22px",
              border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              display: "flex", alignItems: "center", gap: 16,
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: "#DC2626", flexShrink: 0,
            }}>
              <HiMagnifyingGlass />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                My Lost Items
              </p>
              <p style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0, marginTop: 2 }}>
                {lostItems.length} <span style={{ fontSize: 13, fontWeight: 500, color: "#64748B" }}>items reported</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            style={{
              background: "#FFF", borderRadius: 18, padding: "20px 22px",
              border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              display: "flex", alignItems: "center", gap: 16,
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: "#16A34A", flexShrink: 0,
            }}>
              <HiArchiveBox />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                My Found Items
              </p>
              <p style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0, marginTop: 2 }}>
                {foundItems.length} <span style={{ fontSize: 13, fontWeight: 500, color: "#64748B" }}>items reported</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            style={{
              background: "#FFF", borderRadius: 18, padding: "20px 22px",
              border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
              display: "flex", alignItems: "center", gap: 16,
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: "#2563EB", flexShrink: 0,
            }}>
              <HiShieldCheck />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                Account Security
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#16A34A", margin: 0, marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
                <HiCheckCircle /> Protected & Active
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Horizontal Navigation Tabs Bar ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          style={{
            background: "#FFF", borderRadius: 18, padding: 6,
            border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            marginBottom: 24, display: "flex", gap: 6, overflowX: "auto",
          }}
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "11px 20px", borderRadius: 14,
                  fontSize: 13.5, fontWeight: 700, cursor: "pointer",
                  border: "none", whiteSpace: "nowrap",
                  background: active ? "#2563EB" : "transparent",
                  color: active ? "#FFFFFF" : "#64748B",
                  boxShadow: active ? "0 4px 14px rgba(37,99,235,0.25)" : "none",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon style={{ fontSize: 17, color: active ? "#FFF" : "#94A3B8" }} />
                <span>{t.label}</span>
                {t.count !== undefined && t.count > 0 && (
                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 99,
                    background: active ? "rgba(255,255,255,0.25)" : "#F1F5F9",
                    color: active ? "#FFF" : "#475569",
                  }}>
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Main Active Panel ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          style={{
            background: "#FFF", borderRadius: 24, padding: "32px 36px",
            border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          }}
        >
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #F8FAFC",
              }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                    Personal Information
                  </h2>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, marginTop: 3 }}>
                    Manage your identity details, email, and contact phone number.
                  </p>
                </div>
              </div>

              {editMode ? (
                <form onSubmit={handleProfileSave} style={{ maxWidth: 540 }}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                      Full Name
                    </label>
                    <div style={{ position: "relative" }}>
                      <HiUser style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontSize: 18 }} />
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                        style={{
                          width: "100%", padding: "12px 14px 12px 42px",
                          borderRadius: 14, border: "1px solid #E2E8F0",
                          fontSize: 14, fontWeight: 500, color: "#0F172A",
                          outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                        }}
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                      Phone Number
                    </label>
                    <div style={{ position: "relative" }}>
                      <HiPhone style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontSize: 18 }} />
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                        style={{
                          width: "100%", padding: "12px 14px 12px 42px",
                          borderRadius: 14, border: "1px solid #E2E8F0",
                          fontSize: 14, fontWeight: 500, color: "#0F172A",
                          outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                        }}
                        placeholder="e.g. +91 9876543210"
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      type="button"
                      onClick={() => { setEditMode(false); setAvatarPreview(null); setAvatarFile(null); }}
                      style={{
                        padding: "12px 22px", borderRadius: 14, border: "1px solid #E2E8F0",
                        background: "#FFF", color: "#475569", fontSize: 13.5, fontWeight: 600,
                        cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      style={{
                        padding: "12px 28px", borderRadius: 14, border: "none",
                        background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                        color: "#FFF", fontSize: 13.5, fontWeight: 700,
                        cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
                        display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit",
                        opacity: saving ? 0.7 : 1,
                      }}
                    >
                      {saving ? (
                        <> <HiArrowPath style={{ animation: "spin 1s linear infinite" }} /> Saving... </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                  <div style={{
                    padding: "20px", borderRadius: 18, background: "#F8FAFC",
                    border: "1px solid #F1F5F9", display: "flex", alignItems: "flex-start", gap: 16,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#2563EB", fontSize: 20, flexShrink: 0,
                    }}>
                      <HiUser />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block" }}>
                        Full Name
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginTop: 4, display: "block" }}>
                        {profileData?.name}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    padding: "20px", borderRadius: 18, background: "#F8FAFC",
                    border: "1px solid #F1F5F9", display: "flex", alignItems: "flex-start", gap: 16,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#16A34A", fontSize: 20, flexShrink: 0,
                    }}>
                      <HiEnvelope />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block" }}>
                        Email Address
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginTop: 4, display: "block" }}>
                        {profileData?.email}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    padding: "20px", borderRadius: 18, background: "#F8FAFC",
                    border: "1px solid #F1F5F9", display: "flex", alignItems: "flex-start", gap: 16,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#D97706", fontSize: 20, flexShrink: 0,
                    }}>
                      <HiPhone />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block" }}>
                        Phone Number
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: profileData?.phone ? "#0F172A" : "#94A3B8", marginTop: 4, display: "block" }}>
                        {profileData?.phone || "Not provided"}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    padding: "20px", borderRadius: 18, background: "#F8FAFC",
                    border: "1px solid #F1F5F9", display: "flex", alignItems: "flex-start", gap: 16,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#7C3AED", fontSize: 20, flexShrink: 0,
                    }}>
                      <HiShieldCheck />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block" }}>
                        Account Role
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginTop: 4, display: "block" }}>
                        {profileData?.role === "admin" ? "Administrator" : "Regular Member"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY LOST ITEMS */}
          {activeTab === "lost-items" && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: "0 0 20px 0" }}>
                My Reported Lost Items
              </h2>

              {itemsLoading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : lostItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 20, background: "#EFF6FF",
                    color: "#2563EB", fontSize: 28, display: "flex", alignItems: "center",
                    justifyContent: "center", margin: "0 auto 16px",
                  }}>
                    <HiMagnifyingGlass />
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                    No lost items reported yet
                  </p>
                  <p style={{ fontSize: 13, color: "#94A3B8", margin: "6px 0 0 0" }}>
                    Items you submit will be listed here.
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                  {lostItems.map((item) => <ItemCard key={item._id} item={item} type="lost" />)}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY FOUND ITEMS */}
          {activeTab === "found-items" && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: "0 0 20px 0" }}>
                My Reported Found Items
              </h2>

              {itemsLoading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : foundItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 20, background: "#F0FDF4",
                    color: "#16A34A", fontSize: 28, display: "flex", alignItems: "center",
                    justifyContent: "center", margin: "0 auto 16px",
                  }}>
                    <HiArchiveBox />
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                    No found items reported yet
                  </p>
                  <p style={{ fontSize: 13, color: "#94A3B8", margin: "6px 0 0 0" }}>
                    Found an item? Report it to help reunite it with its owner.
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                  {foundItems.map((item) => <ItemCard key={item._id} item={item} type="found" />)}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === "security" && (
            <div style={{ maxWidth: 480 }}>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #F8FAFC" }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                  Change Account Password
                </h2>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0, marginTop: 3 }}>
                  Ensure your account is using a strong and unique password.
                </p>
              </div>

              <form onSubmit={handlePasswordChange}>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                    Current Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <HiLockClosed style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontSize: 18 }} />
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      style={{
                        width: "100%", padding: "12px 14px 12px 42px",
                        borderRadius: 14, border: "1px solid #E2E8F0",
                        fontSize: 14, fontWeight: 500, color: "#0F172A",
                        outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                      }}
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <HiKey style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontSize: 18 }} />
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                      style={{
                        width: "100%", padding: "12px 14px 12px 42px",
                        borderRadius: 14, border: "1px solid #E2E8F0",
                        fontSize: 14, fontWeight: 500, color: "#0F172A",
                        outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                      }}
                      placeholder="At least 6 characters"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <HiKey style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontSize: 18 }} />
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      style={{
                        width: "100%", padding: "12px 14px 12px 42px",
                        borderRadius: 14, border: "1px solid #E2E8F0",
                        fontSize: 14, fontWeight: 500, color: "#0F172A",
                        outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                      }}
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={changingPw}
                  style={{
                    width: "100%", padding: "13px", borderRadius: 14, border: "none",
                    background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                    color: "#FFF", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontFamily: "inherit", opacity: changingPw ? 0.7 : 1,
                  }}
                >
                  {changingPw ? (
                    <> <HiArrowPath style={{ animation: "spin 1s linear infinite" }} /> Updating... </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </MainLayout>
  );
}

export default Profile;