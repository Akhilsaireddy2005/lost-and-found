import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiHandRaised, HiPlus, HiSparkles, HiTag } from "react-icons/hi2";

function ClaimModal({
  isOpen,
  onClose,
  title = "Send Claim Request",
  description = "Select an item from your account to link with this listing.",
  targetItemTitle = "",
  itemTypeLabel = "Item",
  selectPlaceholder = "-- Select from your reported items --",
  items = [],
  selectedItem = "",
  setSelectedItem,
  message = "",
  setMessage,
  onSubmit,
  submitting = false,
  emptyTitle = "No items reported yet",
  emptyDescription = "You need to report an item in your account before sending a claim request.",
  emptyActionLink = "/lost-items/create",
  emptyActionText = "Report an Item First",
  themeColor = "blue",
}) {
  if (!isOpen) return null;

  const isBlue = themeColor === "blue";
  const accentGradient = isBlue
    ? "linear-gradient(135deg, #2563EB, #3B82F6)"
    : "linear-gradient(135deg, #059669, #10B981)";
  const iconBg = isBlue
    ? "linear-gradient(135deg, #EFF6FF, #DBEAFE)"
    : "linear-gradient(135deg, #ECFDF5, #D1FAE5)";
  const iconColor = isBlue ? "#2563EB" : "#059669";
  const cardBg = isBlue ? "#F8FAFC" : "#F0FDF4";
  const cardBorder = isBlue ? "#E2E8F0" : "#A7F3D0";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div style={{
            padding: "20px 24px",
            borderBottom: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: iconColor,
                fontSize: 22,
                flexShrink: 0,
              }}>
                <HiHandRaised />
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: 0, lineHeight: 1.2 }}>
                  {title}
                </h3>
                <p style={{ fontSize: "12px", color: "#64748B", margin: 0, marginTop: 4 }}>
                  {description}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#F1F5F9",
                border: "none",
                color: "#64748B",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s"
              }}
              title="Close"
            >
              <HiXMark />
            </button>
          </div>

          {/* Content Body */}
          <div style={{ padding: "24px" }}>
            {/* Target Item Banner */}
            {targetItemTitle && (
              <div style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "14px",
                padding: "12px 16px",
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <HiTag style={{ color: iconColor, fontSize: "18px", flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                    Listing Target ({itemTypeLabel}):
                  </span>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                    {targetItemTitle}
                  </p>
                </div>
              </div>
            )}

            {items.length === 0 ? (
              <div style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "20px",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
              }}>
                <div style={{
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  background: "#ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  color: iconColor,
                  marginBottom: 16
                }}>
                  <HiSparkles />
                </div>

                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", margin: "0 0 6px 0" }}>
                  {emptyTitle}
                </h4>

                <p style={{
                  fontSize: "13px",
                  color: "#64748B",
                  margin: "0 0 20px 0",
                  maxWidth: "320px",
                  lineHeight: 1.5
                }}>
                  {emptyDescription}
                </p>

                <Link
                  to={emptyActionLink}
                  onClick={onClose}
                  style={{
                    background: accentGradient,
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "13px",
                    padding: "12px 24px",
                    borderRadius: "14px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <HiPlus size={16} />
                  <span>{emptyActionText}</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Select Item */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "8px" }}>
                    Select Your Matching Item <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "14px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#0F172A",
                      outline: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="">{selectPlaceholder}</option>
                    {items.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.title} {item.category ? `(${item.category})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "8px" }}>
                    Message / Verification Notes <span style={{ color: "#94A3B8", fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Provide additional details or proof of ownership to help verify..."
                    style={{
                      width: "100%",
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "14px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#0F172A",
                      outline: "none",
                      resize: "none"
                    }}
                  />
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: "14px",
                      border: "1px solid #E2E8F0",
                      background: "#ffffff",
                      color: "#475569",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={submitting}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: "14px",
                      border: "none",
                      background: accentGradient,
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: submitting ? "not-allowed" : "pointer",
                      opacity: submitting ? 0.7 : 1,
                      boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    {submitting ? "Sending..." : "Send Claim Request"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ClaimModal;
