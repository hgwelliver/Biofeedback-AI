import React, { useState } from "react";
import MeridianBodyMap from "./MeridianBodyMap";
import SparkleIcon from "./SparkleIcon";

const COMMON_REGIONS = [
  { label: "Head & face", region: "head", icon: "head", tone: "lavender" },
  { label: "Neck & shoulders", region: "shoulder_left", icon: "shoulders", tone: "sage" },
  { label: "Chest", region: "heart", icon: "chest", tone: "rose" },
  { label: "Back", region: "spine", icon: "back", tone: "blue" },
  { label: "Stomach & core", region: "stomach", icon: "core", tone: "gold" },
  { label: "Hips & pelvis", region: "pelvis", icon: "hips", tone: "violet" },
];

const SYMPTOM_GROUPS = [
  {
    label: "Pain & tension",
    symptoms: ["Tight", "Sore", "Stiff", "Achy", "Cramping", "Tender", "Crunchy"],
  },
  {
    label: "Nerve sensations",
    symptoms: ["Buzzing", "Numb", "Tingling", "Burning", "Radiating"],
  },
  {
    label: "Temperature & skin",
    symptoms: ["Warm", "Cold", "Itchy", "Sensitive", "Flushed", "Chilled"],
  },
  {
    label: "Body state",
    symptoms: ["Swollen", "Congested", "Bloated", "Spacious"],
  },
];

const LOCATION_OPTIONS = [
  "Surface",
  "Muscle",
  "Joint",
  "Deep tissue",
  "Inside",
  "Outside",
  "Unsure",
];

const REGION_GUIDANCE = {
  head: "Ease facial and scalp tension with slow breathing and gentle awareness.",
  shoulder_left: "Invite space through the neck and shoulders with relaxed, easy movement.",
  heart: "Notice your breath and soften tension across the chest without forcing it.",
  spine: "Support your back with comfortable posture shifts and unhurried movement.",
  stomach: "Settle your core with a soft belly and steady, low-effort breathing.",
  pelvis: "Release holding around the hips and pelvis with gentle, supported motion.",
  hand_left: "Relax the arms and hands with light movement and an easy grip.",
  quadricep_left: "Release tension in your legs with gentle, guided muscle relaxation.",
};

const formatRegion = (region) =>
  region
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

