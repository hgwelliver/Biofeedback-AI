import React from "react";

function OutputCard({ result }) {
  if (!result) return null;

  return (
    <div className="output-card">
      <h2>Biofeedback AI Interpretation</h2>

      <p>
        <strong>AI Interpretation:</strong> {result.interpretation}
      </p>

      <div>
        <strong>Recommended Actions:</strong>
        <ol>
          {(result.actions || []).map((action, i) => (
            <li key={i}>{action}</li>
          ))}
        </ol>
      </div>

      <p>
        <em>Note: This is interpretive guidance, not medical advice.</em>
      </p>
    </div>
  );
}

export default OutputCard;
