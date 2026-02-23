import { useState, useRef, useEffect } from "react";
import { useStore } from "../../store";
import { mockBlocks } from "../../data/mock";

// ─── Syntax highlighter ────────────────────────────────────────────────────

type Token = { text: string; color: string };

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let rem = line;

  while (rem.length > 0) {
    if (rem.startsWith("//")) {
      tokens.push({ text: rem, color: "rgba(255,255,255,0.25)" });
      break;
    }
    const kw = rem.match(/^(stack|service|deploy|config|version)\b/);
    if (kw) {
      tokens.push({ text: kw[0], color: "rgba(255,255,255,0.55)" });
      rem = rem.slice(kw[0].length);
      continue;
    }
    const ident = rem.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)(?=\s*[:{ ])/);
    if (ident && tokens.length > 0) {
      tokens.push({ text: ident[0], color: "#E6AF2E" });
      rem = rem.slice(ident[0].length);
      continue;
    }
    const bool = rem.match(/^(true|false|\d+(\.\d+)?)\b/);
    if (bool) {
      tokens.push({ text: bool[0], color: "#5CB87A" });
      rem = rem.slice(bool[0].length);
      continue;
    }
    const str = rem.match(/^"[^"]*"/);
    if (str) {
      tokens.push({ text: str[0], color: "#E6AF2E" });
      rem = rem.slice(str[0].length);
      continue;
    }
    if ("{}:,".includes(rem[0])) {
      tokens.push({ text: rem[0], color: "rgba(255,255,255,0.25)" });
      rem = rem.slice(1);
      continue;
    }
    const ws = rem.match(/^\s+/);
    if (ws) {
      tokens.push({ text: ws[0], color: "transparent" });
      rem = rem.slice(ws[0].length);
      continue;
    }
    tokens.push({ text: rem[0], color: "rgba(255,255,255,0.55)" });
    rem = rem.slice(1);
  }
  return tokens;
}

function renderHighlighted(code: string) {
  return code.split("\n").map((line, i) => (
    <div key={i} style={{ minHeight: "1.65em" }}>
      {tokenizeLine(line).map((t, j) => (
        <span key={j} style={{ color: t.color }}>{t.text}</span>
      ))}
    </div>
  ));
}

// ─── DSL generation ────────────────────────────────────────────────────────

function buildDefaultDsl(projectId: string, env: string): string {
  const enabled = mockBlocks.filter((b) => b.enabled);
  return [
    `stack ${projectId}-${env} {`,
    ...enabled.map((b) => `  ${b.id}: { enabled: true }`),
    `}`,
  ].join("\n");
}

// ─── Component ─────────────────────────────────────────────────────────────

export function DslEditor() {
  const { selectedProj, projects, navigate, setProject } = useStore();
  const project = projects.find((p) => p.id === selectedProj);
  const projectId = project?.id ?? "my-project";

  const [env, setEnv] = useState<string>(
    project?.env.filter((e) => e !== "all")[0] ?? "local"
  );
  const [dsl, setDsl] = useState(() => buildDefaultDsl(projectId, env));
  const [saved, setSaved] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDsl(buildDefaultDsl(projectId, env));
    setSaved(false);
  }, [env, projectId]);

  const syncScroll = () => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lineCount = dsl.split("\n").length;
  const blockCount = dsl.split("\n").filter((l) => l.match(/^\s+\w+:/)).length;
  // Always show all 3 envs so user can switch freely
  const envOptions = ["local", "dev", "production"];

  const handleSave = () => {
    setSaved(true);
  };

  const handleBack = () => {
    if (project) {
      navigate("projects", project.id);
    } else {
      navigate("projects");
      setProject(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-cream animate-fadeUp">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-ink/[0.08] flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="btn-ghost-light text-[12px]">
            {project ? project.name : "Projects"}
          </button>
          <span className="text-ink/25 text-sm">/</span>
          <span className="text-sm text-ink/60 font-mono">deployment.dsl</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Env segmented */}
          <div className="flex bg-black/[0.07] rounded-lg p-0.5">
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

          {saved && (
            <button onClick={handleBack} className="btn-ghost-light text-[12px]">
              Back to project
            </button>
          )}

          <button
            onClick={handleSave}
            className={`btn-ghost-light text-[12px] transition-all ${
              saved ? "text-green-800 border-green-700/40" : ""
            }`}
          >
            {saved ? "Saved" : "Save"}
          </button>

          <button
            className="px-4 py-1.5 rounded-lg text-[12px] font-bold cursor-pointer transition-all bg-ink hover:bg-inkHov"
            style={{ color: "#E6AF2E" }}
          >
            Deploy · {env}
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex flex-1 min-h-0">
        {/* Code pane */}
        <div className="flex flex-1 min-w-0 bg-ink relative font-mono text-[13px]">
          {/* Line numbers */}
          <div className="flex-shrink-0 w-10 py-5 text-right pr-3 select-none border-r border-white/[0.05]">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="leading-[1.65em] text-[11px] text-white/25">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Syntax-highlight overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 ml-10 py-5 px-4 pointer-events-none overflow-hidden leading-[1.65em] whitespace-pre"
            aria-hidden
          >
            {renderHighlighted(dsl)}
          </div>

          {/* Textarea (transparent text, caret only) */}
          <textarea
            ref={textareaRef}
            value={dsl}
            onChange={(e) => setDsl(e.target.value)}
            onScroll={syncScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="flex-1 min-w-0 bg-transparent resize-none outline-none py-5 px-4 leading-[1.65em] whitespace-pre overflow-auto dark-scroll z-10"
            style={{
              color: "transparent",
              caretColor: "#E6AF2E",
              fontFamily: "inherit",
              fontSize: "inherit",
            }}
          />
        </div>

        {/* Right panel */}
        <div className="w-[220px] flex-shrink-0 border-l border-ink/[0.08] flex flex-col p-6 overflow-y-auto gap-6">

          {/* Validation */}
          <div>
            <p className="text-[11px] uppercase tracking-widest text-ink/40 mb-3">Validation</p>
            {[
              { label: "Syntax", ok: true },
              { label: "Block IDs", ok: true },
              { label: "Target env", ok: true },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center justify-between py-1.5">
                <span className="text-[13px] text-ink/70">{label}</span>
                <span className={`text-[13px] font-mono ${ok ? "text-green-700" : "text-red-600"}`}>
                  {ok ? "valid" : "error"}
                </span>
              </div>
            ))}
          </div>

          <div className="h-px bg-ink/[0.08]" />

          {/* Summary */}
          <div>
            <p className="text-[11px] uppercase tracking-widest text-ink/40 mb-3">Summary</p>
            {[
              { label: "Target", value: env },
              { label: "Blocks", value: blockCount },
              { label: "Lines", value: lineCount },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-ink/[0.06] last:border-0">
                <span className="text-[13px] text-ink/60">{label}</span>
                <span className="text-[13px] font-mono text-ink/90">{value}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-ink/[0.08]" />

          {/* Syntax reference */}
          <div>
            <p className="text-[11px] uppercase tracking-widest text-ink/40 mb-3">Syntax</p>
            <div className="font-mono text-[12px] leading-relaxed bg-ink/[0.05] rounded-lg p-3">
              <div>
                <span style={{ color: "#E6AF2E" }}>block</span>
                <span className="text-ink/40">: {"{"}</span>
              </div>
              <div className="ml-2">
                <span className="text-ink/40">enabled: </span>
                <span className="text-green-700">true</span>
              </div>
              <div className="text-ink/40">{"}"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
