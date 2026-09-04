import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <h1 className="navbar-title">Social</h1>
        <div className="navbar-right">
          <span className="navbar-username">Hi, {user?.name}</span>
          <div className="navbar-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <button className="navbar-logout" onClick={logout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
