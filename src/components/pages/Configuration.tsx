import { useState, useRef } from "react";
import { useStore } from "../../store";
import { mockBlocks } from "../../data/mock";
import { Toggle } from "../ui/Toggle";
import { StatusDot } from "../ui/StatusDot";
import { EnvPill } from "../ui/EnvPill";
import { ProjectDetail } from "./ProjectDetail";
import { ProdDeployModal } from "../ui/ProdDeployModal";
import type { Environment, Project } from "../../types";

type EnvTarget = Exclude<Environment, "all">;
type SourceType = "github" | "local";
type Mode = "list" | "create";

function generateId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function Configuration() {
  const { projects, selectedProj, addProject, navigate, setProject, settingsProdProvider, setProjectProdConfig } = useStore();

  const [mode, setMode] = useState<Mode>("list");
  const [prodModalProjectId, setProdModalProjectId] = useState<string | null>(null);

  // Create form state
  const [projectName, setProjectName] = useState("");
  const [env, setEnv] = useState<EnvTarget>("local");
  const [blocks, setBlocks] = useState(mockBlocks.map((b) => ({ ...b })));
  const [sourceType, setSourceType] = useState<SourceType>("github");
  const [repoUrl, setRepoUrl] = useState("");
  const [repoBranch, setRepoBranch] = useState("main");
  const [isPrivate, setIsPrivate] = useState(false);
  const [localPath, setLocalPath] = useState("");
  const localPathRef = useRef<HTMLInputElement>(null);

  const preconfigured = projects.filter((p) => p.type === "preconfigured");

  // If a preconfigured project is selected, show its detail
  if (selectedProj) {
    const proj = projects.find((p) => p.id === selectedProj && p.type === "preconfigured");
    if (proj) return <ProjectDetail project={proj} onBack={() => setProject(null)} />;
  }

  const toggleBlock = (id: string) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)));

  const enabledBlocks = blocks.filter((b) => b.enabled);
  const envOptions: EnvTarget[] = ["local", "dev", "production"];
  const hasSource = sourceType === "github" ? repoUrl.trim().length > 0 : localPath.trim().length > 0;
  const canCreate = projectName.trim().length > 0;

  const handleCreate = () => {
    const newProject: Project = {
      id: generateId(projectName) || `preconfig-${Date.now()}`,
      name: projectName.trim(),
      description: `Pre-configured stack — ${enabledBlocks.length} services enabled on ${env}.`,
      env: [env],
      lastDeploy: { version: "0.0.1", status: "idle", time: "never", duration: "—" },
      services: enabledBlocks.length,
      secretIds: [],
      type: "preconfigured",
      githubUrl: hasSource && sourceType === "github" ? repoUrl.trim() : undefined,
    };
    addProject(newProject);
    // Reset form
    setProjectName("");
    setBlocks(mockBlocks.map((b) => ({ ...b })));
    setRepoUrl("");
    setLocalPath("");
    setMode("list");
  };

  // ─── LIST MODE ────────────────────────────────────────────

  if (mode === "list") {
    return (
      <div className="p-10 h-full overflow-y-auto animate-fadeUp">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-ink tracking-tight">Configuration</h1>
            <p className="text-sm text-[#7A7567] mt-1">
              {preconfigured.length} pre-configured project{preconfigured.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={() => setMode("create")} className="btn-ghost-light">
            New preconfigured project
          </button>
        </div>

        {preconfigured.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-[13px] text-ink/40 mb-4">
              No pre-configured projects yet. Create one with the block toggles below.
            </p>
            <button onClick={() => setMode("create")} className="btn-ghost-light">
              Create preconfigured project
            </button>
          </div>
        ) : (
          <>
          {prodModalProjectId && (
            <ProdDeployModal
              defaultProvider={settingsProdProvider ?? "gcp"}
              onConfirm={(config) => {
                setProjectProdConfig(prodModalProjectId, config);
                setProdModalProjectId(null);
              }}
              onCancel={() => setProdModalProjectId(null)}
            />
          )}

          <div className="grid grid-cols-2 gap-3.5">
            {preconfigured.map((proj) => (
              <div
                key={proj.id}
                className="bg-ink rounded-xl p-[22px] cursor-pointer hover:bg-inkMid transition-colors duration-100"
                onClick={() => navigate("projects", proj.id)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-base font-bold text-white">{proj.name}</span>
                  <StatusDot status={proj.lastDeploy.status} size="md" />
                </div>
                <p className="text-[13px] text-white/50 leading-relaxed">{proj.description}</p>
                <div className="flex gap-1.5 mt-3">
                  {proj.env.map((e) => <EnvPill key={e} env={e} />)}
                </div>
                <div className="border-t border-white/[0.07] mt-4 pt-3.5 flex items-center gap-4">
                  <span className="text-[12px] text-white/35">{proj.services} services</span>
                  <span className="text-[12px] text-white/35 mr-auto">
                    v{proj.lastDeploy.version} · {proj.lastDeploy.time}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (proj.env.includes("production") && !proj.prodConfig) {
                        setProdModalProjectId(proj.id);
                      }
                    }}
                    className="py-1 px-3 rounded-lg text-[12px] text-white/60 border border-white/[0.12] hover:border-white/30 hover:text-white/90 transition-all duration-150 cursor-pointer"
                  >
                    Deploy
                  </button>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    );
  }

  // ─── CREATE MODE ──────────────────────────────────────────

  return (
    <div className="p-10 h-full overflow-y-auto animate-fadeUp">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode("list")} className="btn-ghost-light text-[12px]">
            Configuration
          </button>
          <span className="text-ink/30 text-sm">/</span>
          <span className="text-sm text-ink/60 font-medium">New preconfigured project</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-black/[0.08] rounded-lg p-0.5">
            {envOptions.map((e) => (
              <button
                key={e}
                onClick={() => setEnv(e)}
                className={`text-[12px] px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  env === e ? "bg-ink text-white font-bold" : "text-[#7A7567] hover:text-ink"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <button
            onClick={handleCreate}
            disabled={!canCreate}
            className={`btn-ghost-light ${!canCreate ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            Create
          </button>
        </div>
      </div>

      {/* Project name */}
      <div className="mb-5">
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
          autoFocus
          className="bg-transparent border-none outline-none text-xl font-bold text-ink tracking-tight placeholder-ink/20 w-full"
        />
      </div>

      {/* Source card */}
      <div className="bg-ink rounded-xl mb-5 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.07] flex items-center justify-between">
          <span className="text-[12px] text-white/50 uppercase tracking-widest">Code source</span>
          {hasSource && <span className="text-[11px] text-green-400/80 font-mono">connected</span>}
        </div>
        <div className="p-5">
          <div className="flex bg-white/[0.05] rounded-lg p-0.5 w-fit mb-5">
            {(["github", "local"] as SourceType[]).map((t) => (
              <button
                key={t}
                onClick={() => setSourceType(t)}
                className={`text-[12px] px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                  sourceType === t ? "bg-white/[0.12] text-white font-bold" : "text-white/40 hover:text-white/70"
                }`}
              >
                {t === "github" ? "GitHub" : "Local folder"}
              </button>
            ))}
          </div>

          {sourceType === "github" && (
            <div className="flex flex-col gap-3">
              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 140px" }}>
                <div>
                  <label className="text-[11px] text-white/35 uppercase tracking-widest mb-1.5 block">Repository URL</label>
                  <input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/org/repo" className="input-dark text-[13px]" />
                </div>
                <div>
                  <label className="text-[11px] text-white/35 uppercase tracking-widest mb-1.5 block">Branch</label>
                  <input value={repoBranch} onChange={(e) => setRepoBranch(e.target.value)} placeholder="main" className="input-dark text-[13px]" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <Toggle enabled={isPrivate} onChange={setIsPrivate} />
                  <span className="text-[13px] text-white/55">Private repository</span>
                  {isPrivate && <span className="text-[11px] text-white/30 font-mono">— OAuth required</span>}
                </div>
                {isPrivate && <button className="btn-ghost-dark text-[12px]">Connect GitHub</button>}
              </div>
            </div>
          )}

          {sourceType === "local" && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] text-white/35 uppercase tracking-widest mb-1.5 block">Folder path</label>
                <div className="flex gap-2">
                  <input ref={localPathRef} value={localPath} onChange={(e) => setLocalPath(e.target.value)} placeholder="/home/user/projects/my-service" className="input-dark text-[13px] flex-1 font-mono" />
                  <button onClick={() => localPathRef.current?.focus()} className="btn-ghost-dark text-[12px] flex-shrink-0">Browse</button>
                </div>
              </div>
              <p className="text-[12px] text-white/30 leading-relaxed">
                The folder should contain a <span className="font-mono text-white/45">docker-compose.yml</span> or individual Dockerfiles.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Blocks + DSL */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 320px" }}>
        <div className="grid grid-cols-2 gap-2.5 content-start">
          {blocks.map((block) => (
            <div
              key={block.id}
              onClick={() => toggleBlock(block.id)}
              className={`bg-ink rounded-xl p-3.5 cursor-pointer transition-colors duration-100 flex items-center justify-between ${
                block.enabled ? "bg-inkMid border border-white/[0.14]" : "border border-transparent"
              }`}
            >
              <div>
                <div className="text-sm text-white">{block.label}</div>
                <div className="text-[11px] text-white/30 mt-0.5">{block.category}</div>
              </div>
              <Toggle enabled={block.enabled} onChange={() => toggleBlock(block.id)} />
            </div>
          ))}
        </div>

        {/* DSL preview only */}
        <div className="bg-ink rounded-xl overflow-hidden h-fit">
          <div className="px-5 py-3.5 border-b border-white/[0.07]">
            <span className="text-[12px] text-white/50 uppercase tracking-widest">Generated DSL</span>
          </div>
          <div className="p-5 font-mono text-[12px] leading-loose">
            <span className="text-white/50">stack </span>
            <span className="text-white/90">{projectName || "my-project"}-{env}</span>
            <span className="text-white/30"> {"{"}</span>
            {hasSource && (
              <div className="ml-4">
                <span className="text-white/30">source: </span>
                <span style={{ color: "#E6AF2E" }}>
                  {sourceType === "github" ? `"${repoUrl || "..."}"` : `"${localPath || "..."}"`}
                </span>
              </div>
            )}
            {enabledBlocks.length > 0 && (
              <>
                <br />
                {enabledBlocks.map((b) => (
                  <div key={b.id}>
                    <span style={{ color: "#E6AF2E" }} className="ml-4">{b.id}</span>
                    <span className="text-white/25">: {"{ enabled: true }"}</span>
                  </div>
                ))}
              </>
            )}
            <br />
            <span className="text-white/30">{"}"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
