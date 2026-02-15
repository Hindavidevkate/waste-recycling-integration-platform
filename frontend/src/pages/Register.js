import React, { useState } from "react";
import API from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    role: "producer", phone: "", address: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert(`Welcome ${res.data.user.name}!`);
      // Redirect based on role
      const role = res.data.user.role;
      if (role === "admin") window.location.href = "/admin";
      else if (role === "producer") window.location.href = "/producer";
      else if (role === "transporter") window.location.href = "/transporter";
      else if (role === "collector") window.location.href = "/kabadiwala";
      else if (role === "recycler" || role === "buyer") window.location.href = "/recycler";
      else window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <select name="role" onChange={handleChange} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option value="producer">Producer (I have waste)</option>
          <option value="recycler">Buyer / Recycler (I want waste)</option>
          <option value="transporter">Transporter / Collector</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p>Already have account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Register;