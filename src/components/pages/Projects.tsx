import { useStore } from "../../store";
import { StatusDot } from "../ui/StatusDot";
import { EnvPill } from "../ui/EnvPill";
import { ProjectDetail } from "./ProjectDetail";
import type { Project } from "../../types";

function ProjectCard({ proj }: { proj: Project }) {
  const { navigate } = useStore();
  return (
    <div
      className="bg-ink rounded-xl p-[22px] cursor-pointer hover:bg-inkMid transition-colors duration-100"
      onClick={() => navigate("projects", proj.id)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-base font-bold text-white">{proj.name}</span>
        <StatusDot status={proj.lastDeploy.status} size="md" />
      </div>

      <p className="text-[13px] text-white/50 leading-relaxed">{proj.description}</p>

      {proj.githubUrl && (
        <p className="text-[11px] text-white/25 font-mono mt-2 truncate">{proj.githubUrl}</p>
      )}

      <div className="flex gap-1.5 mt-3">
        {proj.env.map((e) => <EnvPill key={e} env={e} />)}
      </div>

      <div className="border-t border-white/[0.07] mt-4 pt-3.5 flex items-center gap-4">
        <span className="text-[12px] text-white/35">{proj.services} services</span>
        <span className="text-[12px] text-white/35">{proj.secretIds.length} secrets</span>
        <span className="text-[12px] text-white/35 mr-auto">
          v{proj.lastDeploy.version} · {proj.lastDeploy.time}
        </span>
        <button
          onClick={(e) => e.stopPropagation()}
          className="py-1 px-3 rounded-lg text-[12px] text-white/60 border border-white/[0.12] hover:border-white/30 hover:text-white/90 transition-all duration-150 cursor-pointer"
        >
          Deploy
        </button>
      </div>
    </div>
  );
}

export function Projects() {
  const { selectedProj, projects, navigate, setProject } = useStore();

  if (selectedProj) {
    const proj = projects.find((p) => p.id === selectedProj);
    if (proj) return <ProjectDetail project={proj} onBack={() => setProject(null)} />;
  }

  const custom = projects.filter((p) => p.type === "custom");

  return (
    <div className="p-10 h-full overflow-y-auto animate-fadeUp">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Projects</h1>
          <p className="text-sm text-[#7A7567] mt-1">{custom.length} custom projects</p>
        </div>
        <button onClick={() => navigate("new-project")} className="btn-ghost-light">
          New project
        </button>
      </div>

      {custom.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <p className="text-[13px] text-ink/40 mb-4">No custom projects yet.</p>
          <button onClick={() => navigate("new-project")} className="btn-ghost-light">
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5">
          {custom.map((proj) => <ProjectCard key={proj.id} proj={proj} />)}
        </div>
      )}
    </div>
  );
}
