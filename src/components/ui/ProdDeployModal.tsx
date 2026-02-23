import { useState } from "react";
import type { ProdConfig } from "../../types";

interface ProdDeployModalProps {
  defaultProvider: "gcp" | "aws";
  onConfirm: (config: ProdConfig) => void;
  onCancel: () => void;
}

function ProviderCard({
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

export function ProdDeployModal({ defaultProvider, onConfirm, onCancel }: ProdDeployModalProps) {
  const [provider, setProvider] = useState<"gcp" | "aws">(defaultProvider);
  const [gcpProjectId, setGcpProjectId] = useState("");
  const [gcpRegion, setGcpRegion] = useState("europe-west1");
  const [awsRegion, setAwsRegion] = useState("us-east-1");
  const [awsCluster, setAwsCluster] = useState("");

  const canConfirm =
    provider === "gcp"
      ? gcpProjectId.trim().length > 0
      : awsRegion.trim().length > 0 && awsCluster.trim().length > 0;

  const handleConfirm = () => {
    const config: ProdConfig =
      provider === "gcp"
        ? { provider: "gcp", gcpProjectId: gcpProjectId.trim(), gcpRegion: gcpRegion.trim() }
        : { provider: "aws", awsRegion: awsRegion.trim(), awsCluster: awsCluster.trim() };
    onConfirm(config);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Card */}
      <div className="relative bg-ink border border-white/[0.10] rounded-2xl p-7 w-[480px] shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="mb-6">
          <p className="text-base font-bold text-white">Connect to production</p>
          <p className="text-[13px] text-white/45 mt-1 leading-relaxed">
            First deployment — configure your cloud provider for this project.
          </p>
        </div>

        {/* Provider choice */}
        <p className="text-[11px] uppercase tracking-widest text-white/35 mb-3">
          Cloud provider
        </p>
        <div className="flex gap-2.5 mb-5">
          <ProviderCard
            label="Google Cloud"
            description="GKE / Cloud Run — deploy on Google infrastructure."
            selected={provider === "gcp"}
            onSelect={() => setProvider("gcp")}
          />
          <ProviderCard
            label="Amazon AWS"
            description="EKS / ECS — deploy on Amazon infrastructure."
            selected={provider === "aws"}
            onSelect={() => setProvider("aws")}
          />
        </div>

        {/* Provider fields */}
        {provider === "gcp" && (
          <div className="grid grid-cols-2 gap-3 mb-6 animate-fadeUp">
            <div>
              <label className="text-[11px] text-white/35 uppercase tracking-widest mb-1.5 block">
                Project ID
              </label>
              <input
                value={gcpProjectId}
                onChange={(e) => setGcpProjectId(e.target.value)}
                placeholder="my-gcp-project"
                className="input-dark text-[13px]"
                autoFocus
              />
            </div>
            <div>
              <label className="text-[11px] text-white/35 uppercase tracking-widest mb-1.5 block">
                Region
              </label>
              <input
                value={gcpRegion}
                onChange={(e) => setGcpRegion(e.target.value)}
                placeholder="europe-west1"
                className="input-dark text-[13px]"
              />
            </div>
          </div>
        )}

        {provider === "aws" && (
          <div className="grid grid-cols-2 gap-3 mb-6 animate-fadeUp">
            <div>
              <label className="text-[11px] text-white/35 uppercase tracking-widest mb-1.5 block">
                Region
              </label>
              <input
                value={awsRegion}
                onChange={(e) => setAwsRegion(e.target.value)}
                placeholder="us-east-1"
                className="input-dark text-[13px]"
                autoFocus
              />
            </div>
            <div>
              <label className="text-[11px] text-white/35 uppercase tracking-widest mb-1.5 block">
                Cluster name
              </label>
              <input
                value={awsCluster}
                onChange={(e) => setAwsCluster(e.target.value)}
                placeholder="atlas-cluster"
                className="input-dark text-[13px]"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2.5">
          <button onClick={onCancel} className="btn-ghost-dark text-[13px]">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`btn-dark text-[13px] ${!canConfirm ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            Connect &amp; Deploy
          </button>
        </div>
      </div>
    </div>
  );
}
