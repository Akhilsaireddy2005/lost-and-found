import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import ItemCard from "../../components/ui/ItemCard";
import LostItemFilters from "../../components/ui/LostItemFilters";
import SkeletonCard from "../../components/ui/SkeletonCard";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { getLostItems, deleteLostItem } from "../../services/lostItemService";
import { useAuth } from "../../context/AuthContext";

function LostItems() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search, category, status]);

  useEffect(() => {
    fetchLostItems();
  }, [search, category, status, page]);

  const fetchLostItems = async () => {
    setLoading(true);
    try {
      const response = await getLostItems({
        search,
        category,
        status,
        page,
        limit: 9,
      });

      setItems(response.data.lostItems || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteLostItem(deleteId);
      toast.success("Item deleted successfully.");
      setDeleteId(null);
      fetchLostItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MainLayout>

      {/* ── Header Banner ── */}
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
          background: "radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-50%", left: "10%",
          width: 250, height: 250, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16, position: "relative", zIndex: 2,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #DC2626, #EF4444)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, boxShadow: "0 4px 14px rgba(220,38,38,0.35)",
            }}>
              🔴
            </div>
            <div>
              <h1 style={{
                fontSize: 24, fontWeight: 800, color: "#fff",
                letterSpacing: "-0.5px", margin: 0,
              }}>
                Lost Items
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, marginTop: 4 }}>
                Browse all reported lost items
              </p>
            </div>
          </div>

          <Link
            to="/lost-items/create"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #DC2626, #EF4444)",
              color: "#fff", fontWeight: 700, fontSize: 13,
              padding: "11px 22px", borderRadius: 12,
              textDecoration: "none", border: "none",
              boxShadow: "0 4px 16px rgba(220,38,38,0.35)",
              transition: "all 0.25s",
            }}
          >
            <span style={{ fontSize: 16 }}>+</span> Report Lost Item
          </Link>
        </div>
      </motion.div>

      {/* ── Filters ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1px solid #F1F5F9",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          padding: 6,
          marginBottom: 28,
        }}
      >
        <LostItemFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
        />
      </motion.div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <div style={{
            background: "#fff",
            borderRadius: 24,
            border: "1px solid #F1F5F9",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            padding: "56px 48px",
            maxWidth: 420,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.6 }}>🔍</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
              No Items Found
            </h2>
            <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 28, lineHeight: 1.6 }}>
              We couldn't find any items matching your filters. Try adjusting your search.
            </p>
            <button
              onClick={() => { setSearch(""); setCategory(""); setStatus(""); }}
              style={{
                background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                color: "#fff", fontWeight: 700, fontSize: 14,
                padding: "12px 28px", borderRadius: 12,
                border: "none", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                transition: "all 0.25s",
              }}
            >
              Clear Filters
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {items.map((item) => {
              const isOwner = user && item.owner && (
                user.id === item.owner._id || user._id === item.owner._id
              );
              return (
                <ItemCard
                  key={item._id}
                  item={item}
                  type="lost"
                  onDelete={isOwner ? (id) => setDeleteId(id) : undefined}
                />
              );
            })}
          </motion.div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                display: "flex", flexWrap: "wrap",
                justifyContent: "center", alignItems: "center",
                gap: 8, marginTop: 36,
              }}
            >
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                style={{
                  padding: "10px 20px", borderRadius: 12,
                  background: page === 1 ? "#F8FAFC" : "#fff",
                  border: "1px solid #E2E8F0",
                  fontSize: 13, fontWeight: 600, color: page === 1 ? "#CBD5E1" : "#475569",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    fontSize: 13, fontWeight: 600,
                    border: page === i + 1 ? "none" : "1px solid #E2E8F0",
                    background: page === i + 1
                      ? "linear-gradient(135deg, #2563EB, #3B82F6)"
                      : "#fff",
                    color: page === i + 1 ? "#fff" : "#475569",
                    cursor: "pointer",
                    boxShadow: page === i + 1 ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                style={{
                  padding: "10px 20px", borderRadius: 12,
                  background: page === totalPages
                    ? "#F8FAFC"
                    : "linear-gradient(135deg, #2563EB, #3B82F6)",
                  border: page === totalPages ? "1px solid #E2E8F0" : "none",
                  fontSize: 13, fontWeight: 600,
                  color: page === totalPages ? "#CBD5E1" : "#fff",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  boxShadow: page === totalPages ? "none" : "0 4px 12px rgba(37,99,235,0.3)",
                  transition: "all 0.2s",
                }}
              >
                Next →
              </button>
            </motion.div>
          )}
        </>
      )}

      {/* responsive */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          div[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Lost Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmText={deleting ? "Deleting..." : "Delete"}
      />
    </MainLayout>
  );
}

export default LostItems;