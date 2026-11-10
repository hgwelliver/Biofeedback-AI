import React from "react";

const formatRegion = (region) =>
  region
    ? region
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "No region selected";

function OutputCard({ result, checkIn }) {
  if (!result) return null;

  const summaryItems = [
    ...(checkIn?.sensations || []),
    checkIn?.locations?.length
      ? `Locations: ${checkIn.locations.join(", ")}`
      : null,
    checkIn?.intensity ? `${checkIn.intensity}/10 intensity` : null,
    checkIn?.energy ? `Energy: ${checkIn.energy}` : null,
  ].filter(Boolean);

  return (
    <div className="output-card">
      <section className="check-in-summary">
        <div className="check-in-heading">
          <span>Your body check-in</span>
          <span className="check-in-region">
            {formatRegion(checkIn?.region)}
          </span>
        </div>
        <h2>Let's explore what you're feeling.</h2>
        <div className="check-in-tags">
          {summaryItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="ai-interpretation">
        <h2>Biofeedback AI Interpretation</h2>

        <p>{result.interpretation}</p>
        <p>{result.additionalContext}</p>

        <div>
          <strong>Recommended Actions:</strong>
          <ol className="exercise-list">
            {(result.actions || []).map((action, i) => (
              <li
                className="exercise-card"
                key={`${i}-${action.title || action}`}
              >
                <h3>{action.title || action}</h3>
                {action.details && <p>{action.details}</p>}
              </li>
            ))}
          </ol>
        </div>

        <p className="interpretive-note">
          Made for awareness, not diagnosis.
        </p>
      </section>
    </div>
  );
}

export default OutputCard;
