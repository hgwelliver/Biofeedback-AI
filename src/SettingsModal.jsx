import React from "react";
import useModalBehavior from "./useModalBehavior";

export default function SettingsModal({ darkMode, onToggleTheme, onClose }) {
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
      </section>
    </div>
  );
}
