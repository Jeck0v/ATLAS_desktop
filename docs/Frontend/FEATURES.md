# Features

See `features.mmd` for the navigation and relation diagram.

## Dashboard

Shows an overview of all deployments across projects.
Three stat cards display total deployments, success rate, and average load.
The deployments table lists the last entries with project, environments, version, duration, status, and time.
Clicking a table row navigates to the corresponding project detail.

## Projects

Lists all custom projects in a two-column card grid.
Each card shows name, last deploy status, environment tags, service count, secret count, and version.
Clicking a card opens the project detail view.
The Deploy button on a card triggers a deploy without opening the detail.
The New project button starts the creation flow.

## Project Detail

Displays full project info: name, description, type badge, and GitHub URL when set.
Environment pills let the user select the deploy target.
A branch selector appears for GitHub-linked projects.
The Deploy button triggers a deploy for the selected environment.
On the first production deploy, the production config modal opens.
The Edit deployment button opens the DSL editor for this project.
The right column shows linked secrets with a reveal toggle, quick stats, and deployment history.

## New Project

A two-step creation flow for custom projects.
Step 1 collects name and description.
Step 2 links a GitHub repository and branch.
The user can skip GitHub and configure it later.
On finish the project is added to the store and the DSL editor opens.

## Pre-config

Manages pre-configured projects: stacks assembled from block toggles rather than a hand-written DSL.
The list view shows all preconfigured projects as cards.
The create flow provides a name input, code source selection (GitHub or local folder), and a block toggle grid.
A live DSL preview updates as blocks are toggled.
The Create button saves the project to the store.
Deploying a preconfigured project to production for the first time triggers the production config modal.

## DSL Editor

A code editor for the deployment DSL of a project.
A syntax-highlight overlay colors keywords, identifiers, booleans, strings, and comments.
The textarea is transparent; only the caret is visible, overlaid on the highlight layer.
An environment segmented control (local / dev / production) switches the DSL target.
The right panel shows validation checks and a summary (target, block count, line count).
Saving sets the saved state; a Back to project button then appears.
The Deploy button executes the deploy for the selected environment.

## Secrets

Lists all secrets grouped by project.
Each row shows key name, environment tag, masked value, last updated date, and action buttons.
The reveal button toggles between masked and plain-text display.
The New secret button opens a modal with fields for key, value, environment, and project.
Secrets are linked to projects via the `secretIds` field on each project.

## Test and Audit

Runs a diagnostic suite against a selected project.
A project dropdown selects the target; a branch dropdown appears for GitHub-linked projects.
The Run Test button starts the suite and streams log lines into the terminal output panel.
A progress bar tracks completion percentage.
Four metric cards show requests per second, average response, error rate, and warning count.
The OWASP panel lists six security checks with pass or warn status.

## Settings

### General
Shows app metadata (version, Tauri version, environment).
A segmented control sets the default environment for new projects and secrets.

### Integrations
GitHub card: connect to enable repo linking and webhook deploys.
Slack card: connect to receive deployment notifications in a workspace.

### Deployment
Local: configures the ngrok auth token for tunnel-based local deploys.
Dev: shows Docker Compose as the fixed default for the dev environment.
Production: sets the global default cloud provider (GCP or AWS).

## Production Config Modal

Appears on the first production deploy for any project.
The user picks a cloud provider (GCP or AWS).
The default provider is taken from Settings > Deployment; falls back to GCP when unset.
GCP requires a project ID and a region.
AWS requires a region and a cluster name.
On confirm the config is saved to the project's `prodConfig` field.
Subsequent production deploys for the same project skip the modal.

---

## Feature Relations

Dashboard reads from `mockDeployments` and navigates to project detail on row click.
Projects renders ProjectDetail when a project ID is selected in the store.
Projects navigates to NewProject on the New project button.
NewProject writes to the store via `addProject` and opens DslEditor for the new project.
ProjectDetail uses the project from the store and navigates to DslEditor on Edit.
ProjectDetail opens ProdDeployModal on the first production deploy.
ProdDeployModal reads the default provider from `settingsProdProvider` in the store.
ProdDeployModal writes back via `setProjectProdConfig` on confirm.
Configuration renders ProjectDetail when a preconfigured project ID is selected.
Configuration opens ProdDeployModal on Deploy when no `prodConfig` exists.
DslEditor reads `selectedProj` and `projects` from the store; builds DSL from `mockBlocks`.
Secrets reads `mockSecrets` and `mockProjects`; the modal writes new entries.
Testing reads `projects` from the store and uses `mockTestLogs` for the log stream.
Settings reads and writes `settingsProdProvider` in the store.
