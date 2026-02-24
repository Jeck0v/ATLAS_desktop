import type { DeployStatus } from "../../types";

interface StatusDotProps {
  status: DeployStatus;
  size?: "sm" | "md";
}

const colorMap: Record<DeployStatus, string> = {
  success: "#5CB87A",
  failed: "#FF3232",
  running: "#FFD21C",
  idle: "rgba(255,255,255,0.25)",
};

export function StatusDot({ status, size = "sm" }: StatusDotProps) {
  const dim = size === "md" ? "w-2 h-2" : "w-1.5 h-1.5";
  const pulse = status === "failed" || status === "running" ? "animate-pulse" : "";

  return (
    <span
      className={`${dim} rounded-full inline-block flex-shrink-0 ${pulse}`}
      style={{ backgroundColor: colorMap[status] }}
    />
  );
}
