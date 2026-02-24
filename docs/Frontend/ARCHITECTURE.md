# Architecture

See `architecture.mmd` for the layer diagram.

## Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Runtime     | Tauri 2 (Rust)                      |
| Frontend    | React 19 + TypeScript + Vite        |
| Styling     | Tailwind CSS v3 (JIT)               |
| State       | Zustand v5                          |
| Fonts       | Sansation (local TTF), DM Mono (Google Fonts) |
| Package mgr | pnpm                                |

## Directory Structure

```
Atlas-Desktop/
├── src/
│   ├── App.tsx                   Root component and page router
│   ├── store/index.ts            Zustand store (single source of truth)
│   ├── types/index.ts            Shared TypeScript types
│   ├── data/mock.ts              Static mock data
│   ├── components/
│   │   ├── layout/               Window shell
│   │   │   ├── AppWindow.tsx     Outer container (1100x680, 30px radius)
│   │   │   ├── TitleBar.tsx      Custom title bar with traffic lights
│   │   │   └── Sidebar.tsx       Navigation driven by store.page
│   │   ├── ui/                   Reusable presentational atoms
│   │   │   ├── EnvPill.tsx
│   │   │   ├── StatusDot.tsx
│   │   │   ├── Toggle.tsx
│   │   │   ├── MiniSparkline.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ProdDeployModal.tsx
│   │   └── pages/                One component per route
│   └── index.css                 Global styles, font-face, component classes
├── src-tauri/
│   ├── src/lib.rs                Tauri setup and command registration
│   ├── src/main.rs               Binary entry point
│   ├── tauri.conf.json           Window config (no decorations, transparent)
│   └── capabilities/             Tauri permission system
├── tailwind.config.ts            Color tokens, fonts, keyframe animations
└── vite.config.ts                Port 1420 (strict, required by Tauri)
```

## Routing

There is no URL router. Navigation is stored in the Zustand store.
The store holds `page` (PageId union) and `selectedProj` (string or null).
`App.tsx` renders a `PageRouter` switch that maps each PageId to a component.
The `navigate(page, projectId?)` action updates both fields in one call.
`setPage` and `setProject` update each field independently.

Pages that embed sub-views (Projects -> ProjectDetail, Pre-config -> ProjectDetail)
read `selectedProj` directly and render the sub-view inline without changing the top-level page.

## State Management

The Zustand store (`src/store/index.ts`) holds:

| Field                 | Type                    | Purpose                                   |
|-----------------------|-------------------------|-------------------------------------------|
| `page`                | PageId                  | Active route                              |
| `selectedProj`        | string or null          | Currently open project                    |
| `projects`            | Project[]               | Full project list; mutated by actions     |
| `settingsProdProvider`| "gcp" or "aws" or null  | Global default cloud provider             |

Actions: `navigate`, `setPage`, `setProject`, `addProject`, `setProjectProdConfig`, `setSettingsProdProvider`.

All state is in-memory. There is no persistence layer in the current version.

## Component Layers

### Layout
AppWindow sets the window dimensions and border radius.
TitleBar manages the drag region and traffic-light window controls via the Tauri Window API.
Sidebar reads `page` from the store and renders navigation buttons.

### UI Atoms
Atoms are stateless or lightly stateful presentational components.
They accept props and emit callbacks; they do not read from the store directly.
Exception: ProdDeployModal reads `settingsProdProvider` and calls `setProjectProdConfig` via the store.

### Pages
Each page is self-contained. Pages read from the store and from mock data.
Props are not passed down more than one level; shared state uses the store.

## Tauri Integration

The window is frameless (`decorations: false`, `transparent: true`).
Dragging is handled by `getCurrentWindow().startDragging()` on TitleBar `mousedown`.
Traffic-light buttons call `win.close()`, `win.minimize()`, and `win.toggleMaximize()`.
Capabilities are declared in `src-tauri/capabilities/default.json`.
The frontend calls Rust via `invoke()` from `@tauri-apps/api/core` (no custom commands yet).

## Styling System

Custom Tailwind color tokens:

| Token    | Hex      | Use                          |
|----------|----------|------------------------------|
| cream    | #EFEBCE  | Main canvas background       |
| ink      | #191716  | Sidebar, cards, dark surfaces|
| inkHov   | #262321  | Hover state on dark surfaces |
| inkMid   | #211F1D  | Active/selected card state   |

Global component classes defined in `index.css`:
- `btn-ghost-light` — outlined button for light (cream) surfaces.
- `btn-ghost-dark` — outlined button for dark (ink) surfaces.
- `btn-dark` — solid dark button.
- `input-dark` — text input for dark surfaces.

Page entry animation: `animate-fadeUp` (opacity 0 -> 1, translateY 5px -> 0, 220ms).
