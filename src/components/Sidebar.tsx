import { LayoutDashboard, ShoppingBag, DollarSign, Users, Settings } from "lucide-react";
import { Page } from "../types";

type Branding = {
  app_name?: string;
  tagline?: string;
  logo_url?: string;
};

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  branding?: Branding; // ✅ new
}

export default function Sidebar({ currentPage, onNavigate, branding }: SidebarProps) {
  const menuItems = [
    { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
    { id: "orders" as Page, label: "Orders", icon: ShoppingBag },
    { id: "revenue" as Page, label: "Revenue", icon: DollarSign },
    { id: "customers" as Page, label: "Customers", icon: Users },
    { id: "settings" as Page, label: "Settings", icon: Settings },
  ];

  const appName = branding?.app_name || "Savory Bites";
  const tagline = branding?.tagline || "Catering Manager";
  const logoUrl = branding?.logo_url || "";

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
              onError={(e) => {
                // fallback if image fails
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">{appName}</h1>
            <p className="text-xs text-gray-500 truncate">{tagline}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-1">Need Help?</p>
          <p className="text-xs text-gray-600 mb-3">Contact support for assistance</p>
          <button className="w-full bg-white text-orange-600 text-sm font-medium py-2 rounded-md hover:bg-gray-50 transition-colors">
            Get Support
          </button>
        </div>
      </div>
    </div>
  );
}
