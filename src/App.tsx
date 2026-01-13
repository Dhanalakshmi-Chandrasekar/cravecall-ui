import { useEffect, useState } from "react";
import { Page } from "./types";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Revenue from "./components/Revenue";
import Customers from "./components/Customers";
import Settings from "./components/Settings";
import { getSettings, SettingsDTO } from "./api/settings";

import Login from "./pages/Login";      // <- adjust path if different
import Register from "./pages/Register"; // <- adjust path if different
import { useAuth } from "./context/AuthContext"; // <- your AuthContext

export default function App() {
  const { user, token, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [settings, setSettings] = useState<SettingsDTO | null>(null);

  // ✅ ONLY fetch settings after login (prevents crashes in components expecting auth)
  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const s = await getSettings();
        setSettings(s);
      } catch {
        // ignore
      }
    })();
  }, [token]);

  // ✅ Loading screen while restoring auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  // ✅ If not logged in, show auth pages
  if (!token || !user) {
    return showRegister ? (
      <Register onToggleLogin={() => setShowRegister(false)} />
    ) : (
      <Login onToggleRegister={() => setShowRegister(true)} />
    );
  }

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
        user={user} 

      />
      <div className="flex-1 overflow-y-auto">{renderPage()}</div>
    </div>
  );
}
