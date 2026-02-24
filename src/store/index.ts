import { create } from "zustand";
import type { PageId, Project, ProdConfig } from "../types";
import { mockProjects } from "../data/mock";

interface AppStore {
  page: PageId;
  selectedProj: string | null;
  projects: Project[];
  settingsProdProvider: "gcp" | "aws" | null;
  addProject: (p: Project) => void;
  setPage: (p: PageId) => void;
  setProject: (id: string | null) => void;
  navigate: (page: PageId, projectId?: string | null) => void;
  setSettingsProdProvider: (p: "gcp" | "aws" | null) => void;
  setProjectProdConfig: (projectId: string, config: ProdConfig) => void;
}

export const useStore = create<AppStore>((set) => ({
  page: "dashboard",
  selectedProj: null,
  projects: mockProjects,
  settingsProdProvider: null,
  addProject: (p) => set((state) => ({ projects: [...state.projects, p] })),
  setPage: (p) => set({ page: p }),
  setProject: (id) => set({ selectedProj: id }),
  navigate: (page, projectId) =>
    set({ page, selectedProj: projectId !== undefined ? projectId : null }),
  setSettingsProdProvider: (p) => set({ settingsProdProvider: p }),
  setProjectProdConfig: (projectId, config) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, prodConfig: config } : p
      ),
    })),
}));
