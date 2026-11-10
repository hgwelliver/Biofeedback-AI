import React, { useEffect, useState } from "react";
import BodyMapForm from "./BodyMapForm";
import HelpModal from "./HelpModal";
import OutputCard from "./OutputCard";
import SettingsModal from "./SettingsModal";
import axios from "axios";

const getInitialDarkMode = () => {
  const savedTheme = localStorage.getItem("biofeedback-theme");

  if (savedTheme) return savedTheme === "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

function App() {
  const [result, setResult] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("biofeedback-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSubmit = async (data) => {
    setCheckIn(data);

    // Always reference the env var here, not at top-level
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      console.error("API key is missing! Check .env file placement.");
      setResult({
        interpretation: "The AI service is not configured.",
        additionalContext:
          "Add the OpenAI API key to the local environment and restart the app.",
        actions: [],
      });
      return;
    }

    setLoading(true);

    try {
      const prompt = `
You are an anatomy, neuroscience, and physiology specialist. 
This is a human-guided system for translating internal body signals into actionable movement, recovery, and regulation insights.
Interpret the following body sensations and energy context. 
Do NOT provide medical advice. Provide:
- A short interpretation of the sensations
- 3 gentle and regulating exercises
- use scientific, anatomy, neuroscience, and physical therapy language

Body sensations: ${data.sensations.join(", ")}
Energy level: ${data.energy}
Body region: ${data.region}
Sensations: ${data.sensations.join(", ")}
Sensation locations: ${data.locations.join(", ")}
Sensation intensity: ${data.intensity}/10

Respond in EXACTLY this format:

Interpretation:
A concise interpretation of what these body sensations may reflect.

Additional Context:
A second paragraph with more detailed anatomy, physiology, or nervous-system context that helps the user understand the interpretation.

Recommended Actions:
1. Exercise name | One or two sentences explaining how to do it and why it may help
2. Exercise name | One or two sentences for a movement, touch, or attention-based exercise
3. Exercise name | One or two sentences for a rest, situational, or environmental exercise

Do not include anything else.
`;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-5.6-terra",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json", // fixed
          },
        }
      );

      // Extract AI text
      const aiText = response.data.choices[0].message.content;

      // Parse Interpretation
      const interpretationMatch = aiText.match(
        /Interpretation:\s*([\s\S]*?)\n\nAdditional Context:/i
      );

      const additionalContextMatch = aiText.match(
        /Additional Context:\s*([\s\S]*?)\n\nRecommended Actions:/i
      );

      // Parse Recommended Actions block
      const actionsMatch = aiText.match(
        /Recommended Actions:\s*([\s\S]*)/i
      );

      if (!interpretationMatch || !additionalContextMatch || !actionsMatch) {
        throw new Error("AI response did not match the required format");
      }

      const actions = actionsMatch[1]
        .split(/\n+/)
        .map(line => line.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean)
        .map((line) => {
          const [title, ...detailParts] = line.split("|");

          return {
            title: title.trim(),
            details: detailParts.join("|").trim(),
          };
        });

      if (actions.length !== 3 || actions.some((action) => !action.details)) {
        throw new Error("AI response did not include three detailed actions");
      }

      setResult({
        interpretation: interpretationMatch[1].trim(),
        additionalContext: additionalContextMatch[1].trim(),
        actions,
      });
    } catch (error) {
      console.error("Axios/AI error:", error);
      setResult({
        interpretation: "The AI service could not complete this check-in.",
        additionalContext:
          "Please wait a moment and try starting the session again.",
        actions: [],
      });
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="app-brand">
          <span className="brand-sparkle" aria-hidden="true">✦</span>
          <h1>Biofeedback AI</h1>
        </div>

        <nav className="app-nav" aria-label="Primary navigation">
          <button className="is-active" type="button">Home</button>
          <button type="button">Sessions</button>
          <button type="button">Trends</button>
          <button type="button" onClick={() => setSettingsOpen(true)}>
            Settings
          </button>
        </nav>

        <div className="header-actions">
          <button
            className="help-button"
            type="button"
            onClick={() => setHelpOpen(true)}
          >
            Help
          </button>
          <button className="profile-orb" type="button" aria-label="Open profile">
            <span className="profile-head" />
            <span className="profile-body" />
          </button>
        </div>
      </header>
      <BodyMapForm onSubmit={handleSubmit} />
      {loading ? (
        <p className="loading-message">Loading AI interpretation...</p>
      ) : (
        <OutputCard result={result} checkIn={checkIn} />
      )}
      <footer className="app-footer">
        <div className="footer-message">
          <span className="footer-sparkle" aria-hidden="true">✦</span>
          <span>Made for awareness, not diagnosis.</span>
        </div>
        <span>Your body. Your data. Always private.</span>
      </footer>
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
      {settingsOpen && (
        <SettingsModal
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((current) => !current)}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
