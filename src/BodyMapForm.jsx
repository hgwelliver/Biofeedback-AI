import React, { useState } from "react";
import MeridianBodyMap from "./MeridianBodyMap";

function BodyMapForm({ onSubmit }) {
  const [region, setRegion] = useState("");
  const [sensations, setSensations] = useState([]);
  const [energy, setEnergy] = useState("");
  const [context, setContext] = useState("");

  const toggleSensation = (s) => {
    setSensations((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ region, sensations, energy, context });
  };

  return (
    <form onSubmit={handleSubmit}>
      <MeridianBodyMap value={region} onChange={setRegion} showMeridians />

      <h2>What are your symptoms?</h2>
      {["Tight", "Sore", "Buzzing", "Numb", "Warm", "Cold", "Stiff", "Achy"].map((s) => (
        <label key={s} style={{ display: "inline-block", marginRight: 10 }}>
          <input
            type="checkbox"
            checked={sensations.includes(s)}
            onChange={() => toggleSensation(s)}
          />
          {s}
        </label>
      ))}

    <div id="dropdowngroup">
      <h2>General Body Energy Level</h2>
      <select value={energy} onChange={(e) => setEnergy(e.target.value)}>
        <option value="">Select...</option>
        <option value="Energized">Energized</option>
        <option value="Tired">Tired</option>
        <option value="Both">Both</option>
      </select>

      <button type="submit" style={{ marginTop: 12 }}>
        Reflect
      </button>
      </div>
    </form>
  );
}

export default BodyMapForm;




// import React, { useState } from "react";

// function BodyMapForm({ onSubmit }) {
//   const [sensations, setSensations] = useState([]);
//   const [energy, setEnergy] = useState("");
//   const [context, setContext] = useState("");

//   const bodyOptions = [
//     "Tight Jaw",
//     "Heavy Chest",
//     "Buzzing Limbs",
//     "Shallow Breath",
//     "Sinking Stomach",
//   ];

//   const handleCheckboxChange = (e) => {
//     const value = e.target.value;
//     if (sensations.includes(value)) {
//       setSensations(sensations.filter((s) => s !== value));
//     } else {
//       setSensations([...sensations, value]);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit({ sensations, energy, context });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Select Body Sensations:</h2>
//       {bodyOptions.map((option) => (
//         <label key={option} style={{ display: "block", margin: "4px 0" }}>
//           <input
//             type="checkbox"
//             value={option}
//             checked={sensations.includes(option)}
//             onChange={handleCheckboxChange}
//           />
//           {option}
//         </label>
//       ))}

//       <h2>Energy Level:</h2>
//       <select value={energy} onChange={(e) => setEnergy(e.target.value)}>
//         <option value="">Select...</option>
//         <option value="Wired">Wired / Agitated</option>
//         <option value="Heavy">Heavy / Collapsed</option>
//         <option value="Mixed">Mixed</option>
//       </select>

//       <h2>Context:</h2>
//       <select value={context} onChange={(e) => setContext(e.target.value)}>
//         <option value="">Select...</option>
//         <option value="Social">Social</option>
//         <option value="Alone">Alone</option>
//         <option value="Creative Work">Creative Work</option>
//         <option value="Before Sleep">Before Sleep</option>
//       </select>

//       <button type="submit" style={{ marginTop: "10px" }}>Interpret</button>
//     </form>
//   );
// }

// export default BodyMapForm;
