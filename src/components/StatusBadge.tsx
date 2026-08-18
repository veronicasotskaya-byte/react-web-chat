type StatusBadgeProps = {
  status: "Active" | "Inactive";
};

function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "Active";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium text-gray-700">
      <span
        className={`h-2 w-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
      />
      {status}
    </span>
  );
}

export default StatusBadge;
