import { useStore } from "./store";
import { AppWindow } from "./components/layout/AppWindow";
import { Dashboard } from "./components/pages/Dashboard";
import { Projects } from "./components/pages/Projects";
import { Secrets } from "./components/pages/Secrets";
import { Configuration } from "./components/pages/Configuration";
import { Testing } from "./components/pages/Testing";
import { Settings } from "./components/pages/Settings";
import { DslEditor } from "./components/pages/DslEditor";
import { NewProject } from "./components/pages/NewProject";

function PageRouter() {
  const { page } = useStore();

  switch (page) {
    case "dashboard":    return <Dashboard />;
    case "projects":     return <Projects />;
    case "secrets":      return <Secrets />;
    case "config":       return <Configuration />;
    case "testing":      return <Testing />;
    case "settings":     return <Settings />;
    case "dsl-editor":   return <DslEditor />;
    case "new-project":  return <NewProject />;
    default:             return <Dashboard />;
  }
}

function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent">
      <AppWindow>
        <PageRouter />
      </AppWindow>
    </div>
  );
}

export default App;
