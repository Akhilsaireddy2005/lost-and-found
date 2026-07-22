import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "../../layouts/MainLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  getDashboardStats,
  getRecentActivity,
} from "../../services/dashboardService";
import { useAuth } from "../../context/AuthContext";

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── stat card config ── */
const statCards = [
  {
    key: "lostItems",
    title: "My Lost Items",
    icon: "🔴",
    gradient: "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
    accentColor: "#DC2626",
    iconBg: "rgba(220,38,38,0.1)",
  },
  {
    key: "foundItems",
    title: "My Found Items",
    icon: "🟢",
    gradient: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
    accentColor: "#16A34A",
    iconBg: "rgba(22,163,74,0.1)",
  },
  {
    key: "pendingClaims",
    title: "Pending Claims",
    icon: "⏳",
    gradient: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
    accentColor: "#D97706",
    iconBg: "rgba(217,119,6,0.1)",
  },
  {
    key: "acceptedClaims",
    title: "Accepted Claims",
    icon: "✅",
    gradient: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
    accentColor: "#2563EB",
    iconBg: "rgba(37,99,235,0.1)",
  },
];

/* ── quick actions config ── */
const quickActions = [
  {
    to: "/lost-items/create",
    icon: "🔴",
    title: "Report Lost Item",
    desc: "Lost something? Report it here",
    bg: "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
    hoverBg: "#FEE2E2",
    borderColor: "#FECACA",
  },
  {
    to: "/found-items/create",
    icon: "🟢",
    title: "Report Found Item",
    desc: "Found something? Post it here",
    bg: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
    hoverBg: "#DCFCE7",
    borderColor: "#BBF7D0",
  },
  {
    to: "/lost-items",
    icon: "🔍",
    title: "Browse Lost Items",
    desc: "Search all reported lost items",
    bg: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
    hoverBg: "#DBEAFE",
    borderColor: "#BFDBFE",
  },
  {
    to: "/claims",
    icon: "📋",
    title: "My Claims",
    desc: "View sent & received claims",
    bg: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
    hoverBg: "#FEF3C7",
    borderColor: "#FDE68A",
  },
];

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    pendingClaims: 0,
    acceptedClaims: 0,
  });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
      ]);

      setStats({
        lostItems: statsRes.data.lostItems || 0,
        foundItems: statsRes.data.foundItems || 0,
        pendingClaims: statsRes.data.pendingClaims || 0,
        acceptedClaims: statsRes.data.acceptedClaims || 0,
      });

      setActivities(activityRes.data.activities || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: "60vh",
        }}>
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
            <p style={{ color: "#94A3B8", fontSize: 14, fontWeight: 500 }}>Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getActivityIcon = (type) => {
    if (type === "Lost") return "🔴";
    if (type === "Found") return "🟢";
    return "📋";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <MainLayout>

      {/* ── Header banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, #0F172A, #1E293B)",
          borderRadius: 24,
          padding: "36px 40px",
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative orbs */}
        <div style={{
          position: "absolute", top: "-40%", right: "-5%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-50%", left: "10%",
          width: 250, height: 250, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 20, fontWeight: 800,
              boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
            }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 style={{
                fontSize: 26, fontWeight: 800, color: "#fff",
                letterSpacing: "-0.5px", margin: 0, lineHeight: 1.2,
              }}>
                {getGreeting()}, {user?.name?.split(" ")[0] || "User"} 👋
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0, marginTop: 4 }}>
                Here's what's happening with your items today.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stats grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 18,
        marginBottom: 28,
      }}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={i}
            whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "24px 22px",
              border: "1px solid #F1F5F9",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              cursor: "default",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: card.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>
                {card.icon}
              </div>
              <div style={{
                width: 36, height: 4, borderRadius: 99,
                background: card.accentColor, opacity: 0.15,
              }} />
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              {card.title}
            </p>
            <p style={{ fontSize: 32, fontWeight: 800, color: card.accentColor, letterSpacing: "-1px", lineHeight: 1, margin: 0 }}>
              {stats[card.key]}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Main content grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 24,
      }}>

        {/* ── Recent Activity ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          style={{
            background: "#fff",
            borderRadius: 20,
            border: "1px solid #F1F5F9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          {/* section header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "22px 28px",
            borderBottom: "1px solid #F8FAFC",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>
                📊
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                Recent Activity
              </h2>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, color: "#94A3B8",
              background: "#F8FAFC", padding: "4px 12px",
              borderRadius: 99, border: "1px solid #F1F5F9",
            }}>
              {activities.length} item{activities.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* list */}
          <div style={{ padding: "8px 16px 16px" }}>
            {activities.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 12, opacity: 0.5 }}>📋</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#94A3B8", marginBottom: 4 }}>
                  No recent activity yet
                </p>
                <p style={{ fontSize: 13, color: "#CBD5E1" }}>
                  Report a lost or found item to get started.
                </p>
              </div>
            ) : (
              <div>
                {activities.map((activity, i) => (
                  <motion.div
                    key={`${activity._id}-${i}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 14px",
                      borderRadius: 14,
                      cursor: "default",
                      transition: "background 0.2s ease",
                      borderBottom: i < activities.length - 1 ? "1px solid #FAFBFC" : "none",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#FAFBFC"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    {/* icon */}
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: activity.type === "Lost"
                        ? "linear-gradient(135deg, #FEF2F2, #FEE2E2)"
                        : activity.type === "Found"
                          ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)"
                          : "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, flexShrink: 0,
                    }}>
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 14, fontWeight: 600, color: "#1E293B",
                        margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {activity.title}
                      </p>
                      <p style={{ fontSize: 12, color: "#94A3B8", margin: 0, marginTop: 3 }}>
                        <span style={{
                          display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                          background: activity.type === "Lost" ? "#EF4444" : activity.type === "Found" ? "#22C55E" : "#3B82F6",
                          marginRight: 6, verticalAlign: "middle",
                        }} />
                        {activity.type} • {new Date(activity.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* status */}
                    <StatusBadge status={activity.status} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          style={{
            background: "#fff",
            borderRadius: 20,
            border: "1px solid #F1F5F9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          {/* section header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "22px 28px",
            borderBottom: "1px solid #F8FAFC",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>
              ⚡
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>
              Quick Actions
            </h2>
          </div>

          {/* actions list */}
          <div style={{ padding: "12px 16px 16px" }}>
            {quickActions.map((action, i) => (
              <motion.div
                key={action.to}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.08 }}
              >
                <Link
                  to={action.to}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px",
                    borderRadius: 14,
                    textDecoration: "none",
                    marginBottom: 6,
                    background: action.bg,
                    border: `1px solid ${action.borderColor}`,
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: "rgba(255,255,255,0.7)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, flexShrink: 0,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  }}>
                    {action.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", margin: 0 }}>
                      {action.title}
                    </p>
                    <p style={{ fontSize: 12, color: "#64748B", margin: 0, marginTop: 3 }}>
                      {action.desc}
                    </p>
                  </div>
                  <span style={{
                    marginLeft: "auto", fontSize: 14, color: "#CBD5E1",
                    transition: "transform 0.2s, color 0.2s",
                  }}>
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

        </motion.div>

      </div>

      {/* ── responsive styles ── */}
      <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          div[style*="grid-template-columns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </MainLayout>
  );
}

export default Dashboard;