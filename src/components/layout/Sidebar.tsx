import { useStore } from "../../store";
import type { PageId } from "../../types";

interface NavItem {
  id: PageId;
  label: string;
}

const navGroups: (NavItem | "separator")[] = [
  { id: "dashboard", label: "Dashboard" },
  "separator",
  { id: "config", label: "Pre-config" },
  { id: "projects", label: "Projects" },
  "separator",
  { id: "secrets", label: "Secrets" },
  { id: "testing", label: "Test & Audit" },
  "separator",
  { id: "settings", label: "Settings" },
];

export function Sidebar() {
  const { page, setPage, setProject } = useStore();

  const handleNav = (id: PageId) => {
    if (id !== "projects") setProject(null);
    setPage(id);
  };

  return (
    <div className="w-[188px] bg-ink border-r border-white/[0.07] p-5 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="text-xl font-bold tracking-wide text-white mb-7 select-none text-center">
        ATLAS
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {navGroups.map((item, i) => {
          if (item === "separator") {
            return (
              <div key={`sep-${i}`} className="h-px bg-white/[0.07] my-2 mx-2" />
            );
          }
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-[15px] cursor-pointer w-full text-left transition-colors duration-100 ${
                isActive
                  ? "bg-inkHov text-white font-bold"
                  : "text-white/55 hover:bg-inkHov hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <span className="w-[5px] h-[5px] rounded-full bg-white/40 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
