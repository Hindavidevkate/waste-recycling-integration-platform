import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav style={{ padding: "10px", background: "#2e7d32", color: "white", display: "flex", gap: "20px", alignItems: "center" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
        ♻️ Waste Recycling
      </Link>
      <Link to="/register" style={{ color: "white", textDecoration: "none" }}>Register</Link>
      <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
      {user?.role === 'recycler' && (
        <Link to="/recycler" style={{ color: "white", textDecoration: "none", background: "rgba(255,255,255,0.2)", padding: "5px 10px", borderRadius: "5px" }}>
          Recycler Dashboard
        </Link>
      )}
      {user && (
        <>
          <span>Welcome, {user.name} ({user.role})</span>
          <button onClick={handleLogout} style={{ marginLeft: "auto", cursor: "pointer" }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;