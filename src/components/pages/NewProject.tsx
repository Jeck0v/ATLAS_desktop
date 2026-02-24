import { useState } from "react";
import { useStore } from "../../store";
import type { Project } from "../../types";

type Step = "info" | "github";

function generateId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function NewProject() {
  const { navigate, addProject } = useStore();
  const [step, setStep] = useState<Step>("info");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");

  const canContinue = name.trim().length > 0;
  const canFinish = repoUrl.trim().length > 0;

  const createAndOpen = (skipGithub = false) => {
    const newProject: Project = {
      id: generateId(name) || `project-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || "No description yet.",
      env: ["local"],
      lastDeploy: { version: "0.0.1", status: "idle", time: "never", duration: "—" },
      services: 0,
      secretIds: [],
      type: "custom",
      githubUrl: skipGithub ? undefined : repoUrl.trim() || undefined,
    };
    addProject(newProject);
    navigate("dsl-editor", newProject.id);
  };

  return (
    <div className="p-10 h-full overflow-y-auto animate-fadeUp">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate("projects")} className="btn-ghost-light text-[12px]">
          Projects
        </button>
        <span className="text-ink/30 text-sm">/</span>
        <span className="text-sm text-ink/60 font-medium">New project</span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 max-w-[480px]">
        {(["info", "github"] as Step[]).map((s, i) => {
          const done = step === "github" && s === "info";
          const active = step === s;
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  done ? "bg-ink text-white" : active ? "bg-ink/15 text-ink border border-ink/25" : "bg-ink/[0.06] text-ink/30"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-[13px] transition-colors ${active ? "text-ink" : done ? "text-ink/50" : "text-ink/30"}`}>
                {s === "info" ? "Project info" : "Link GitHub"}
              </span>
              {i === 0 && <div className={`w-10 h-px mx-1 ${done ? "bg-ink/25" : "bg-ink/[0.08]"}`} />}
            </div>
          );
        })}
      </div>

      <div className="max-w-[480px]">
        {step === "info" && (
          <div className="bg-ink rounded-2xl p-7 flex flex-col gap-5 animate-fadeUp">
            <div>
              <p className="text-base font-bold text-white mb-1">Project info</p>
              <p className="text-[13px] text-white/45">Basic information about your new project.</p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">
                  Project name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="my-service"
                  className="input-dark"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && canContinue && setStep("github")}
                />
              </div>
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this service do?"
                  rows={3}
                  className="input-dark resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setStep("github")}
                disabled={!canContinue}
                className={`btn-dark text-[13px] ${!canContinue ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "github" && (
          <div className="bg-ink rounded-2xl p-7 flex flex-col gap-5 animate-fadeUp">
            <div>
              <p className="text-base font-bold text-white mb-1">Link GitHub repository</p>
              <p className="text-[13px] text-white/45">
                Connect a repo to enable auto-deploy on push.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">
                  Repository URL
                </label>
                <input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/org/repo"
                  className="input-dark"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-widest mb-2 block">
                  Branch
                </label>
                <input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                  className="input-dark"
                />
              </div>

              <div className="flex items-start gap-3 bg-white/[0.04] rounded-lg p-3.5 border border-white/[0.06]">
                <p className="text-[13px] text-white/40 leading-relaxed">
                  GitHub OAuth will be required to access private repos and configure webhooks for auto-deploy.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-1">
              <button onClick={() => setStep("info")} className="btn-ghost-dark text-[13px]">
                Back
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => createAndOpen(true)}
                  className="btn-ghost-dark text-[13px]"
                >
                  Skip for now
                </button>
                <button
                  onClick={() => createAndOpen(false)}
                  disabled={!canFinish}
                  className={`btn-dark text-[13px] ${!canFinish ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  Configure DSL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
