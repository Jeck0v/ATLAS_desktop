import { useStore } from "../../store";
import { mockDeployments } from "../../data/mock";
import { StatusDot } from "../ui/StatusDot";
import { EnvPill } from "../ui/EnvPill";
export function Dashboard() {
  const { navigate } = useStore();

  const total = mockDeployments.length;
  const local = mockDeployments.filter((d) => [...d.env].includes("local")).length;
  const dev = mockDeployments.filter((d) => [...d.env].includes("dev")).length;
  const production = mockDeployments.filter((d) => [...d.env].includes("production")).length;
  const success = mockDeployments.filter((d) => d.status === "success").length;
  const successRate = Math.round((success / total) * 100);

  return (
    <div className="p-10 h-full overflow-y-auto animate-fadeUp">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#7A7567] mt-1">Overview of your deployments and services</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        {/* Total Deployments */}
        <div className="bg-ink rounded-xl p-6">
          <div className="text-[13px] text-white/50 mb-3.5">Total Deployments</div>
          <div className="text-[36px] font-bold text-white leading-none tracking-tight">{total}</div>
          <div className="mt-3.5 flex gap-4 text-[13px] text-white/40">
            <span>Local · {local}</span>
            <span>Dev · {dev}</span>
            <span>Prod · {production}</span>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-ink rounded-xl p-6">
          <div className="text-[13px] text-white/50 mb-3.5">Success Rate</div>
          <div className="text-[36px] font-bold text-white leading-none tracking-tight">{successRate}%</div>
          <div className="mt-3.5 text-[13px] text-white/40">
            {success} of {total} successful
          </div>
        </div>

        {/* AVG Load */}
        <div className="bg-ink rounded-xl p-6">
          <div className="text-[13px] text-white/50 mb-3.5">AVG Load</div>
          <div className="text-[36px] font-bold text-white leading-none tracking-tight">200/sec</div>
          <div className="mt-3.5 text-[13px] text-white/40">across all services</div>
        </div>
      </div>

      {/* Deployments table */}
      <div className="bg-ink rounded-xl overflow-hidden">
        {/* Card header */}
        <div className="px-6 py-5 border-b border-white/[0.07]">
          <span className="text-sm text-white">Last Deployments</span>
        </div>

        {/* Column headers */}
        <div className="grid px-6 py-3 border-b border-white/[0.04]"
          style={{ gridTemplateColumns: "1fr 180px 110px 90px 110px 90px" }}>
          {["Project", "Environments", "Version", "Duration", "Status", "When"].map((col) => (
            <span key={col} className="text-[11px] uppercase tracking-widest text-white/30">{col}</span>
          ))}
        </div>

        {/* Rows */}
        {mockDeployments.map((d, i) => (
          <div
            key={i}
            className="grid px-6 py-3.5 hover:bg-white/[0.03] cursor-pointer transition-colors border-t border-white/[0.04]"
            style={{ gridTemplateColumns: "1fr 180px 110px 90px 110px 90px" }}
            onClick={() => navigate("projects", d.id)}
          >
            <span className="text-sm text-white">{d.project}</span>
            <div className="flex gap-1 items-center flex-wrap">
              {d.env.map((e) => (
                <EnvPill key={e} env={e} />
              ))}
            </div>
            <span className="font-mono text-sm text-white/40">v{d.version}</span>
            <span className="font-mono text-sm text-white/40">{d.duration}</span>
            <div className="flex items-center gap-2">
              <StatusDot status={d.status} />
              <span className="text-sm text-white/60 capitalize">{d.status}</span>
            </div>
            <span className="text-sm text-white/35">{d.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
