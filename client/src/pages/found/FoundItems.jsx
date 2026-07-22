import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "../../layouts/MainLayout";
import ItemCard from "../../components/ui/ItemCard";
import SkeletonCard from "../../components/ui/SkeletonCard";
import { getFoundItems } from "../../services/foundItemService";
import { HiMagnifyingGlass, HiPlus, HiFunnel, HiXMark } from "react-icons/hi2";

const CATEGORIES = [
  "Electronics", "Documents", "Wallet", "Keys",
  "Bags", "Clothing", "Accessories", "Books", "Others",
];

function FoundItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, category, status]);

  useEffect(() => {
    fetchFoundItems();
  }, [search, category, status, page]);

  const fetchFoundItems = async () => {
    setLoading(true);
    try {
      const res = await getFoundItems({ search, category, status, page, limit: 9 });
      setItems(res.data.foundItems || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = search || category || status;

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
          background: "radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-50%", left: "10%",
          width: 250, height: 250, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16, position: "relative", zIndex: 2,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #16A34A, #22C55E)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
            }}>
              🟢
            </div>
            <div>
              <h1 style={{
                fontSize: 24, fontWeight: 800, color: "#fff",
                letterSpacing: "-0.5px", margin: 0,
              }}>
                Found Items
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, marginTop: 4 }}>
                Browse all reported found items and claim your belongings
              </p>
            </div>
          </div>

          <Link
            to="/found-items/create"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #16A34A, #22C55E)",
              color: "#fff", fontWeight: 700, fontSize: 13,
              padding: "11px 22px", borderRadius: 12,
              textDecoration: "none", border: "none",
              boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
              transition: "all 0.25s",
            }}
          >
            <HiPlus size={16} /> Report Found Item
          </Link>
        </div>
      </motion.div>

      {/* ── Filters Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          background: "#ffffff",
          borderRadius: 20,
          border: "1px solid #F1F5F9",
          padding: "20px 24px",
          marginBottom: 28,
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          alignItems: "center"
        }}>
          {/* Search Input */}
          <div style={{ position: "relative", flex: 1 }}>
            <HiMagnifyingGlass style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
              color: "#94A3B8", fontSize: 18, pointerEvents: "none"
            }} />
            <input
              type="text"
              placeholder="Search found items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                padding: "12px 16px 12px 42px",
                fontSize: 13,
                fontWeight: 500,
                color: "#0F172A",
                outline: "none",
                transition: "all 0.2s ease",
              }}
            />
          </div>

          {/* Category Dropdown */}
          <div style={{ position: "relative" }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                padding: "12px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: category ? "#0F172A" : "#64748B",
                outline: "none",
                cursor: "pointer",
                appearance: "none",
                WebkitAppearance: "none",
              }}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span style={{
              position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
              pointerEvents: "none", fontSize: 10, color: "#64748B"
            }}>▾</span>
          </div>

          {/* Status Dropdown */}
          <div style={{ position: "relative" }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                padding: "12px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: status ? "#0F172A" : "#64748B",
                outline: "none",
                cursor: "pointer",
                appearance: "none",
                WebkitAppearance: "none",
              }}
            >
              <option value="">All Statuses</option>
              <option value="Found">Available</option>
              <option value="Claimed">Claimed</option>
            </select>
            <span style={{
              position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
              pointerEvents: "none", fontSize: 10, color: "#64748B"
            }}>▾</span>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={() => { setSearch(""); setCategory(""); setStatus(""); }}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "12px 18px", borderRadius: 14,
                background: "#FEF2F2", color: "#DC2626",
                border: "1px solid #FEE2E2", fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s ease"
              }}
            >
              <HiXMark size={16} /> Clear Filters
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Content Grid ── */}
      {loading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 20,
        }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "#ffffff",
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
            fontSize: 32, margin: "0 auto 16px", color: "#94A3B8"
          }}>
            📦
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
            No Found Items
          </h2>
          <p style={{ fontSize: 14, color: "#94A3B8", margin: "0 auto 24px auto", maxWidth: 360 }}>
            No found items match your current filters. Try adjusting your search query or clear your filters.
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => { setSearch(""); setCategory(""); setStatus(""); }}
              style={{
                background: "linear-gradient(135deg, #16A34A, #22C55E)",
                color: "#fff", fontWeight: 700, fontSize: 13,
                padding: "11px 24px", borderRadius: 12,
                border: "none", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
                transition: "all 0.2s"
              }}
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20,
            }}
          >
            {items.map((item) => (
              <ItemCard key={item._id} item={item} type="found" />
            ))}
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
                      ? "linear-gradient(135deg, #16A34A, #22C55E)"
                      : "#fff",
                    color: page === i + 1 ? "#fff" : "#475569",
                    cursor: "pointer",
                    boxShadow: page === i + 1 ? "0 4px 12px rgba(22,163,74,0.3)" : "none",
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
                    : "linear-gradient(135deg, #16A34A, #22C55E)",
                  border: page === totalPages ? "1px solid #E2E8F0" : "none",
                  fontSize: 13, fontWeight: 600,
                  color: page === totalPages ? "#CBD5E1" : "#fff",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  boxShadow: page === totalPages ? "none" : "0 4px 12px rgba(22,163,74,0.3)",
                  transition: "all 0.2s",
                }}
              >
                Next →
              </button>
            </motion.div>
          )}
        </>
      )}
    </MainLayout>
  );
}

export default FoundItems;