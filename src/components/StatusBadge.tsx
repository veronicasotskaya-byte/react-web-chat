type StatusBadgeProps = {
  status: "Active" | "Inactive";
};

function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "Active";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "14px",
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: isActive ? "#22c55e" : "#9ca3af",
        }}
      />

      {status}
    </span>
  );
}

export default StatusBadge;
