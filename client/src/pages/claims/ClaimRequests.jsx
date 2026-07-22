import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmModal from "../../components/ui/ConfirmModal";
import {
  getMyClaims,
  getReceivedClaims,
  acceptClaim,
  rejectClaim,
  deleteClaim,
} from "../../services/claimService";
import { getImageUrl } from "../../utils/imageUtils";
import {
  HiOutlineInboxArrowDown,
  HiOutlinePaperAirplane,
  HiCheck,
  HiXMark,
  HiTrash,
  HiEnvelope,
  HiPhone
} from "react-icons/hi2";

function ClaimRequests() {
  const [activeTab, setActiveTab] = useState("received");
  const [sentClaims, setSentClaims] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, id: null });

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const [sent, received] = await Promise.all([
        getMyClaims(),
        getReceivedClaims(),
      ]);
      setSentClaims(sent.data.requests || []);
      setReceivedClaims(received.data.requests || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load claims.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      setActionLoading(id + "-accept");
      await acceptClaim(id);
      toast.success("Claim accepted!");
      fetchClaims();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept claim.");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, id: null });
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id + "-reject");
      await rejectClaim(id);
      toast.success("Claim rejected.");
      fetchClaims();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject claim.");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, id: null });
    }
  };

  const handleDelete = async (id) => {
    try {
      setActionLoading(id + "-delete");
      await deleteClaim(id);
      toast.success("Claim deleted.");
      fetchClaims();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete claim.");
    } finally {
      setActionLoading(null);
      setConfirmModal({ open: false, type: null, id: null });
    }
  };

  const openConfirm = (type, id) => setConfirmModal({ open: true, type, id });

  const handleConfirm = () => {
    const { type, id } = confirmModal;
    if (type === "accept") handleAccept(id);
    else if (type === "reject") handleReject(id);
    else if (type === "delete") handleDelete(id);
  };

  const confirmConfig = {
    accept: { title: "Accept Claim", message: "Accept this claim request? This will mark the lost item as Found and the found item as Claimed.", confirmText: "Accept", confirmColor: "bg-green-600 hover:bg-green-700" },
    reject: { title: "Reject Claim", message: "Reject this claim request? The requester will be notified.", confirmText: "Reject", confirmColor: "bg-red-600 hover:bg-red-700" },
    delete: { title: "Delete Claim", message: "Delete this claim request? This cannot be undone.", confirmText: "Delete", confirmColor: "bg-red-600 hover:bg-red-700" },
  };

  const tabs = [
    { id: "received", label: "Received Requests", icon: <HiOutlineInboxArrowDown size={18} />, count: receivedClaims.length },
    { id: "sent", label: "Sent Requests", icon: <HiOutlinePaperAirplane size={18} />, count: sentClaims.length },
  ];

  const claims = activeTab === "received" ? receivedClaims : sentClaims;

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "4px solid #EFF6FF",
              borderTopColor: "#2563EB",
            }}
          />
        </div>
      </MainLayout>
    );
  }

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
        <div style={{
          position: "absolute", top: "-40%", right: "-5%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
            }}>
              📋
            </div>
            <div>
              <h1 style={{
                fontSize: 24, fontWeight: 800, color: "#fff",
                letterSpacing: "-0.5px", margin: 0,
              }}>
                Claim Requests
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, marginTop: 4 }}>
                Manage sent and received claim requests for lost and found items
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <div style={{
        display: "flex",
        gap: 8,
        background: "#F1F5F9",
        padding: "6px",
        borderRadius: 16,
        marginBottom: 24,
        width: "fit-content",
        border: "1px solid #E2E8F0"
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                background: isActive ? "#ffffff" : "transparent",
                color: isActive ? "#0F172A" : "#64748B",
                boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: 99,
                background: isActive ? "#EFF6FF" : "#E2E8F0",
                color: isActive ? "#2563EB" : "#64748B"
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Claims List ── */}
      {claims.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "#fff",
            borderRadius: 24,
            border: "1px solid #F1F5F9",
            padding: "64px 24px",
            textAlign: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.02)"
          }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "#F8FAFC", border: "1px solid #F1F5F9",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 16px", color: "#94A3B8"
          }}>
            📋
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
            No {activeTab === "received" ? "Received" : "Sent"} Claims
          </h2>
          <p style={{ fontSize: 14, color: "#94A3B8", margin: "0 auto", maxWidth: 360 }}>
            {activeTab === "received"
              ? "No one has sent you a claim request yet."
              : "You haven't sent any claim requests yet."}
          </p>
        </motion.div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {claims.map((claim, index) => (
            <motion.div
              key={claim._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              style={{
                background: "#ffffff",
                borderRadius: 24,
                border: "1px solid #F1F5F9",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: 20
              }}
            >
              {/* Header: Status + Date + Actions */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                paddingBottom: 16,
                borderBottom: "1px solid #F8FAFC"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <StatusBadge status={claim.status} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8" }}>
                    Requested on {new Date(claim.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>

                {/* Actions for Pending */}
                {claim.status === "Pending" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {activeTab === "received" ? (
                      <>
                        <button
                          onClick={() => openConfirm("accept", claim._id)}
                          disabled={!!actionLoading}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "9px 18px", borderRadius: 12,
                            background: "linear-gradient(135deg, #16A34A, #22C55E)",
                            color: "#fff", fontSize: 13, fontWeight: 700,
                            border: "none", cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(22,163,74,0.25)",
                            transition: "all 0.2s"
                          }}
                        >
                          <HiCheck size={16} /> Accept
                        </button>
                        <button
                          onClick={() => openConfirm("reject", claim._id)}
                          disabled={!!actionLoading}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "9px 18px", borderRadius: 12,
                            background: "#FEF2F2", color: "#DC2626",
                            fontSize: 13, fontWeight: 700,
                            border: "1px solid #FEE2E2", cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          <HiXMark size={16} /> Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => openConfirm("delete", claim._id)}
                        disabled={!!actionLoading}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "9px 18px", borderRadius: 12,
                          background: "#FEF2F2", color: "#DC2626",
                          fontSize: 13, fontWeight: 700,
                          border: "1px solid #FEE2E2", cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        <HiTrash size={16} /> Withdraw Request
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Items Comparison Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16
              }}>
                {/* Lost Item */}
                <div style={{
                  background: "linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%)",
                  border: "1px solid #FEE2E2",
                  borderRadius: 18,
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14
                }}>
                  {getImageUrl(claim.lostItem?.image) ? (
                    <img
                      src={getImageUrl(claim.lostItem.image)}
                      alt={claim.lostItem?.title}
                      style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover", flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: 60, height: 60, borderRadius: 12, background: "#FEE2E2",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, flexShrink: 0
                    }}>
                      🔴
                    </div>
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Lost Item
                    </span>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", margin: "2px 0 2px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {claim.lostItem?.title || "Unknown Title"}
                    </h4>
                    <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
                      Category: {claim.lostItem?.category || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Found Item */}
                <div style={{
                  background: "linear-gradient(135deg, #F0FDF4 0%, #F6FDF9 100%)",
                  border: "1px solid #DCFCE7",
                  borderRadius: 18,
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14
                }}>
                  {getImageUrl(claim.foundItem?.image) ? (
                    <img
                      src={getImageUrl(claim.foundItem.image)}
                      alt={claim.foundItem?.title}
                      style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover", flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: 60, height: 60, borderRadius: 12, background: "#DCFCE7",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, flexShrink: 0
                    }}>
                      🟢
                    </div>
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Found Item
                    </span>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", margin: "2px 0 2px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {claim.foundItem?.title || "Unknown Title"}
                    </h4>
                    <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
                      Category: {claim.foundItem?.category || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message note */}
              {claim.message && (
                <div style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: 16,
                  padding: "14px 18px"
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>
                    Verification Message
                  </span>
                  <p style={{ fontSize: 13, color: "#334155", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
                    "{claim.message}"
                  </p>
                </div>
              )}

              {/* User Contact Details */}
              {((activeTab === "received" && claim.requester) || (activeTab === "sent" && claim.receiver)) && (
                <div style={{
                  background: "#F8FAFC",
                  borderRadius: 16,
                  border: "1px solid #F1F5F9",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 800, fontSize: 16
                    }}>
                      {(activeTab === "received" ? claim.requester.name : claim.receiver.name)?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", margin: 0 }}>
                        {activeTab === "received" ? "Requester" : "Item Owner"}
                      </p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                        {activeTab === "received" ? claim.requester.name : claim.receiver.name}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569" }}>
                      <HiEnvelope style={{ color: "#3B82F6", fontSize: 16 }} />
                      <span>{(activeTab === "received" ? claim.requester.email : claim.receiver.email)}</span>
                    </div>

                    {(activeTab === "received" ? claim.requester.phone : claim.receiver.phone) && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569" }}>
                        <HiPhone style={{ color: "#16A34A", fontSize: 16 }} />
                        <span>{(activeTab === "received" ? claim.requester.phone : claim.receiver.phone)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Accepted Banner */}
              {claim.status === "Accepted" && (
                <div style={{
                  background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
                  border: "1px solid #86EFAC",
                  borderRadius: 16,
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "#166534",
                  fontSize: 13,
                  fontWeight: 600
                }}>
                  <span style={{ fontSize: 20 }}>🎉</span>
                  <span>Claim accepted! You can now contact each other directly to safely exchange the item.</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmConfig[confirmModal.type]?.title}
        message={confirmConfig[confirmModal.type]?.message}
        confirmText={confirmConfig[confirmModal.type]?.confirmText}
        confirmColor={confirmConfig[confirmModal.type]?.confirmColor}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal({ open: false, type: null, id: null })}
      />
    </MainLayout>
  );
}

export default ClaimRequests;