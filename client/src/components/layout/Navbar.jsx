import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const reportRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (reportRef.current && !reportRef.current.contains(e.target)) setReportOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const navLinkStyle = (isActive) => ({
    fontSize: 13.5,
    fontWeight: 600,
    color: isActive ? "#2563EB" : "#475569",
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: 10,
    background: isActive ? "rgba(37, 99, 235, 0.08)" : "transparent",
    transition: "all 0.2s ease",
  });

  return (
    <nav style={{
      background: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(241, 245, 249, 0.8)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: "linear-gradient(135deg, #2563EB, #3B82F6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
            }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: "0.5px" }}>LF</span>
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.4px" }}>
              Lost <span style={{ color: "#2563EB" }}>&</span> Found
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="hide-mobile">
            <NavLink to="/dashboard" style={({ isActive }) => navLinkStyle(isActive)}>Dashboard</NavLink>
            <NavLink to="/lost-items" style={({ isActive }) => navLinkStyle(isActive)}>Lost Items</NavLink>
            <NavLink to="/found-items" style={({ isActive }) => navLinkStyle(isActive)}>Found Items</NavLink>
            <NavLink to="/claims" style={({ isActive }) => navLinkStyle(isActive)}>Claims</NavLink>
          </div>

          {/* ── Right Actions ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hide-mobile">
            {isAuthenticated ? (
              <>
                {/* + Report dropdown */}
                <div ref={reportRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => { setReportOpen(v => !v); setUserOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "linear-gradient(135deg, #2563EB, #3B82F6)", color: "#fff",
                      border: "none", borderRadius: 12,
                      padding: "10px 18px", fontSize: 13, fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(37,99,235,0.2)",
                      transition: "all 0.2s ease",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <span style={{ fontSize: 15 }}>＋</span> Report
                    <span style={{ fontSize: 10, marginLeft: 2, opacity: 0.8 }}>▾</span>
                  </button>

                  {reportOpen && (
                    <div style={{
                      position: "absolute", right: 0, top: "calc(100% + 8px)",
                      background: "#fff", borderRadius: 16, width: 220,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                      border: "1px solid #F1F5F9", overflow: "hidden", zIndex: 200,
                      padding: 6,
                    }}>
                      <Link to="/lost-items/create" onClick={() => setReportOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                          fontSize: 13, fontWeight: 600, color: "#374151", textDecoration: "none",
                          borderRadius: 10, transition: "background 0.2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ width: 28, height: 28, borderRadius: 8, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🔴</span>
                        Report Lost Item
                      </Link>
                      <Link to="/found-items/create" onClick={() => setReportOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                          fontSize: 13, fontWeight: 600, color: "#374151", textDecoration: "none",
                          borderRadius: 10, transition: "background 0.2s", marginTop: 2
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F0FDF4"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ width: 28, height: 28, borderRadius: 8, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🟢</span>
                        Report Found Item
                      </Link>
                    </div>
                  )}
                </div>

                {/* User dropdown */}
                <div ref={userRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => { setUserOpen(v => !v); setReportOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      background: "#F8FAFC", border: "1px solid #E2E8F0",
                      borderRadius: 12, padding: "6px 12px", cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.borderColor = "#CBD5E1"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                      color: "#fff", fontSize: 12, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(37,99,235,0.2)",
                    }}>
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#334155", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                    <span style={{ fontSize: 10, color: "#94A3B8" }}>▾</span>
                  </button>

                  {userOpen && (
                    <div style={{
                      position: "absolute", right: 0, top: "calc(100% + 8px)",
                      background: "#fff", borderRadius: 16, width: 200,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                      border: "1px solid #F1F5F9", overflow: "hidden", zIndex: 200,
                      padding: 6,
                    }}>
                      <div style={{ padding: "10px 12px", borderBottom: "1px solid #F1F5F9", marginBottom: 4 }}>
                        <p style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A", margin: 0 }}>{user?.name}</p>
                        <p style={{ fontSize: 11, color: "#64748B", margin: 0, marginTop: 2 }}>{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setUserOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none", borderRadius: 10 }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        👤 My Profile
                      </Link>
                      <Link to="/dashboard" onClick={() => setUserOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none", borderRadius: 10 }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        📊 Dashboard
                      </Link>
                      <div style={{ borderTop: "1px solid #F1F5F9", margin: "4px 0" }} />
                      <button onClick={handleLogout}
                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", fontSize: 13, fontWeight: 600, color: "#DC2626", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", borderRadius: 10 }}
                        onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" style={{ fontSize: 13.5, fontWeight: 600, color: "#475569", textDecoration: "none", padding: "10px 16px" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#2563EB"}
                  onMouseLeave={e => e.currentTarget.style.color = "#475569"}
                >
                  Sign In
                </Link>
                <Link to="/register" style={{
                  fontSize: 13.5, fontWeight: 700, color: "#fff",
                  background: "linear-gradient(135deg, #2563EB, #3B82F6)", textDecoration: "none",
                  padding: "10px 20px", borderRadius: 12,
                  boxShadow: "0 4px 14px rgba(37,99,235,0.2)",
                  transition: "all 0.2s ease",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="show-mobile"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none" }}
          >
            <div style={{ width: 22, display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ height: 2, background: "#374151", borderRadius: 2, display: "block", transition: "all 0.2s", transform: mobileOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
              <span style={{ height: 2, background: "#374151", borderRadius: 2, display: "block", opacity: mobileOpen ? 0 : 1, transition: "opacity 0.2s" }} />
              <span style={{ height: 2, background: "#374151", borderRadius: 2, display: "block", transition: "all 0.2s", transform: mobileOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div style={{ background: "#fff", borderTop: "1px solid #F1F5F9", padding: "12px 24px 20px" }}>
          {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/lost-items", label: "Lost Items" },
            { to: "/found-items", label: "Found Items" },
            { to: "/claims", label: "Claims" },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: "block", padding: "11px 0", fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#2563EB" : "#374151",
                textDecoration: "none",
                borderBottom: "1px solid #F8FAFC",
              })}>
              {label}
            </NavLink>
          ))}

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {isAuthenticated ? (
              <>
                <Link to="/lost-items/create" onClick={() => setMobileOpen(false)}
                  style={{ display: "block", padding: "11px 14px", background: "#FEF2F2", borderRadius: 10, fontSize: 14, fontWeight: 500, color: "#DC2626", textDecoration: "none" }}>
                  🔴 Report Lost Item
                </Link>
                <Link to="/found-items/create" onClick={() => setMobileOpen(false)}
                  style={{ display: "block", padding: "11px 14px", background: "#F0FDF4", borderRadius: 10, fontSize: 14, fontWeight: 500, color: "#16A34A", textDecoration: "none" }}>
                  🟢 Report Found Item
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)}
                  style={{ display: "block", padding: "11px 14px", background: "#F8FAFC", borderRadius: 10, fontSize: 14, fontWeight: 500, color: "#374151", textDecoration: "none" }}>
                  👤 My Profile
                </Link>
                <button onClick={handleLogout}
                  style={{ display: "block", width: "100%", padding: "11px 14px", background: "#FEF2F2", borderRadius: 10, fontSize: 14, fontWeight: 500, color: "#DC2626", border: "none", cursor: "pointer", textAlign: "left" }}>
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  style={{ display: "block", padding: "11px 14px", background: "#F8FAFC", borderRadius: 10, fontSize: 14, fontWeight: 500, color: "#374151", textDecoration: "none" }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}
                  style={{ display: "block", padding: "11px 14px", background: "#2563EB", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none" }}>
                  Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;