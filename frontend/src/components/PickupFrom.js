import { useState } from "react";

function PickupForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    wasteType: "",
    date: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/pickups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log(data);
    alert("Pickup Request Submitted!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="address" placeholder="Address" onChange={handleChange} required />
      <input name="wasteType" placeholder="Waste Type" onChange={handleChange} required />
      <input type="date" name="date" onChange={handleChange} required />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PickupForm;
