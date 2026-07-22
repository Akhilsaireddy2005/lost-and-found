function SkeletonCard() {
  return (
    <>
      <div style={{
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #F1F5F9",
        overflow: "hidden",
      }}>
        {/* Image placeholder */}
        <div className="skeleton-shimmer" style={{
          width: "100%",
          height: 200,
        }} />

        {/* Content */}
        <div style={{ padding: 18 }}>
          <div className="skeleton-shimmer" style={{
            height: 18, borderRadius: 8, width: "75%", marginBottom: 12,
          }} />
          <div className="skeleton-shimmer" style={{
            height: 14, borderRadius: 8, width: "100%", marginBottom: 8,
          }} />
          <div className="skeleton-shimmer" style={{
            height: 14, borderRadius: 8, width: "60%", marginBottom: 16,
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div className="skeleton-shimmer" style={{
              height: 12, borderRadius: 8, width: "40%",
            }} />
            <div className="skeleton-shimmer" style={{
              height: 12, borderRadius: 8, width: "30%",
            }} />
          </div>
          <div className="skeleton-shimmer" style={{
            height: 40, borderRadius: 12, width: "100%",
          }} />
        </div>
      </div>

      <style>{`
        .skeleton-shimmer {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}

export default SkeletonCard;
