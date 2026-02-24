import type { Environment } from "../../types";

interface EnvPillProps {
  env: Environment;
  variant?: "dark" | "light";
}

// Dark variant — all three envs same weight/background, only label differs
const darkStyles: Record<Environment, string> = {
  production: "bg-white/[0.08] text-white/65",
  dev:        "bg-white/[0.08] text-white/65",
  local:      "bg-white/[0.08] text-white/65",
  all:        "bg-white/[0.07] text-white/55",
};

// Light variant — same visual weight, distinguished by subtle hue
const lightStyles: Record<Environment, string> = {
  production: "bg-[#0941A5]/[0.08] text-[#0941A5]",
  dev:        "bg-yellow-700/[0.10] text-yellow-800",
  local:      "bg-ink/[0.07] text-ink/65",
  all:        "bg-ink/[0.06] text-ink/50",
};

export function EnvPill({ env, variant = "dark" }: EnvPillProps) {
  const styles = variant === "dark" ? darkStyles : lightStyles;
  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-mono inline-block ${styles[env]}`}>
      {env}
    </span>
  );
}
