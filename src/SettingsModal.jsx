import React from "react";
import useModalBehavior from "./useModalBehavior";

const AI_ROLE_OPTIONS = [
  {
    value: "scientific",
    title: "Scientific & anatomical",
    description:
      "Physical therapy, anatomy, neuroscience, and physiology-based language.",
  },
  {
    value: "somatic-herbal",
    title: "Somatic & herbal traditions",
    description:
      "Somatics, Chinese herbal medicine, apothecary, and herbalist language.",
  },
];

export default function SettingsModal({
  darkMode,
  aiRole,
  onToggleTheme,
  onRoleChange,
  onClose,
}) {
  useModalBehavior(onClose);

  return (
    <div
      className="help-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="help-modal settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <button
          className="help-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          autoFocus
        >
          ×
        </button>

        <div className="settings-modal-heading">
          <span className="help-modal-eyebrow">Biofeedback AI</span>
          <h2 id="settings-modal-title">Settings</h2>
        </div>

        <div className="settings-section">
          <div className="settings-section-heading">
            <h3>Theme</h3>
            <p>Choose how the app looks and feels for you.</p>
          </div>

          <div className="theme-setting">
            <div>
              <h3>Dark mode</h3>
              <p>Use a darker palette throughout the entire app.</p>
            </div>
            <button
              className="theme-switch"
              type="button"
              role="switch"
              aria-checked={darkMode}
              aria-label="Toggle dark mode"
              onClick={onToggleTheme}
            >
              <span />
            </button>
          </div>
        </div>

        <fieldset className="ai-role-setting">
          <legend>AI guidance style</legend>
          <p>Choose the language and perspective used in your interpretation.</p>
          <div className="ai-role-options">
            {AI_ROLE_OPTIONS.map((option) => (
              <label className="ai-role-option" key={option.value}>
                <input
                  type="radio"
                  name="ai-role"
                  value={option.value}
                  checked={aiRole === option.value}
                  onChange={(event) => onRoleChange(event.target.value)}
                />
                <span>
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>
    </div>
  );
}
