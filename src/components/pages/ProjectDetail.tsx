import { useState } from "react";
import type { Project, Environment } from "../../types";
import { mockSecrets, mockBlocks } from "../../data/mock";
import { useStore } from "../../store";
import { StatusDot } from "../ui/StatusDot";
import { EnvPill } from "../ui/EnvPill";
import { ProdDeployModal } from "../ui/ProdDeployModal";

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

const mockHistory = [
  { version: "2.4.1", status: "success" as const, duration: "1m 12s", time: "2h ago" },
  { version: "2.4.0", status: "success" as const, duration: "58s", time: "1d ago" },
  { version: "2.3.9", status: "failed" as const, duration: "3m 22s", time: "2d ago" },
  { version: "2.3.8", status: "success" as const, duration: "1m 04s", time: "3d ago" },
  { version: "2.3.7", status: "success" as const, duration: "47s", time: "5d ago" },
];

const mockBranches = ["main", "develop", "dev", "release/v2.4"];

type EnvTarget = Exclude<Environment, "all">;

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const { navigate, settingsProdProvider, setProjectProdConfig } = useStore();
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [selectedEnv, setSelectedEnv] = useState<EnvTarget>(
    (project.env[0] as EnvTarget) ?? "local"
  );
  const [branch, setBranch] = useState("main");
  const [showProdModal, setShowProdModal] = useState(false);

  const linkedSecrets = mockSecrets.filter((s) => project.secretIds.includes(s.id));
  const enabledBlocks = mockBlocks.filter((b) => b.enabled);
  const availableEnvs = project.env.filter((e) => e !== "all") as EnvTarget[];
  const hasGithub = Boolean(project.githubUrl);

  const toggleReveal = (id: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="p-10 h-full overflow-y-auto animate-fadeUp">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="btn-ghost-light text-[12px]">
          Projects
        </button>
        <span className="text-ink/30 text-sm">/</span>
        <span className="text-sm text-ink/70 font-medium">{project.name}</span>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 280px" }}>
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Hero card */}
          <div className="bg-ink rounded-xl p-6">
            <div className="mb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">{project.name}</h2>
                  <p className="text-[13px] text-white/45 leading-relaxed mt-1.5">
                    {project.description}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ${
                    project.type === "preconfigured"
                      ? "bg-white/[0.06] text-white/35"
                      : "bg-white/[0.06] text-white/35"
                  }`}
                >
                  {project.type}
                </span>
              </div>

              {hasGithub && (
                <p className="text-[11px] text-white/25 font-mono mt-2 truncate">
                  {project.githubUrl}
                </p>
              )}
            </div>

            {/* Env pills */}
            <div className="flex gap-1.5 mb-5">
              {availableEnvs.map((e) => (
                <button
                  key={e}
                  onClick={() => setSelectedEnv(e)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
                    selectedEnv === e
                      ? "ring-1 ring-white/30 bg-white/[0.13] text-white"
                      : "bg-white/[0.06] text-white/40 hover:bg-white/[0.1] hover:text-white/60"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Branch selector — only for GitHub projects */}
              {hasGithub && (
                <div className="relative flex-shrink-0">
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="appearance-none bg-white/[0.07] border border-white/[0.12] rounded-lg pl-3 pr-7 py-1.5 text-[12px] text-white/70 font-mono cursor-pointer outline-none focus:border-white/30 transition-colors"
                  >
                    {mockBranches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/30 text-[10px]">
                    ▾
                  </span>
                </div>
              )}

              <button
                onClick={() => navigate("dsl-editor", project.id)}
                className="btn-ghost-dark text-[13px]"
              >
                Edit deployment
              </button>
              <button
                className="btn-dark text-[13px]"
                onClick={() => {
                  if (selectedEnv === "production" && !project.prodConfig) {
                    setShowProdModal(true);
                  }
                }}
              >
                Deploy · {selectedEnv}
                {hasGithub && <span className="text-white/50 ml-1 font-normal">({branch})</span>}
              </button>
            </div>
          </div>

          {/* DSL preview */}
          <div className="bg-ink rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.07] flex items-center justify-between">
              <span className="text-[12px] text-white/50 uppercase tracking-widest">
                DSL · {selectedEnv}
              </span>
              <button
                onClick={() => navigate("dsl-editor", project.id)}
                className="text-[12px] text-white/35 hover:text-white/65 transition-colors cursor-pointer"
              >
                Edit
              </button>
            </div>
            <div className="p-5 font-mono text-[12px] leading-loose">
              <span className="text-white/50">stack </span>
              <span className="text-white/90">{project.id}-{selectedEnv}</span>
              <span className="text-white/30"> {"{"}</span>
              <br />
              {enabledBlocks.slice(0, 4).map((b) => (
                <div key={b.id}>
                  <span style={{ color: "#E6AF2E" }} className="ml-4">{b.id}</span>
                  <span className="text-white/25">: {"{ enabled: true }"}</span>
                </div>
              ))}
              <br />
              <span className="text-white/30">{"}"}</span>
            </div>
          </div>

          {/* Deployment history */}
          <div className="bg-ink rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.07]">
              <span className="text-sm text-white">Deployment History</span>
            </div>
            {mockHistory.map((dep, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-3.5 border-t border-white/[0.07] first:border-0"
              >
                <StatusDot status={dep.status} />
                <span className="font-mono text-sm text-white/70 flex-1">v{dep.version}</span>
                <span className="font-mono text-sm text-white/35">{dep.duration}</span>
                <span className="text-[12px] text-white/30 w-16 text-right">{dep.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Linked secrets */}
          <div className="bg-ink rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
              <span className="text-sm text-white">Linked secrets</span>
              <button className="btn-ghost-dark text-[11px] py-1">Add</button>
            </div>
            {linkedSecrets.length === 0 && (
              <div className="px-5 py-4 text-[13px] text-white/30">No secrets linked.</div>
            )}
            {linkedSecrets.map((secret) => (
              <div
                key={secret.id}
                className="flex items-center gap-3 px-5 py-3 border-t border-white/[0.07] first:border-0"
              >
                <span className="font-mono text-[12px] text-white/70 flex-1 truncate">{secret.key}</span>
                <button
                  onClick={() => toggleReveal(secret.id)}
                  className="text-[11px] text-white/35 hover:text-white/65 transition-colors cursor-pointer"
                >
                  {revealed.has(secret.id) ? "hide" : "show"}
                </button>
                <span className="font-mono text-[11px] text-white/25 w-20 text-right">
                  {revealed.has(secret.id) ? "secret_val" : "••••••••"}
                </span>
                <EnvPill env={secret.env} />
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div className="bg-ink rounded-xl p-5">
            <div className="text-sm text-white mb-4">Quick stats</div>
            {[
              { label: "Services", value: project.services },
              { label: "Secrets", value: project.secretIds.length },
              { label: "Environments", value: project.env.length },
              ...(hasGithub ? [{ label: "Branch", value: branch }] : []),
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2.5 border-t border-white/[0.07] first:border-0"
              >
                <span className="text-[13px] text-white/40">{label}</span>
                <span className="text-[13px] font-mono text-white/70">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showProdModal && (
        <ProdDeployModal
          defaultProvider={settingsProdProvider ?? "gcp"}
          onConfirm={(config) => {
            setProjectProdConfig(project.id, config);
            setShowProdModal(false);
          }}
          onCancel={() => setShowProdModal(false)}
        />
      )}
    </div>
  );
}
