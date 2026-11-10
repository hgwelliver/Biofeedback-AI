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

        {result.herbalContext && (
          <section className="herbal-traditions">
            <div className="herbal-traditions-heading">
              <span aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M19.7 4.3C12.8 4.5 7.6 7.2 5.5 11.6c-1.3 2.7-.7 5.6 1.5 7.1 2.2 1.5 5.1.8 6.8-1.4 2.7-3.5 3.2-8.3 5.9-13Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M4.3 20c2.6-4.1 6.2-7.3 10.8-9.6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.7"
                  />
                </svg>
              </span>
              <div>
                <p>Historical and cultural context</p>
                <h2>Educational herbal traditions</h2>
              </div>
            </div>

            <div className="herbal-traditions-content">
              <article>
                <span>Tradition</span>
                <h3>{result.herbalContext.tradition}</h3>
              </article>
              <article>
                <span>Historical context</span>
                <p>{result.herbalContext.historicalContext}</p>
              </article>
              <article>
                <span>Traditional reasoning</span>
                <p>{result.herbalContext.reasoning}</p>
              </article>
            </div>

            <p className="herbal-safety-note">
              <strong>Safety note:</strong> {result.herbalContext.safetyNote}
            </p>
          </section>
        )}

        <p className="interpretive-note">
          Made for awareness, not diagnosis.
        </p>
      </section>
    </div>
  );
}

export default OutputCard;
