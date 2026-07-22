import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiExclamationTriangle } from "react-icons/hi2";

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", confirmColor }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 1000,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              borderRadius: 24,
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
              padding: 36,
              width: "100%",
              maxWidth: 420,
              zIndex: 1001,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              {/* Warning icon */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "#FEF2F2",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
              }}>
                <HiExclamationTriangle style={{ color: "#DC2626", fontSize: 28 }} />
              </div>

              <h3 style={{
                fontSize: 20, fontWeight: 700, color: "#0F172A",
                marginBottom: 8, margin: "0 0 8px 0",
              }}>
                {title || "Are you sure?"}
              </h3>

              <p style={{
                fontSize: 14, color: "#64748B", lineHeight: 1.6,
                marginBottom: 28, margin: "0 0 28px 0",
              }}>
                {message || "This action cannot be undone."}
              </p>

              <div style={{ display: "flex", gap: 12, width: "100%" }}>
                <button
                  onClick={onCancel}
                  style={{
                    flex: 1, padding: 12, borderRadius: 14,
                    border: "1.5px solid #E2E8F0",
                    background: "transparent",
                    color: "#475569",
                    fontSize: 14, fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.target.style.background = "#F8FAFC"; e.target.style.borderColor = "#CBD5E1"; }}
                  onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "#E2E8F0"; }}
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  style={{
                    flex: 1, padding: 12, borderRadius: 14,
                    border: "none",
                    background: "linear-gradient(135deg, #DC2626, #EF4444)",
                    color: "#fff",
                    fontSize: 14, fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: "0 4px 14px rgba(220,38,38,0.3)",
                    transition: "all 0.2s",
                  }}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;
