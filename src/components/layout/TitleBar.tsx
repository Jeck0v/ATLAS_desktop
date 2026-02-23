import { getCurrentWindow } from "@tauri-apps/api/window";

const win = getCurrentWindow();

export function TitleBar() {
  const handleMouseDown = async (e: React.MouseEvent) => {
    // Only drag on left click, not on buttons
    if (e.button === 0 && (e.target as HTMLElement).closest("button") === null) {
      await win.startDragging();
    }
  };

  return (
    <div
      className="h-10 bg-ink flex items-center px-4 flex-shrink-0 relative select-none cursor-move"
      onMouseDown={handleMouseDown}
    >
      {/* Traffic lights */}
      <div className="flex items-center gap-2 z-10">
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => win.close()}
          className="w-[11px] h-[11px] rounded-full flex-shrink-0 cursor-pointer hover:brightness-125 transition-all"
          style={{ backgroundColor: "#FF3232" }}
          title="Fermer"
        />
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => win.minimize()}
          className="w-[11px] h-[11px] rounded-full flex-shrink-0 cursor-pointer hover:brightness-125 transition-all"
          style={{ backgroundColor: "#FFD21C" }}
          title="Réduire"
        />
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => win.toggleMaximize()}
          className="w-[11px] h-[11px] rounded-full flex-shrink-0 cursor-pointer hover:brightness-125 transition-all"
          style={{ backgroundColor: "#5CB87A" }}
          title="Agrandir"
        />
      </div>

      {/* Centered title */}
      <span className="absolute inset-0 flex items-center justify-center text-xs tracking-[0.1em] text-white/25 pointer-events-none">
        ATLAS
      </span>
    </div>
  );
}
