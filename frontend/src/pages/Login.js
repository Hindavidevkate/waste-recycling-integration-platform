import React, { useState } from "react";
import API from "../services/api";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === "admin") window.location.href = "/admin";
      else if (role === "producer") window.location.href = "/producer";
      else if (role === "transporter") window.location.href = "/transporter";
      else if (role === "collector") window.location.href = "/kabadiwala";
      else if (role === "recycler" || role === "buyer") window.location.href = "/recycler";
      else window.location.href = "/"; // Fallback
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>Don't have account? <a href="/register">Register</a></p>
    </div>
  );
}



export default Login;