import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/DashboardLayout.css";
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
      // Clear authentication state and redirect to login page
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }

    dispatch(clearAuth());
    navigate("/signin");
  }

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>Bot Builder</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/bots">Bots</Link>
          <Link to="/agents">Agents</Link>
          <Link to="/widgets">Widgets</Link>
          <Link to="/chats">Chats</Link>
          <button style={{ marginTop: "520px" }} onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      <div className="content">{children}</div>
    </div>
  );
}

export default DashboardLayout;
