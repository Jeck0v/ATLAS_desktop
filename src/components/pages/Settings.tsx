import { useState } from "react";
import { useStore } from "../../store";
import { EnvPill } from "../ui/EnvPill";

type Tab = "general" | "integrations" | "deployment";
type DefaultEnv = "local" | "dev" | "production";

// ── Sub-components ────────────────────────────────────────────────────────

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "general", label: "General" },
    { id: "integrations", label: "Integrations" },
    { id: "deployment", label: "Deployment" },
  ];
  return (
    <div className="flex gap-0.5 border-b border-ink/[0.08] mb-7">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-2.5 text-[13px] cursor-pointer transition-colors relative ${
            active === t.id
              ? "text-ink font-bold"
              : "text-ink/45 hover:text-ink/75"
          }`}
        >
          {t.label}
          {active === t.id && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink rounded-t-sm" />
          )}
        </button>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <p className="text-[11px] uppercase tracking-widest text-ink/40 mb-3">{children}</p>
  );
}

function IntegrationCard({
  name,
  description,
  connected,
  note,
}: {
  name: string;
  description: string;
  connected?: boolean;
  note?: string;
}) {
  const [isConnected, setIsConnected] = useState(connected ?? false);
  return (
    <div className="bg-ink rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[14px] font-bold text-white">{name}</p>
          <p className="text-[13px] text-white/45 mt-1 leading-relaxed">{description}</p>
          {note && <p className="text-[11px] text-white/25 font-mono mt-2">{note}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
          {isConnected ? (
            <>
              <span className="text-[12px] text-green-400/80 font-mono">connected</span>
              <button
                onClick={() => setIsConnected(false)}
                className="btn-ghost-dark text-[12px]"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsConnected(true)}
              className="btn-dark text-[13px]"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Option card ────────────────────────────────────────────────────────────
function ProviderOptionCard({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex-1 text-left p-4 rounded-xl border transition-all cursor-pointer ${
        selected
          ? "bg-inkMid border-white/[0.18] text-white"
          : "bg-ink border-transparent text-white/55 hover:border-white/[0.1] hover:text-white/75"
      }`}
    >
      <p className="text-[13px] font-bold mb-1">{label}</p>
      <p className="text-[12px] opacity-60 leading-relaxed">{description}</p>
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export function Settings() {
  const { settingsProdProvider, setSettingsProdProvider } = useStore();
  const [tab, setTab] = useState<Tab>("general");
  const [defaultEnv, setDefaultEnv] = useState<DefaultEnv>("local");
  const [ngrokToken, setNgrokToken] = useState("");

  return (
    <div className="p-10 h-full overflow-y-auto animate-fadeUp">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Settings</h1>
        <p className="text-sm text-[#7A7567] mt-1">Application preferences and integrations</p>
      </div>

      <TabBar active={tab} onChange={setTab} />

      {/* ── GENERAL ─────────────────────────────────────────────── */}
      {tab === "general" && (
        <div className="flex flex-col gap-5 max-w-[520px]">
          <div className="bg-ink rounded-xl p-6">
            <p className="text-[14px] font-bold text-white mb-2">About ATLAS</p>
            <p className="text-[13px] text-white/45 leading-relaxed mb-4">
              ATLAS is a desktop orchestration tool that lets you define, deploy, and monitor
              infrastructure stacks via a custom DSL. Built with Tauri 2 + React.
            </p>
            <div className="flex gap-2 flex-wrap">
              <EnvPill env="production" />
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.06] text-white/50">
                v0.1.0
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.06] text-white/50">
                Tauri 2
              </span>
            </div>
          </div>

          <div className="bg-ink rounded-xl p-6">
            <p className="text-[14px] font-bold text-white mb-1">Default environment</p>
            <p className="text-[13px] text-white/40 mb-4">
              Used when creating new projects and secrets.
            </p>
            <div className="flex bg-white/[0.05] rounded-lg p-0.5 w-fit">
              {(["local", "dev", "production"] as DefaultEnv[]).map((e) => (
                <button
                  key={e}
                  onClick={() => setDefaultEnv(e)}
                  className={`text-[12px] px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    defaultEnv === e
                      ? "bg-inkHov text-white font-bold"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── INTEGRATIONS ────────────────────────────────────────── */}
      {tab === "integrations" && (
        <div className="flex flex-col gap-4 max-w-[520px]">
          <SectionTitle>Version control</SectionTitle>
          <IntegrationCard
            name="GitHub"
            description="Connect your GitHub account to link repositories, pull branches, and trigger deploys on push."
            note="Requires read/write access to repos and webhooks."
          />

          <SectionTitle>Notifications</SectionTitle>
          <IntegrationCard
            name="Slack"
            description="Receive deployment notifications and alerts directly in your Slack workspace."
            note="Requires an incoming webhook URL from your Slack app."
          />
        </div>
      )}

      {/* ── DEPLOYMENT ──────────────────────────────────────────── */}
      {tab === "deployment" && (
        <div className="flex flex-col gap-6 max-w-[520px]">

          {/* Local */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <SectionTitle>Local</SectionTitle>
              <EnvPill env="local" variant="light" />
            </div>
            <div className="bg-ink rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div>
                  <p className="text-[13px] font-bold text-white">ngrok</p>
                  <p className="text-[12px] text-white/40 mt-0.5 leading-relaxed">
                    Exposes your local services to the internet via a secure tunnel.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.07] text-white/45 flex-shrink-0 mt-0.5">
                  default
                </span>
              </div>
              <div>
                <label className="text-[11px] text-white/35 uppercase tracking-widest mb-1.5 block">
                  Auth token
                </label>
                <input
                  value={ngrokToken}
                  onChange={(e) => setNgrokToken(e.target.value)}
                  placeholder="2abc123_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="input-dark text-[13px] font-mono"
                  type="password"
                />
                <p className="text-[11px] text-white/25 mt-1.5">
                  Get your token at dashboard.ngrok.com
                </p>
              </div>
            </div>
          </div>

          {/* Dev */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <SectionTitle>Dev</SectionTitle>
              <EnvPill env="dev" variant="light" />
            </div>
            <div className="bg-ink rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-bold text-white">Docker Compose</p>
                  <p className="text-[12px] text-white/40 mt-0.5 leading-relaxed">
                    Deploys your stack using docker-compose on a remote host via SSH.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.07] text-white/45 flex-shrink-0">
                  default
                </span>
              </div>
            </div>
          </div>

          {/* Production */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <SectionTitle>Production</SectionTitle>
              <EnvPill env="production" variant="light" />
            </div>
            <div className="bg-ink rounded-xl p-5">
              <p className="text-[13px] text-white/40 mb-4 leading-relaxed">
                Default cloud provider used when deploying a project to production for the first time.
                Each project can override this setting.
              </p>
              <div className="flex gap-2.5">
                <ProviderOptionCard
                  label="Google Cloud"
                  description="GKE / Cloud Run — deploy on Google infrastructure."
                  selected={settingsProdProvider === "gcp"}
                  onSelect={() => setSettingsProdProvider("gcp")}
                />
                <ProviderOptionCard
                  label="Amazon AWS"
                  description="EKS / ECS — deploy on Amazon infrastructure."
                  selected={settingsProdProvider === "aws"}
                  onSelect={() => setSettingsProdProvider("aws")}
                />
              </div>
              {settingsProdProvider === null && (
                <p className="text-[11px] text-white/25 mt-3 font-mono">
                  No default set — GCP will be used if not configured per project.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
