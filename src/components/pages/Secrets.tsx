import { useState } from "react";
import { useStore } from "../../store";
import { mockProjects, mockSecrets } from "../../data/mock";
import { StatusDot } from "../ui/StatusDot";
import { EnvPill } from "../ui/EnvPill";
import { Modal } from "../ui/Modal";
import type { Environment } from "../../types";

export function Secrets() {
  const { navigate } = useStore();
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newEnv, setNewEnv] = useState<Environment>("production");

  const toggleReveal = (id: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="p-10 h-full overflow-y-auto animate-fadeUp relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Secrets</h1>
          <p className="text-sm text-[#7A7567] mt-1">{mockSecrets.length} secrets across {mockProjects.length} projects</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-ghost-light">
          + New secret
        </button>
      </div>

      {/* Groups by project */}
      <div className="flex flex-col gap-5">
        {mockProjects.map((proj) => {
          const secrets = mockSecrets.filter((s) => s.projectIds.includes(proj.id));
          if (secrets.length === 0) return null;

          return (
            <div key={proj.id}>
              {/* Project row header */}
              <div className="flex items-center gap-3 mb-2.5">
                <StatusDot status={proj.lastDeploy.status} />
                <span className="text-sm font-bold text-ink">{proj.name}</span>
                <div className="flex gap-1">
                  {proj.env.slice(0, 2).map((e) => (
                    <EnvPill key={e} env={e} variant="light" />
                  ))}
                </div>
                <button
                  onClick={() => navigate("projects", proj.id)}
                  className="ml-auto text-[12px] text-ink/40 hover:text-ink/70 transition-colors cursor-pointer"
                >
                  View project
                </button>
              </div>

              {/* Secrets card */}
              <div className="bg-ink rounded-xl overflow-hidden">
                {secrets.map((secret, i) => (
                  <div
                    key={secret.id}
                    className={`flex items-center gap-4 px-5 py-3.5 ${i > 0 ? "border-t border-white/[0.07]" : ""}`}
                  >
                    <span className="font-mono text-[13px] text-white flex-1">{secret.key}</span>
                    <EnvPill env={secret.env} />
                    <span className="font-mono text-[12px] text-white/30 w-36 text-right tracking-widest">
                      {revealed.has(secret.id) ? "secret_value_123" : "••••••••••••"}
                    </span>
                    <span className="text-[11px] text-white/25 w-20 text-right">{secret.updated}</span>

                    {/* Actions */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => toggleReveal(secret.id)}
                        className="btn-ghost-dark py-1 text-[11px]"
                      >
                        {revealed.has(secret.id) ? "hide" : "reveal"}
                      </button>
                      <button className="btn-ghost-dark py-1 text-[11px]">Edit</button>
                      <button
                        className="py-1 px-3 rounded-lg text-[11px] text-red-400/70 border border-red-500/15 hover:border-red-500/30 transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="bg-ink rounded-2xl p-7 w-[400px] border border-white/10 flex flex-col gap-5">
            <div>
              <h3 className="text-base font-bold text-white">New secret</h3>
              <p className="text-[12px] text-white/40 mt-1">Add a new secret to your project</p>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-widest mb-1.5 block">Key</label>
                <input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="DATABASE_URL"
                  className="input-dark"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-widest mb-1.5 block">Value</label>
                <input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  type="password"
                  placeholder="••••••••••"
                  className="input-dark"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-white/40 uppercase tracking-widest mb-1.5 block">Environment</label>
                  <select
                    value={newEnv}
                    onChange={(e) => setNewEnv(e.target.value as Environment)}
                    className="input-dark"
                  >
                    <option value="production">production</option>
                    <option value="dev">dev</option>
                    <option value="local">local</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-white/40 uppercase tracking-widest mb-1.5 block">Project</label>
                  <select className="input-dark">
                    {mockProjects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setShowModal(false)} className="btn-ghost-dark">
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-dark"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
