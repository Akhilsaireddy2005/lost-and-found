import { useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { getImageUrl } from "../../utils/imageUtils";
import { HiMapPin, HiCalendar, HiTrash } from "react-icons/hi2";

function ItemCard({ item, type = "lost", onDelete }) {
  const detailPath = type === "lost" ? `/lost-items/${item._id}` : `/found-items/${item._id}`;
  const dateLabel = type === "lost" ? "Lost on" : "Found on";
  const dateValue = type === "lost" ? item.dateLost : item.dateFound;
  const imageUrl = getImageUrl(item.image);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #F1F5F9",
        boxShadow: hovered ? "0 12px 36px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "default",
      }}
    >
      {/* Image */}
      <div style={{
        position: "relative",
        width: "100%",
        height: 200,
        overflow: "hidden",
        background: "#F8FAFC",
      }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            color: "#CBD5E1",
          }}>
            <span style={{ fontSize: 48 }}>📦</span>
            <span style={{ fontSize: 12, marginTop: 8, color: "#94A3B8" }}>No image</span>
          </div>
        )}

        {/* Status Badge */}
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <StatusBadge status={item.status} />
        </div>

        {/* Category badge */}
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <span style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            color: "#475569",
            fontSize: 11,
            fontWeight: 600,
            padding: "5px 12px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.6)",
          }}>
            {item.category}
          </span>
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              width: 34,
              height: 34,
              borderRadius: 10,
              border: "none",
              background: "rgba(220,38,38,0.9)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              fontSize: 15,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1)" : "scale(0.8)",
              transition: "all 0.25s ease",
              boxShadow: "0 4px 12px rgba(220,38,38,0.4)",
            }}
            title="Delete item"
          >
            <HiTrash />
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 18, display: "flex", flexDirection: "column", flex: 1 }}>
        <h2 style={{
          fontSize: 15, fontWeight: 700, color: "#1E293B",
          marginBottom: 6, overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap",
          margin: "0 0 6px 0",
        }}>
          {item.title}
        </h2>

        <p style={{
          fontSize: 13, color: "#94A3B8", marginBottom: 14,
          flex: 1, lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          margin: "0 0 14px 0",
        }}>
          {item.description}
        </p>

        <div style={{ marginBottom: 16 }}>
          {item.location && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, color: "#94A3B8", marginBottom: 6,
            }}>
              <HiMapPin style={{ color: "#3B82F6", fontSize: 13, flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.location}
              </span>
            </div>
          )}
          {dateValue && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, color: "#94A3B8",
            }}>
              <HiCalendar style={{ color: "#3B82F6", fontSize: 13, flexShrink: 0 }} />
              <span>{dateLabel}: {new Date(dateValue).toLocaleDateString("en-IN")}</span>
            </div>
          )}
        </div>

        <Link
          to={detailPath}
          style={{
            display: "block",
            width: "100%",
            textAlign: "center",
            background: "linear-gradient(135deg, #2563EB, #3B82F6)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            padding: 11,
            borderRadius: 12,
            textDecoration: "none",
            transition: "all 0.2s",
            boxShadow: "0 2px 8px rgba(37,99,235,0.2)",
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ItemCard;