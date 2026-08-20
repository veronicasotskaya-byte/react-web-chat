import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout as logoutApi } from "../api/authApi";
import { logout as clearAuth } from "../features/auth/authSlice";

type DashboardLayoutProps = {
  children: ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleLogout() {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }

    dispatch(clearAuth());
    navigate("/signin");
  }

  const navigation = [
    { name: "Dashboard", to: "/dashboard" },
    { name: "Bots", to: "/bots" },
    { name: "Agents", to: "/agents" },
    { name: "Widgets", to: "/widgets" },
    { name: "Chats", to: "/chats" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - desktop */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Bot Builder
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                ].join(" ")
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className={[
              "w-full",
              "rounded-lg",
              "px-3",
              "py-2.5",
              "text-left",
              "text-sm",
              "font-medium",
              "text-gray-700",
              "transition-colors",
              "hover:bg-gray-100",
              "hover:text-gray-900",
            ].join(" ")}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile navigation */}
      <header className="border-b border-gray-200 bg-white md:hidden">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-lg font-bold tracking-tight text-gray-900">
            Bot Builder
          </h1>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>

        {/* Mobile navigation links */}
        <nav className="flex gap-1 overflow-x-auto border-t border-gray-100 px-3 py-2">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                ].join(" ")
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="min-h-screen min-w-0 md:ml-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