function RegionIcon({ type }) {
  const paths = {
    head: (
      <path d="M12.1 2.2A6.2 6.2 0 0 0 5.9 8.4v2.3c0 2.5 1.4 4.7 3.5 5.7v2.1H7.8c-2.7 0-4.8 1.4-5.5 3.3h19.4c-.7-1.9-2.8-3.3-5.5-3.3h-1.6v-2.1a6.3 6.3 0 0 0 3.5-5.7V8.4a6.1 6.1 0 0 0-6-6.2Z" />
    ),
    shoulders: (
      <>
        <circle cx="12" cy="6.2" r="4.1" />
        <path d="M9.3 10.2v2.4C5 13.1 1.8 16.7 1.8 21.2h20.4c0-4.5-3.2-8.1-7.5-8.6v-2.4Z" />
      </>
    ),
    chest: (
      <>
        <path d="M7.4 2.5 3.7 5.8l1.5 5.5L6.5 22h11l1.3-10.7 1.5-5.5-3.7-3.3c-1.2 1-2.8 1.6-4.6 1.6S8.6 3.5 7.4 2.5Z" />
        <path className="icon-cutout" d="M12 15.8s-3.1-1.9-3.1-4.1a1.9 1.9 0 0 1 3.1-1.4 1.9 1.9 0 0 1 3.1 1.4c0 2.2-3.1 4.1-3.1 4.1Z" />
      </>
    ),
    back: (
      <>
        <path d="M7.4 2.5 3.7 5.8l1.5 5.5L6.5 22h11l1.3-10.7 1.5-5.5-3.7-3.3c-1.2 1-2.8 1.6-4.6 1.6S8.6 3.5 7.4 2.5Z" />
        <path className="icon-detail" d="M12 5.8v12.8" />
      </>
    ),
    core: (
      <>
        <path d="M7.4 2.5 3.7 5.8l1.5 5.5L6.5 22h11l1.3-10.7 1.5-5.5-3.7-3.3c-1.2 1-2.8 1.6-4.6 1.6S8.6 3.5 7.4 2.5Z" />
        <path className="icon-detail" d="M8.5 8.2h7M8.1 12.2h7.8M8.5 16.2h7M12 6.6v11.2" />
      </>
    ),
    hips: (
      <path d="M5 3.2v6.2c0 2.8-1.3 4.6-2.4 6.3L6.1 22h4.1l1.8-5.2 1.8 5.2h4.1l3.5-6.3C20.3 14 19 12.2 19 9.4V3.2c-2 1.2-4.3 1.8-7 1.8s-5-.6-7-1.8Z" />
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

function BodyMapForm({ onSubmit }) {
  const [region, setRegion] = useState("");
  const [sensations, setSensations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [intensity, setIntensity] = useState(5);
  const [energy, setEnergy] = useState("");
  const [context] = useState("");

  const toggleSensation = (s) => {
    setSensations((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const toggleLocation = (location) => {
    setLocations((previous) =>
      previous.includes(location)
        ? previous.filter((item) => item !== location)
        : [...previous, location]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ region, sensations, locations, intensity, energy, context });
  };

  const selectedCommonRegion = COMMON_REGIONS.find(
    (item) => item.region === region
  );
  const selectedRegionName = selectedCommonRegion?.label || formatRegion(region);
  const selectedGuidance =
    REGION_GUIDANCE[region] ||
    "Bring gentle attention to this area and notice changes without judgment.";

  return (
    <form onSubmit={handleSubmit}>
      <div className="body-map-panel">
        <MeridianBodyMap value={region} onChange={setRegion} showMeridians />

        <div className="region-sidebar">
          <div className="se-pill">
            <SparkleIcon className="se-pill-icon" />
            <span className="se-pill-label">
              {region ? selectedRegionName : "No region selected"}
            </span>
          </div>

          <section className="common-regions-card">
            <div className="section-heading-row">
              <h2>Common regions</h2>
              <span>Explore</span>
            </div>
            <div className="common-region-grid">
              {COMMON_REGIONS.map((item) => (
                <button
                  className={`common-region-button ${item.tone}`}
                  type="button"
                  key={item.label}
                  onClick={() => setRegion(item.region)}
                >
                  <span className="common-region-icon" aria-hidden="true">
                    <RegionIcon type={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="selected-focus-card" aria-live="polite">
            <div className="selected-focus-eyebrow">
              <SparkleIcon className="selected-focus-icon" />
              Your selected focus
            </div>
            <h2>{region ? selectedRegionName : "No region selected"}</h2>
            <p>
              {region
                ? selectedGuidance
                : "Choose a point on the body map or select a common region above."}
            </p>
            {region && (
              <div className="selected-focus-footer">
                <button type="button" onClick={() => setRegion("")}>
                  Clear ×
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="control-panel">
        <section className="form-section">
          <h2>What are your symptoms?</h2>
          <div className="symptom-groups">
            {SYMPTOM_GROUPS.map((group) => (
              <div
                className="symptom-group"
                key={group.label}
                aria-label={group.label}
              >
                <div className="sensation-options">
                  {group.symptoms.map((s) => (
                    <label className="sensation-option" key={s}>
                      <input
                        type="checkbox"
                        checked={sensations.includes(s)}
                        onChange={() => toggleSensation(s)}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="form-section">
          <h2>Location</h2>
          <div className="location-options">
            {LOCATION_OPTIONS.map((option) => (
              <label className="sensation-option" key={option}>
                <input
                  type="checkbox"
                  value={option}
                  checked={locations.includes(option)}
                  onChange={() => toggleLocation(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="form-section sensation-strength">
          <div className="strength-heading">
            <h2>How strong is the sensation?</h2>
            <output htmlFor="sensation-strength">{intensity}/10</output>
          </div>
          <input
            id="sensation-strength"
            type="range"
            min="1"
            max="10"
            step="1"
            value={intensity}
            onChange={(event) => setIntensity(Number(event.target.value))}
          />
          <div className="strength-scale" aria-hidden="true">
            <span>1 · Very mild</span>
            <span>10 · Very strong</span>
          </div>
        </section>

        <div id="dropdowngroup" className="form-section">
          <h2>General Body Energy Level</h2>
          <select value={energy} onChange={(e) => setEnergy(e.target.value)}>
            <option value="">Select...</option>
            <option value="Energized">Energized</option>
            <option value="Restless">Restless</option>
            <option value="Grounded">Grounded</option>
            <option value="Relaxed">Relaxed</option>
            <option value="Fatigued">Fatigued</option>
            <option value="Low">Low</option>
          </select>

          <button className="start-session-button" type="submit">
            <SparkleIcon className="start-session-icon" />
            <span>Start session</span>
          </button>
        </div>
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
