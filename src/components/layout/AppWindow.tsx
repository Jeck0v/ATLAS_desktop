import { ReactNode } from "react";
import { TitleBar } from "./TitleBar";
import { Sidebar } from "./Sidebar";

interface AppWindowProps {
  children: ReactNode;
}

export function AppWindow({ children }: AppWindowProps) {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        width: 1100,
        height: 680,
        borderRadius: 30,
        backgroundColor: "#EFEBCE",
      }}
    >
      <TitleBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-hidden relative bg-cream">
          {children}
        </main>
      </div>
    </div>
  );
}
