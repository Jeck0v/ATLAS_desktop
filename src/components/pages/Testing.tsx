import { useState, useRef } from "react";
import { useStore } from "../../store";
import { mockTestLogs } from "../../data/mock";

type LogType = "ok" | "warn" | "err" | "info";

const logTypeColor: Record<LogType, string> = {
  ok: "text-green-400/80",
  warn: "text-yellow-300/80",
  err: "text-red-400/80",
  info: "text-white/30",
};

const owaspChecks = [
  { label: "SQL Injection", status: "pass" as const },
  { label: "XSS Protection", status: "pass" as const },
  { label: "CORS Policy", status: "warn" as const },
  { label: "CSRF Tokens", status: "pass" as const },
  { label: "TLS Version", status: "warn" as const },
  { label: "Secrets Exposure", status: "pass" as const },
];

const mockBranches = ["main", "develop", "dev", "release/v2.4"];

// Small styled select reused for both dropdowns
function StyledSelect({
  value,
  onChange,
  disabled,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="appearance-none bg-black/[0.07] border border-ink/[0.12] rounded-lg px-3 py-1.5 text-[13px] text-ink/80 pr-7 cursor-pointer outline-none focus:border-ink/30 transition-colors disabled:opacity-50"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 text-[10px]">
        ▾
      </span>
    </div>
  );
}

export function Testing() {
  const { projects } = useStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id ?? "");
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [running, setRunning] = useState(false);
  const [logIndex, setLogIndex] = useState(0);
  const [testPct, setTestPct] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const hasGithub = Boolean(selectedProject?.githubUrl);
  const visibleLogs = mockTestLogs.slice(0, logIndex);

  const handleProjectChange = (id: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelectedProjectId(id);
    setSelectedBranch("main");
    setRunning(false);
    setLogIndex(0);
    setTestPct(0);
  };

  const runSuite = () => {
    if (running) return;
    setRunning(true);
    setLogIndex(0);
    setTestPct(0);

    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx++;
      setLogIndex(idx);
      setTestPct(Math.round((idx / mockTestLogs.length) * 100));
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
      if (idx >= mockTestLogs.length) {
        clearInterval(intervalRef.current!);
        setRunning(false);
        setTestPct(100);
      }
    }, 180);
  };

  const metrics = [
    { label: "Requests/sec", value: "1,240" },
    { label: "Avg response", value: "142ms" },
    { label: "Error rate", value: "0.8%" },
    { label: "Warnings", value: "2" },
  ];

  return (
    <div className="p-10 h-full overflow-y-auto animate-fadeUp">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Test & Audit</h1>
          <p className="text-sm text-[#7A7567] mt-1">Run diagnostics and security checks</p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Project selector */}
          <StyledSelect
            value={selectedProjectId}
            onChange={handleProjectChange}
            disabled={running}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </StyledSelect>

          {/* Branch selector — only when project has a GitHub URL */}
          {hasGithub && (
            <StyledSelect
              value={selectedBranch}
              onChange={setSelectedBranch}
              disabled={running}
            >
              {mockBranches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </StyledSelect>
          )}

          <button
            onClick={runSuite}
            disabled={running || !selectedProjectId}
            className={`btn-ghost-light ${running || !selectedProjectId ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {running ? "Running..." : "Run Test"}
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {metrics.map((m) => (
          <div key={m.label} className="bg-ink rounded-xl p-5">
            <div className="text-[11px] uppercase tracking-widest text-white/35 mb-3">{m.label}</div>
            <div className="text-[26px] font-bold text-white leading-none tracking-tight">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {testPct > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-[11px] text-ink/50 mb-1.5">
            <span>
              {selectedProject?.name}
              {hasGithub && <span className="text-ink/35 font-mono"> · {selectedBranch}</span>}
            </span>
            <span>{testPct}%</span>
          </div>
          <div className="h-0.5 bg-black/12 rounded-sm overflow-hidden">
            <div
              className="h-full bg-ink rounded-sm transition-all duration-300"
              style={{ width: `${testPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1fr 240px" }}>
        {/* Terminal output */}
        <div className="bg-ink rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.07] flex items-center gap-2.5">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${running ? "animate-pulse bg-yellow-300/80" : "bg-white/20"}`} />
            <span className="text-[12px] text-white/50">
              Output
              {selectedProject && (
                <>
                  <span className="text-white/25"> · {selectedProject.name}</span>
                  {hasGithub && (
                    <span className="text-white/20 font-mono"> ({selectedBranch})</span>
                  )}
                </>
              )}
            </span>
          </div>
          <div
            ref={logContainerRef}
            className="h-[280px] overflow-y-auto p-4 font-mono text-[11px] dark-scroll"
          >
            {visibleLogs.length === 0 && (
              <span className="text-white/25">Select a project and run the suite...</span>
            )}
            {visibleLogs.map((log, i) => (
              <div key={i} className="flex gap-3 mb-1 animate-fadeUpFast">
                <span className="text-white/22 w-5 text-right flex-shrink-0 select-none">{i + 1}</span>
                <span className={`w-8 flex-shrink-0 ${logTypeColor[log.type as LogType]}`}>
                  {log.type}
                </span>
                <span className="text-white/70">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* OWASP checks */}
        <div className="bg-ink rounded-xl p-5">
          <div className="text-[11px] text-white/40 uppercase tracking-widest mb-4">OWASP Checks</div>
          <div className="flex flex-col gap-3">
            {owaspChecks.map((check) => (
              <div key={check.label} className="flex items-center justify-between">
                <span className="text-[13px] text-white/60">{check.label}</span>
                <span className={`text-[12px] font-mono ${check.status === "pass" ? "text-green-400/80" : "text-yellow-300/80"}`}>
                  {check.status === "pass" ? "pass" : "warn"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
