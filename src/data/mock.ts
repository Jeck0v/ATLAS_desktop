import type { Project, Secret, Block } from "../types";

export const mockProjects: Project[] = [
  {
    id: "atlas-api",
    name: "Atlas API",
    description: "Core REST API service handling authentication, routing and business logic for the Atlas platform.",
    env: ["production", "dev", "local"],
    lastDeploy: { version: "2.4.1", status: "success", time: "2h ago", duration: "1m 12s" },
    services: 5,
    secretIds: [1, 2, 3],
    type: "custom",
    githubUrl: "https://github.com/org/atlas-api",
    prodConfig: { provider: "gcp", gcpProjectId: "atlas-prod", gcpRegion: "europe-west1" },
  },
  {
    id: "atlas-worker",
    name: "Atlas Worker",
    description: "Background job processor for async tasks including email dispatch, report generation and data sync.",
    env: ["production", "dev"],
    lastDeploy: { version: "1.9.3", status: "running", time: "15m ago", duration: "2m 04s" },
    services: 3,
    secretIds: [2, 4],
    type: "custom",
    githubUrl: "https://github.com/org/atlas-worker",
    prodConfig: { provider: "gcp", gcpProjectId: "atlas-prod", gcpRegion: "europe-west1" },
  },
  {
    id: "atlas-gateway",
    name: "API Gateway",
    description: "Edge service managing rate limiting, caching, and traffic routing across all Atlas microservices.",
    env: ["production"],
    lastDeploy: { version: "3.1.0", status: "success", time: "1d ago", duration: "45s" },
    services: 2,
    secretIds: [1, 5],
    type: "preconfigured",
    prodConfig: { provider: "gcp", gcpProjectId: "atlas-prod", gcpRegion: "europe-west1" },
  },
  {
    id: "atlas-monitor",
    name: "Monitor",
    description: "Observability stack collecting metrics, logs, and traces with alerting rules and dashboard integration.",
    env: ["dev", "local"],
    lastDeploy: { version: "0.8.7", status: "failed", time: "3h ago", duration: "3m 22s" },
    services: 4,
    secretIds: [3, 4, 5],
    type: "preconfigured",
  },
];

export const mockSecrets: Secret[] = [
  { id: 1, key: "DATABASE_URL", env: "production", updated: "3d ago", projectIds: ["atlas-api", "atlas-gateway"] },
  { id: 2, key: "JWT_SECRET", env: "production", updated: "1w ago", projectIds: ["atlas-api", "atlas-worker"] },
  { id: 3, key: "SMTP_HOST", env: "dev", updated: "2d ago", projectIds: ["atlas-api", "atlas-monitor"] },
  { id: 4, key: "REDIS_URL", env: "dev", updated: "5d ago", projectIds: ["atlas-worker", "atlas-monitor"] },
  { id: 5, key: "SENTRY_DSN", env: "production", updated: "2w ago", projectIds: ["atlas-gateway", "atlas-monitor"] },
  { id: 6, key: "S3_BUCKET", env: "local", updated: "1d ago", projectIds: ["atlas-api"] },
];

export const mockBlocks: Block[] = [
  { id: "postgres", label: "PostgreSQL", category: "database", enabled: true },
  { id: "redis", label: "Redis Cache", category: "cache", enabled: true },
  { id: "nginx", label: "Nginx", category: "proxy", enabled: true },
  { id: "prometheus", label: "Prometheus", category: "monitoring", enabled: false },
  { id: "grafana", label: "Grafana", category: "monitoring", enabled: false },
  { id: "minio", label: "MinIO", category: "storage", enabled: true },
  { id: "elasticsearch", label: "Elasticsearch", category: "search", enabled: false },
  { id: "kafka", label: "Kafka", category: "messaging", enabled: false },
  { id: "traefik", label: "Traefik", category: "proxy", enabled: false },
  { id: "certbot", label: "Certbot", category: "ssl", enabled: true },
];

export const mockDeployments = [
  { id: "atlas-api", project: "Atlas API", env: ["production", "dev"] as const, version: "2.4.1", duration: "1m 12s", status: "success" as const, when: "2h ago" },
  { id: "atlas-worker", project: "Atlas Worker", env: ["production"] as const, version: "1.9.3", duration: "2m 04s", status: "running" as const, when: "15m ago" },
  { id: "atlas-gateway", project: "API Gateway", env: ["production"] as const, version: "3.1.0", duration: "45s", status: "success" as const, when: "1d ago" },
  { id: "atlas-monitor", project: "Monitor", env: ["dev"] as const, version: "0.8.7", duration: "3m 22s", status: "failed" as const, when: "3h ago" },
  { id: "atlas-api", project: "Atlas API", env: ["local"] as const, version: "2.4.0", duration: "58s", status: "success" as const, when: "1d ago" },
];

export const mockTestLogs = [
  { type: "info" as const, msg: "Initializing test suite..." },
  { type: "ok" as const, msg: "Database connection: established" },
  { type: "ok" as const, msg: "JWT validation: passed" },
  { type: "ok" as const, msg: "API endpoints: 12/12 responding" },
  { type: "warn" as const, msg: "Response time P95 > 200ms on /api/reports" },
  { type: "ok" as const, msg: "Auth middleware: all guards active" },
  { type: "ok" as const, msg: "Rate limiting: 1000req/min enforced" },
  { type: "info" as const, msg: "Running OWASP security checks..." },
  { type: "ok" as const, msg: "SQL injection: no vulnerabilities found" },
  { type: "ok" as const, msg: "XSS protection: headers present" },
  { type: "warn" as const, msg: "CORS policy: 2 origins overly permissive" },
  { type: "ok" as const, msg: "CSRF tokens: validated" },
  { type: "err" as const, msg: "TLS version: TLS 1.1 still enabled on gateway" },
  { type: "ok" as const, msg: "Secrets scanning: no exposed keys" },
  { type: "info" as const, msg: "Suite complete — 2 warnings, 1 error" },
];
