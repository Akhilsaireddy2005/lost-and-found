import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { registerUser } from "../../services/authService";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name,
        email,
        password,
      });

      toast.success("Registration Successful");

      navigate("/login");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputGroupStyle = (fieldName) => ({
    position: "relative",
    borderRadius: 14,
    border: focusedField === fieldName
      ? "1.5px solid rgba(37,99,235,0.7)"
      : "1.5px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    transition: "all 0.3s ease",
    boxShadow: focusedField === fieldName
      ? "0 0 0 4px rgba(37,99,235,0.15)"
      : "none",
  });

  const inputStyle = (hasSuffix = false) => ({
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    padding: hasSuffix ? "14px 48px 14px 44px" : "14px 16px 14px 44px",
    fontSize: 15,
    color: "#fff",
    fontFamily: "inherit",
  });

  const labelStyle = {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.03em",
  };

  const iconStyle = (fieldName) => ({
    position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
    color: focusedField === fieldName ? "#60A5FA" : "rgba(255,255,255,0.3)",
    fontSize: 14, transition: "color 0.3s",
  });

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
    }}>

      {/* Gradient ambient background (mobile optimized without heavy GPU blur) */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
      }}>
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-10%", right: "-10%",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", bottom: "-10%", left: "-10%",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Floating decorative icons */}
      {["📦", "🏷️", "🔍", "🗺️", "🔑", "📋"].map((emoji, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -12, 0],
            rotate: [0, -4, 4, 0],
          }}
          transition={{
            duration: 4.5 + i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
          style={{
            position: "absolute",
            fontSize: 18 + i * 3,
            opacity: 0.1,
            top: `${10 + i * 14}%`,
            left: i % 2 === 0 ? `${4 + i * 5}%` : undefined,
            right: i % 2 !== 0 ? `${4 + i * 4}%` : undefined,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: 440,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{
          background: "rgba(30, 41, 59, 0.85)",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "44px 40px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}>

          {/* Logo / icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            style={{
              width: 64, height: 64,
              borderRadius: 20,
              background: "linear-gradient(135deg, #7C3AED, #2563EB)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: "0 8px 30px rgba(124,58,237,0.4)",
              fontSize: 28,
            }}
          >
            ✨
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: 28,
              fontWeight: 800,
              textAlign: "center",
              color: "#fff",
              marginBottom: 8,
              letterSpacing: "-0.5px",
            }}
          >
            Create Account
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: 15,
              marginBottom: 32,
            }}
          >
            Join the Lost & Found community
          </motion.p>

          <form onSubmit={handleSubmit}>

            {/* Name field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.42 }}
              style={{ marginBottom: 18 }}
            >
              <label style={labelStyle}>Full Name</label>
              <div style={inputGroupStyle("name")}>
                <FaUser style={iconStyle("name")} />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle()}
                />
              </div>
            </motion.div>

            {/* Email field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.50 }}
              style={{ marginBottom: 18 }}
            >
              <label style={labelStyle}>Email Address</label>
              <div style={inputGroupStyle("email")}>
                <FaEnvelope style={iconStyle("email")} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle()}
                />
              </div>
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.58 }}
              style={{ marginBottom: 18 }}
            >
              <label style={labelStyle}>Password</label>
              <div style={inputGroupStyle("password")}>
                <FaLock style={iconStyle("password")} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(true)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 15, padding: 4,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.color = "rgba(255,255,255,0.7)"}
                  onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.4)"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.66 }}
              style={{ marginBottom: 28 }}
            >
              <label style={labelStyle}>Confirm Password</label>
              <div style={inputGroupStyle("confirmPassword")}>
                <FaLock style={iconStyle("confirmPassword")} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(true)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 15, padding: 4,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.color = "rgba(255,255,255,0.7)"}
                  onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.4)"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            {/* Submit button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.74 }}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(124,58,237,0.5)" }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: 14,
                border: "none",
                background: loading
                  ? "rgba(124,58,237,0.5)"
                  : "linear-gradient(135deg, #7C3AED, #2563EB)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                letterSpacing: "0.02em",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      display: "inline-block",
                      width: 18, height: 18,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                    }}
                  />
                  Creating Account...
                </>
              ) : "Create Account"}
            </motion.button>

          </form>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            margin: "24px 0",
          }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
              Already a member?
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Login link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
          >
            <Link
              to="/login"
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                padding: "13px",
                borderRadius: 14,
                border: "1.5px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.8)",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.3s",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.08)";
                e.target.style.borderColor = "rgba(255,255,255,0.2)";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.04)";
                e.target.style.borderColor = "rgba(255,255,255,0.12)";
                e.target.style.color = "rgba(255,255,255,0.8)";
              }}
            >
              Sign In Instead →
            </Link>
          </motion.div>

        </div>

        {/* Bottom trust text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 12,
            color: "rgba(255,255,255,0.25)",
          }}
        >
          🔒 Free forever · No credit card required
        </motion.p>

      </motion.div>

    </div>
  );
}

export default Register;