import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  
  return (
    <div>
      <h1>Waste Recycling Integration Platform ♻️</h1>
      <p>A smart platform to collect, recycle, and manage waste efficiently.</p>
      <button onClick={() => navigate("/register")}>Get Started</button>
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
}

export default Home;