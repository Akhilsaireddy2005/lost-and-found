function StatusBadge({ status }) {
  const config = {
    Lost:     { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", dot: "#EF4444" },
    Found:    { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0", dot: "#22C55E" },
    Claimed:  { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE", dot: "#3B82F6" },
    Pending:  { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A", dot: "#F59E0B" },
    Accepted: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0", dot: "#22C55E" },
    Rejected: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", dot: "#EF4444" },
  };

  const style = config[status] || { bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0", dot: "#94A3B8" };

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "4px 12px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.02em",
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
      whiteSpace: "nowrap",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: style.dot, display: "inline-block",
        flexShrink: 0,
      }} />
      {status}
    </span>
  );
}

export default StatusBadge;
