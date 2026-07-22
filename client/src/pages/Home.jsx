import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import { motion } from "framer-motion";

/* ── animation helpers ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px 110px",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)",
      }}>
        {/* animated gradient orbs */}
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -50, 30, 0], scale: [1, 1.15, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-15%", left: "-8%",
            width: 600, height: 600, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)",
            filter: "blur(80px)", pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ x: [0, -30, 25, 0], y: [0, 40, -30, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", bottom: "-20%", right: "-10%",
            width: 700, height: 700, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)",
            filter: "blur(80px)", pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ x: [0, 20, -15, 0], y: [0, -25, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "50%", left: "55%",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
            filter: "blur(60px)", pointerEvents: "none",
          }}
        />

        {/* floating emojis */}
        {["🔍", "📦", "🏷️", "🗺️", "🔑", "📋"].map((emoji, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -14, 0], rotate: [0, 6, -6, 0] }}
            transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            style={{
              position: "absolute", fontSize: 20 + i * 5, opacity: 0.08,
              top: `${12 + i * 13}%`,
              left: i % 2 === 0 ? `${4 + i * 6}%` : undefined,
              right: i % 2 !== 0 ? `${4 + i * 5}%` : undefined,
              pointerEvents: "none", userSelect: "none",
            }}
          >
            {emoji}
          </motion.span>
        ))}

        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>

          {/* pill badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(37,99,235,0.15)", color: "#60A5FA",
              fontSize: 12, fontWeight: 600, padding: "8px 20px",
              borderRadius: 999, marginBottom: 28,
              letterSpacing: "0.06em", textTransform: "uppercase",
              border: "1px solid rgba(96,165,250,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", display: "inline-block", boxShadow: "0 0 6px rgba(34,197,94,0.6)" }} />
            100% Free · No Sign-up Fee
          </motion.span>

          {/* heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 60, fontWeight: 900, color: "#fff", lineHeight: 1.08,
              marginBottom: 24, letterSpacing: "-1.5px",
            }}
          >
            Lost Something?{" "}
            <span style={{
              background: "linear-gradient(135deg, #60A5FA, #A78BFA, #34D399)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              We'll Help
            </span>{" "}
            You Find It.
          </motion.h1>

          {/* subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{
              fontSize: 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.7,
              marginBottom: 44, maxWidth: 540, margin: "0 auto 44px",
            }}
          >
            A free community platform to report lost or found items and
            reconnect people with their belongings — quickly and easily.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
          >
            {isAuthenticated ? (
              <>
                <Link to="/lost-items/create" style={{
                  background: "linear-gradient(135deg, #DC2626, #EF4444)", color: "#fff", fontWeight: 700,
                  padding: "15px 30px", borderRadius: 14, fontSize: 14,
                  textDecoration: "none", display: "inline-block",
                  boxShadow: "0 4px 20px rgba(220,38,38,0.4)",
                  transition: "all 0.25s", border: "none",
                }}>🔴 Report Lost Item</Link>

                <Link to="/found-items/create" style={{
                  background: "linear-gradient(135deg, #16A34A, #22C55E)", color: "#fff", fontWeight: 700,
                  padding: "15px 30px", borderRadius: 14, fontSize: 14,
                  textDecoration: "none", display: "inline-block",
                  boxShadow: "0 4px 20px rgba(22,163,74,0.4)",
                  transition: "all 0.25s",
                }}>🟢 Report Found Item</Link>

                <Link to="/dashboard" style={{
                  background: "rgba(255,255,255,0.08)", color: "#fff", fontWeight: 600,
                  padding: "15px 30px", borderRadius: 14, fontSize: 14,
                  textDecoration: "none", display: "inline-block",
                  border: "1.5px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)", transition: "all 0.25s",
                }}>Dashboard →</Link>
              </>
            ) : (
              <>
                <Link to="/register" style={{
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)", color: "#fff", fontWeight: 700,
                  padding: "16px 36px", borderRadius: 14, fontSize: 15,
                  textDecoration: "none", display: "inline-block",
                  boxShadow: "0 4px 24px rgba(37,99,235,0.45)",
                  transition: "all 0.25s",
                }}>Get Started Free →</Link>

                <Link to="/lost-items" style={{
                  background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.85)", fontWeight: 600,
                  padding: "16px 36px", borderRadius: 14, fontSize: 15,
                  textDecoration: "none", display: "inline-block",
                  border: "1.5px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)", transition: "all 0.25s",
                }}>Browse Items</Link>
              </>
            )}
          </motion.div>

          {/* trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ marginTop: 32, fontSize: 13, color: "rgba(255,255,255,0.3)" }}
          >
            Trusted by <strong style={{ color: "rgba(255,255,255,0.55)" }}>5,000+</strong> users · No credit card required
          </motion.p>

        </div>
      </section>

      {/* ═══════════════════════ STATS ═══════════════════════ */}
      <section style={{ background: "#fff", padding: "56px 24px", borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
          {[
            { num: "2,400+", label: "Items Reported", icon: "📝" },
            { num: "1,800+", label: "Items Returned", icon: "🎉" },
            { num: "5,000+", label: "Active Users", icon: "👥" },
            { num: "98%",    label: "Success Rate", icon: "⚡" },
          ].map(({ num, label, icon }, i) => (
            <motion.div
              key={label}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              style={{ padding: "20px 12px" }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
              <p style={{
                fontSize: 36, fontWeight: 800, marginBottom: 4, letterSpacing: "-1px",
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>{num}</p>
              <p style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
      <section style={{ background: "#F8FAFC", padding: "90px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <span style={{
              display: "inline-block", background: "#EFF6FF", color: "#2563EB",
              fontSize: 11, fontWeight: 700, padding: "6px 16px",
              borderRadius: 999, letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 16, border: "1px solid #DBEAFE",
            }}>
              Process
            </span>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#0F172A", marginBottom: 14, letterSpacing: "-0.8px" }}>
              How It Works
            </h2>
            <p style={{ color: "#64748B", fontSize: 16, maxWidth: 450, margin: "0 auto" }}>
              Get started in under 2 minutes. It's simple, fast, and completely free.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { step: "01", icon: "✍️", title: "Create Account", desc: "Sign up free — no credit card needed.", gradient: "linear-gradient(135deg, #2563EB, #3B82F6)" },
              { step: "02", icon: "📸", title: "Post Your Item", desc: "Add a photo, description, and location.", gradient: "linear-gradient(135deg, #7C3AED, #8B5CF6)" },
              { step: "03", icon: "🔔", title: "Get Notified", desc: "Get alerts when a match is found.", gradient: "linear-gradient(135deg, #0891B2, #06B6D4)" },
              { step: "04", icon: "🤝", title: "Reunite", desc: "Verify and safely collect your item.", gradient: "linear-gradient(135deg, #16A34A, #22C55E)" },
            ].map(({ step, icon, title, desc, gradient }, i) => (
              <motion.div
                key={step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                custom={i}
                whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
                style={{
                  background: "#fff", borderRadius: 24, padding: "32px 24px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9",
                  textAlign: "center", cursor: "default",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: gradient, color: "#fff",
                  fontSize: 13, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 18px",
                  boxShadow: `0 4px 14px rgba(0,0,0,0.15)`,
                }}>{step}</div>
                <div style={{ fontSize: 36, marginBottom: 14, lineHeight: 1 }}>{icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════ FEATURES ═══════════════════════ */}
      <section style={{ background: "#fff", padding: "90px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <span style={{
              display: "inline-block", background: "#F5F3FF", color: "#7C3AED",
              fontSize: 11, fontWeight: 700, padding: "6px 16px",
              borderRadius: 999, letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 16, border: "1px solid #EDE9FE",
            }}>
              Features
            </span>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#0F172A", marginBottom: 14, letterSpacing: "-0.8px" }}>
              Everything You Need
            </h2>
            <p style={{ color: "#64748B", fontSize: 16, maxWidth: 450, margin: "0 auto" }}>
              One platform. Every lost-and-found need covered.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                emoji: "🔴", bg: "linear-gradient(135deg, #FEF2F2, #FEE2E2)", iconBg: "#FCA5A5",
                title: "Report Lost Items",
                desc: "Lost something? Post it with a photo, description, and location. Our community will help you find it fast.",
                link: isAuthenticated ? "/lost-items/create" : "/register",
                cta: "Report Lost Item →", ctaColor: "#DC2626",
                borderHover: "#FECACA",
              },
              {
                emoji: "🟢", bg: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", iconBg: "#86EFAC",
                title: "Report Found Items",
                desc: "Found someone's belonging? Post it here so the rightful owner can see it and send a claim.",
                link: isAuthenticated ? "/found-items/create" : "/register",
                cta: "Report Found Item →", ctaColor: "#16A34A",
                borderHover: "#BBF7D0",
              },
              {
                emoji: "📋", bg: "linear-gradient(135deg, #EFF6FF, #DBEAFE)", iconBg: "#93C5FD",
                title: "Manage Claims",
                desc: "Send or receive claim requests. Accept or reject with full control over every interaction.",
                link: isAuthenticated ? "/claims" : "/register",
                cta: "View Claims →", ctaColor: "#2563EB",
                borderHover: "#BFDBFE",
              },
            ].map(({ emoji, bg, iconBg, title, desc, link, cta, ctaColor, borderHover }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                custom={i}
                whileHover={{ y: -8, boxShadow: "0 16px 48px rgba(0,0,0,0.1)" }}
                style={{
                  background: "#fff", borderRadius: 24, padding: "36px 28px",
                  border: "1.5px solid #F1F5F9",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  display: "flex", flexDirection: "column",
                  transition: "all 0.3s ease",
                  cursor: "default",
                }}
              >
                <div style={{
                  width: 56, height: 56, background: bg,
                  borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, marginBottom: 24,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}>
                  {emoji}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, flex: 1, marginBottom: 24 }}>{desc}</p>
                <Link to={link} style={{
                  color: ctaColor, fontSize: 14, fontWeight: 700, textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  transition: "gap 0.2s",
                }}>
                  {cta}
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
      <section style={{ background: "#F8FAFC", padding: "90px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <span style={{
              display: "inline-block", background: "#ECFDF5", color: "#059669",
              fontSize: 11, fontWeight: 700, padding: "6px 16px",
              borderRadius: 999, letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 16, border: "1px solid #A7F3D0",
            }}>
              Testimonials
            </span>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#0F172A", marginBottom: 14, letterSpacing: "-0.8px" }}>
              Loved by Our Community
            </h2>
            <p style={{ color: "#64748B", fontSize: 16, maxWidth: 450, margin: "0 auto" }}>
              Real stories from real users who found their belongings.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                name: "Priya Sharma",
                role: "Student",
                avatar: "PS",
                color: "#818CF8",
                text: "I lost my laptop bag on campus and someone found it within 2 hours. This platform is a lifesaver!",
                stars: 5,
              },
              {
                name: "Rahul Verma",
                role: "Software Engineer",
                avatar: "RV",
                color: "#F472B6",
                text: "Found a wallet in a café and was able to return it the same day. The claim system makes it so easy and secure.",
                stars: 5,
              },
              {
                name: "Ananya Patel",
                role: "Teacher",
                avatar: "AP",
                color: "#34D399",
                text: "My kids lost their school bag on the bus. Within a day, someone posted it as found. Incredible community!",
                stars: 5,
              },
            ].map(({ name, role, avatar, color, text, stars }, i) => (
              <motion.div
                key={name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                custom={i}
                whileHover={{ y: -6 }}
                style={{
                  background: "#fff", borderRadius: 24, padding: "32px 28px",
                  border: "1.5px solid #F1F5F9",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  transition: "all 0.3s ease",
                }}
              >
                {/* stars */}
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: stars }).map((_, si) => (
                    <span key={si} style={{ color: "#FBBF24", fontSize: 16 }}>★</span>
                  ))}
                </div>

                <p style={{
                  fontSize: 14, color: "#475569", lineHeight: 1.75, marginBottom: 24,
                  fontStyle: "italic",
                }}>
                  "{text}"
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `linear-gradient(135deg, ${color}, ${color}99)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 13, fontWeight: 700,
                  }}>
                    {avatar}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", margin: 0 }}>{name}</p>
                    <p style={{ fontSize: 12, color: "#94A3B8", margin: 0, marginTop: 2 }}>{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      {!isAuthenticated && (
        <section style={{
          position: "relative",
          overflow: "hidden",
          padding: "90px 24px",
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
        }}>
          {/* gradient orbs for CTA */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", top: "-30%", right: "-10%",
              width: 500, height: 500, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)",
              filter: "blur(60px)", pointerEvents: "none",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, -15, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", bottom: "-30%", left: "-10%",
              width: 500, height: 500, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
              filter: "blur(60px)", pointerEvents: "none",
            }}
          />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}
          >
            <h2 style={{
              fontSize: 42, fontWeight: 800, color: "#fff",
              marginBottom: 18, letterSpacing: "-0.8px", lineHeight: 1.15,
            }}>
              Ready to Get{" "}
              <span style={{
                background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Started?
              </span>
            </h2>
            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.5)",
              marginBottom: 40, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 40px",
            }}>
              Join thousands of people using our free platform to recover lost belongings every day.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/register" style={{
                background: "linear-gradient(135deg, #2563EB, #7C3AED)", color: "#fff", fontWeight: 700,
                padding: "16px 36px", borderRadius: 14, fontSize: 15,
                textDecoration: "none", display: "inline-block",
                boxShadow: "0 4px 24px rgba(37,99,235,0.45)",
                transition: "all 0.25s",
              }}>Create Free Account</Link>

              <Link to="/login" style={{
                background: "rgba(255,255,255,0.08)", color: "#fff", fontWeight: 600,
                padding: "16px 36px", borderRadius: 14, fontSize: 15,
                textDecoration: "none", display: "inline-block",
                border: "1.5px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)", transition: "all 0.25s",
              }}>Sign In</Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer style={{
        background: "#0F172A", padding: "56px 24px 32px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40, marginBottom: 48,
          }}>
            {/* brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 12 }}>LF</span>
                </div>
                <span style={{ color: "#fff", fontSize: 16, fontWeight: 800, letterSpacing: "-0.3px" }}>
                  Lost <span style={{ color: "#60A5FA" }}>&</span> Found
                </span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>
                A free community platform helping people reconnect with their lost belongings.
              </p>
            </div>

            {/* quick links */}
            <div>
              <h4 style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>Platform</h4>
              {[
                { to: "/lost-items", label: "Lost Items" },
                { to: "/found-items", label: "Found Items" },
                { to: "/claims", label: "Claims" },
                { to: "/dashboard", label: "Dashboard" },
              ].map(({ to, label }) => (
                <Link key={to} to={to} style={{
                  display: "block", color: "rgba(255,255,255,0.4)", fontSize: 13,
                  textDecoration: "none", marginBottom: 12,
                  transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => e.target.style.color = "#60A5FA"}
                  onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.4)"}
                >{label}</Link>
              ))}
            </div>

            {/* account */}
            <div>
              <h4 style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>Account</h4>
              {[
                { to: "/login", label: "Sign In" },
                { to: "/register", label: "Register" },
                { to: "/profile", label: "Profile" },
              ].map(({ to, label }) => (
                <Link key={to} to={to} style={{
                  display: "block", color: "rgba(255,255,255,0.4)", fontSize: 13,
                  textDecoration: "none", marginBottom: 12,
                  transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => e.target.style.color = "#60A5FA"}
                  onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.4)"}
                >{label}</Link>
              ))}
            </div>

            {/* info */}
            <div>
              <h4 style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>Info</h4>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7 }}>
                🔒 Secure & encrypted<br />
                ⚡ Lightning fast<br />
                💚 100% Free
              </p>
            </div>
          </div>

          {/* divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 24 }} />

          {/* bottom bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>
              © {new Date().getFullYear()} Lost & Found Portal. All rights reserved.
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0 }}>
              Made with ❤️ for the community
            </p>
          </div>

        </div>
      </footer>

      {/* ── responsive overrides ── */}
      <style>{`
        @media (max-width: 900px) {
          section div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          footer div[style*="grid-template-columns: 2fr"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          section div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr !important;
          }
          footer div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}