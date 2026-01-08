import { useEffect, useState } from "react";
import { Page } from "./types";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Revenue from "./components/Revenue";
import Customers from "./components/Customers";
import Settings from "./components/Settings";
import { getSettings, SettingsDTO } from "./api/settings";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [settings, setSettings] = useState<SettingsDTO | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await getSettings();
        setSettings(s);
      } catch {
        // ignore
      }
    })();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "orders":
        return <Orders />;
      case "revenue":
        return <Revenue />;
      case "customers":
        return <Customers />;
      case "settings":
        // optional: after saving settings, you can refresh sidebar branding
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        branding={settings?.branding}
      />
      <div className="flex-1 overflow-y-auto">{renderPage()}</div>
    </div>
  );
}

export default App;
