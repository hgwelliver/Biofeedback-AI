import React from "react";
import useModalBehavior from "./useModalBehavior";

const HELP_STEPS = [
  {
    number: "01",
    title: "Choose your focus",
    description: "Click a region on the body map or choose from the list.",
    tone: "lavender",
  },
  {
    number: "02",
    title: "Get guided",
    description: "AI will personalize biofeedback exercises for your check-in.",
    tone: "rose",
  },
  {
    number: "03",
    title: "See your feedback",
    description: "Review gentle actions based on the signals you shared.",
    tone: "blue",
  },
];

export default function HelpModal({ onClose }) {
  useModalBehavior(onClose);

  return (
    <div
      className="help-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="help-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
      >
        <button
          className="help-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close help"
          autoFocus
        >
          ×
        </button>

        <div className="help-modal-intro">
          <span className="help-modal-eyebrow">Biofeedback AI</span>
          <h2 id="help-modal-title">Come back to yourself.</h2>
          <p>
            Understand your body. Train your mind. Begin with one place that
            needs a little care.
          </p>
        </div>

        <ol className="help-steps">
          {HELP_STEPS.map((step) => (
            <li key={step.number}>
              <span className={`help-step-number ${step.tone}`}>
                {step.number}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
