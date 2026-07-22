import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmModal from "../../components/ui/ConfirmModal";
import ClaimModal from "../../components/ui/ClaimModal";
import { getFoundItemById, deleteFoundItem } from "../../services/foundItemService";
import { getMyLostItems } from "../../services/dashboardService";
import { createClaim } from "../../services/claimService";
import { getImageUrl } from "../../utils/imageUtils";
import { useAuth } from "../../context/AuthContext";
import {
  HiArrowLeft,
  HiMapPin,
  HiCalendar,
  HiTag,
  HiUser,
  HiPencil,
  HiTrash,
  HiCheckCircle,
  HiHandRaised
} from "react-icons/hi2";

function FoundItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Claim modal
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [myLostItems, setMyLostItems] = useState([]);
  const [selectedLostItem, setSelectedLostItem] = useState("");
  const [claimMessage, setClaimMessage] = useState("");
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await getFoundItemById(id);
      setItem(res.data.foundItem);
    } catch {
      toast.error("Item not found.");
      navigate("/found-items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteFoundItem(id);
      toast.success("Item deleted successfully.");
      navigate("/found-items");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete.");
      setDeleting(false);
    }
  };

  const openClaimModal = async () => {
    try {
      const res = await getMyLostItems();
      setMyLostItems(res.data.lostItems || []);
    } catch {
      toast.error("Could not load your lost items.");
    }
    setShowClaimModal(true);
  };

  const handleClaim = async () => {
    if (!selectedLostItem) {
      toast.error("Please select one of your lost items.");
      return;
    }
    try {
      setClaiming(true);
      await createClaim({
        lostItemId: selectedLostItem,
        foundItemId: id,
        message: claimMessage,
      });
      toast.success("Claim request sent successfully!");
      setShowClaimModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send claim.");
    } finally {
      setClaiming(false);
    }
  };

  const isOwner = user && item?.owner && (
    user.id === item.owner._id || user._id === item.owner._id
  );

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
              borderTopColor: "#16A34A"
            }}
          />
        </div>
      </MainLayout>
    );
  }

  if (!item) return null;

  return (
    <MainLayout>
      {/* Back button */}
      <button
        onClick={() => navigate("/found-items")}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 14, color: "#64748B", fontWeight: 500,
          background: "none", border: "none", cursor: "pointer",
          marginBottom: 20, padding: 0, transition: "color 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#1E293B"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
      >
        <HiArrowLeft /> Back to Found Items
      </button>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Top Header Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: "linear-gradient(135deg, #0F172A, #1E293B)",
            borderRadius: 24,
            padding: "28px 36px",
            marginBottom: 28,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", top: "-40%", right: "-5%",
            width: 250, height: 250, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)",
            filter: "blur(40px)", pointerEvents: "none",
          }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "linear-gradient(135deg, #16A34A, #22C55E)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, color: "#fff",
                boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
              }}>
                🟢
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <StatusBadge status={item.status} />
                  <span style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "#CBD5E1",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "3px 12px",
                    borderRadius: 99,
                    border: "1px solid rgba(255,255,255,0.15)"
                  }}>
                    {item.category}
                  </span>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.4px", margin: 0 }}>
                  {item.title}
                </h1>
              </div>
            </div>

            {isOwner && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Link
                  to={`/found-items/edit/${item._id}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 18px", borderRadius: 12,
                    background: "linear-gradient(135deg, #16A34A, #22C55E)",
                    color: "#fff", fontSize: 13, fontWeight: 700,
                    textDecoration: "none", boxShadow: "0 4px 14px rgba(22,163,74,0.3)"
                  }}
                >
                  <HiPencil size={15} /> Edit Item
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 18px", borderRadius: 12,
                    background: "rgba(220,38,38,0.15)", color: "#FCA5A5",
                    border: "1px solid rgba(220,38,38,0.3)", fontSize: 13, fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  <HiTrash size={15} /> Delete
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Main 2-Column Showcase ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 28,
          alignItems: "start"
        }}>
          {/* Left Column: Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              background: "#ffffff",
              borderRadius: 24,
              border: "1px solid #F1F5F9",
              padding: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              overflow: "hidden"
            }}
          >
            <div style={{
              width: "100%",
              height: 380,
              borderRadius: 18,
              background: "#0F172A",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative"
            }}>
              {getImageUrl(item.image) ? (
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", color: "#64748B"
                }}>
                  <span style={{ fontSize: 64, marginBottom: 12, opacity: 0.6 }}>📦</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8" }}>No image provided</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Details & Meta Panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              background: "#ffffff",
              borderRadius: 24,
              border: "1px solid #F1F5F9",
              padding: 32,
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              gap: 24
            }}
          >
            {/* Title & Description */}
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>
                {item.title}
              </h2>
              <div style={{
                background: "#F8FAFC",
                border: "1px solid #F1F5F9",
                borderRadius: 16,
                padding: "16px 20px"
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                  Item Description
                </span>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, margin: 0 }}>
                  {item.description}
                </p>
              </div>
            </div>

            {/* Meta Cards Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 14
            }}>
              {/* Location */}
              <div style={{
                background: "#F0FDF4",
                border: "1px solid #DCFCE7",
                borderRadius: 16,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "#DCFCE7", color: "#16A34A",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0
                }}>
                  <HiMapPin />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", margin: 0, textTransform: "uppercase" }}>Found Location</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.location}</p>
                </div>
              </div>

              {/* Date Found */}
              <div style={{
                background: "#F0FDF4",
                border: "1px solid #DCFCE7",
                borderRadius: 16,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "#DCFCE7", color: "#16A34A",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0
                }}>
                  <HiCalendar />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", margin: 0, textTransform: "uppercase" }}>Date Found</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {new Date(item.dateFound).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Reported By */}
              <div style={{
                background: "#F8FAFC",
                border: "1px solid #F1F5F9",
                borderRadius: 16,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "#EFF6FF", color: "#2563EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0
                }}>
                  <HiUser />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#64748B", margin: 0, textTransform: "uppercase" }}>Reported By</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.owner?.name || "Unknown"}</p>
                </div>
              </div>

              {/* Posted Date */}
              <div style={{
                background: "#F8FAFC",
                border: "1px solid #F1F5F9",
                borderRadius: 16,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "#EFF6FF", color: "#2563EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0
                }}>
                  <HiTag />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#64748B", margin: 0, textTransform: "uppercase" }}>Posted On</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Section */}
            {!isOwner && (
              <div style={{ paddingTop: 8 }}>
                {item.status === "Claimed" ? (
                  <div style={{
                    background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
                    border: "1px solid #86EFAC",
                    borderRadius: 16,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    color: "#166534",
                    fontSize: 13,
                    fontWeight: 700
                  }}>
                    <HiCheckCircle size={22} style={{ color: "#16A34A", flexShrink: 0 }} />
                    <span>This item has already been claimed and returned to its rightful owner.</span>
                  </div>
                ) : (
                  <button
                    onClick={openClaimModal}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #16A34A, #22C55E)",
                      color: "#ffffff",
                      fontSize: 14,
                      fontWeight: 700,
                      padding: "14px 24px",
                      borderRadius: 14,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      transition: "transform 0.2s, box-shadow 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <HiHandRaised size={18} />
                    <span>Claim This Item</span>
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Found Item"
        message="Are you sure you want to delete this found item report?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText={deleting ? "Deleting..." : "Delete"}
      />

      {/* Claim Modal */}
      <ClaimModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        title="Claim This Item"
        description="Select which of your reported lost items matches this listing."
        targetItemTitle={item?.title}
        itemTypeLabel="Found Item"
        selectPlaceholder="-- Select your matching Lost Item --"
        items={myLostItems}
        selectedItem={selectedLostItem}
        setSelectedItem={setSelectedLostItem}
        message={claimMessage}
        setMessage={setClaimMessage}
        onSubmit={handleClaim}
        submitting={claiming}
        emptyTitle="No lost items reported yet"
        emptyDescription="Report a lost item in your account first so the finder can verify your claim request."
        emptyActionLink="/lost-items/create"
        emptyActionText="Report a Lost Item First"
        themeColor="emerald"
      />
    </MainLayout>
  );
}

export default FoundItemDetail;
