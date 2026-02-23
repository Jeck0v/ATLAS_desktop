interface ToggleProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
}

export function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative flex-shrink-0 cursor-pointer"
      style={{ width: 32, height: 18 }}
      role="switch"
      aria-checked={enabled}
    >
      <div
        className={`absolute inset-0 rounded-full transition-colors duration-150 ${
          enabled ? "bg-white/90" : "bg-white/[0.18]"
        }`}
      />
      <div
        className={`absolute top-[3px] w-3 h-3 rounded-full transition-all duration-150 ${
          enabled ? "bg-ink left-[17px]" : "bg-white/50 left-[3px]"
        }`}
      />
    </button>
  );
}
