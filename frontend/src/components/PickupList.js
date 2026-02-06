import { useEffect, useState } from "react";

function PickupList() {
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/pickups")
      .then(res => res.json())
      .then(data => setPickups(data));
  }, []);

  return (
    <div>
      <h2>All Pickup Requests</h2>
      {pickups.map(p => (
        <div key={p._id}>
          <p>{p.name} - {p.wasteType} - {p.status}</p>
        </div>
      ))}
    </div>
  );
}

export default PickupList;
