export type DeployStatus = "success" | "failed" | "running" | "idle";
export type Environment = "production" | "dev" | "local" | "all";

export interface Deployment {
  version: string;
  status: DeployStatus;
  time: string;
  duration: string;
}

export interface ProdConfig {
  provider: "gcp" | "aws";
  gcpProjectId?: string;
  gcpRegion?: string;
  awsRegion?: string;
  awsCluster?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  env: Environment[];
  lastDeploy: Deployment;
  services: number;
  secretIds: number[];
  type: "preconfigured" | "custom";
  githubUrl?: string;
  prodConfig?: ProdConfig;
}

export interface Secret {
  id: number;
  key: string;
  env: Environment;
  updated: string;
  projectIds: string[];
}

export interface Block {
  id: string;
  label: string;
  category: string;
  enabled: boolean;
}

export type PageId =
  | "dashboard"
  | "projects"
  | "secrets"
  | "config"
  | "testing"
  | "settings"
  | "dsl-editor"
  | "new-project";
