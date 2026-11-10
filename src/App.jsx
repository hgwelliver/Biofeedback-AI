import React, { useEffect, useState } from "react";
import BodyMapForm from "./BodyMapForm";
import HelpModal from "./HelpModal";
import OutputCard from "./OutputCard";
import SettingsModal from "./SettingsModal";
import axios from "axios";

const AI_ROLE_PROMPTS = {
  scientific: `
You are an anatomy, neuroscience, physiology, and physical therapy specialist.
Use precise scientific and anatomical language while keeping the explanation approachable.
Focus on movement, recovery, nervous-system regulation, and body awareness.
`,
  "somatic-herbal": `
You are a somatic wellness guide informed by traditional Chinese medicine,
apothecary traditions, and herbalist language. Use these traditions as reflective
wellness frameworks alongside gentle body awareness, breath, rest, and sensory
practices. Do not diagnose conditions, prescribe herbs or supplements, provide
dosages, recommend ingestion, or make claims that a practice can treat or cure illness.
`,
};

const getInitialDarkMode = () => {
  const savedTheme = localStorage.getItem("biofeedback-theme");

  if (savedTheme) return savedTheme === "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const getInitialAiRole = () => {
  const savedRole = localStorage.getItem("biofeedback-ai-role");

  return AI_ROLE_PROMPTS[savedRole] ? savedRole : "scientific";
};

function App() {
  const [result, setResult] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [aiRole, setAiRole] = useState(getInitialAiRole);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("biofeedback-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("biofeedback-ai-role", aiRole);
  }, [aiRole]);

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
      const recommendedActionsFormat =
        aiRole === "somatic-herbal"
          ? `1. Somatic practice name | One or two sentences explaining a gentle somatic or tradition-informed practice
2. Meditation: specific meditation name | One or two sentences guiding a meditation tailored to the user's selected sensations, body region, intensity, and energy
3. Rest or sensory practice name | One or two sentences explaining a rest, environmental, or non-ingestible sensory practice`
          : `1. Exercise name | One or two sentences explaining how to do it and why it may help
2. Exercise name | One or two sentences for a movement, touch, or attention-based exercise
3. Exercise name | One or two sentences for a rest, situational, or environmental exercise`;

      const herbalTraditionsFormat =
        aiRole === "somatic-herbal"
          ? `

Educational Herbal Traditions:
Tradition: Name one historical herbal tradition or classical formula associated in traditional literature with a broadly analogous pattern. Present it only as historical education, not as a recommendation.
Historical Context: Explain its historical or cultural context in one or two sentences without listing ingredients, preparation steps, recipes, or dosages.
Traditional Reasoning: Explain why a practitioner from that tradition might make this conceptual association, without claiming effectiveness or suitability for the user.
Safety Note: State clearly that this is educational context, not a recommendation to obtain, prepare, or use the formula, and that herbal products require guidance from a qualified licensed professional because of interactions, allergies, and contraindications.`
          : "";

      const prompt = `
${AI_ROLE_PROMPTS[aiRole]}
This is a human-guided system for translating internal body signals into actionable movement, recovery, and regulation insights.
Interpret the following body sensations and energy context. 
Do NOT provide medical advice. Provide:
- A short interpretation of the sensations
- 3 gentle and regulating exercises
- Language and framing consistent with your assigned role

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
${recommendedActionsFormat}
${herbalTraditionsFormat}

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

      const actionsMatch =
        aiRole === "somatic-herbal"
          ? aiText.match(
              /Recommended Actions:\s*([\s\S]*?)\n\nEducational Herbal Traditions:/i
            )
          : aiText.match(/Recommended Actions:\s*([\s\S]*)/i);

      const herbalTraditionsMatch =
        aiRole === "somatic-herbal"
          ? aiText.match(
              /Educational Herbal Traditions:\s*Tradition:\s*([\s\S]*?)\nHistorical Context:\s*([\s\S]*?)\nTraditional Reasoning:\s*([\s\S]*?)\nSafety Note:\s*([\s\S]*)/i
            )
          : null;

      if (
        !interpretationMatch ||
        !additionalContextMatch ||
        !actionsMatch ||
        (aiRole === "somatic-herbal" && !herbalTraditionsMatch)
      ) {
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

      const meditationCount = actions.filter((action) =>
        /\bmeditation\b/i.test(action.title)
      ).length;

      if (aiRole === "somatic-herbal" && meditationCount !== 1) {
        throw new Error(
          "Somatic AI response did not include exactly one meditation"
        );
      }

      const herbalContext = herbalTraditionsMatch
        ? {
            tradition: herbalTraditionsMatch[1].trim(),
            historicalContext: herbalTraditionsMatch[2].trim(),
            reasoning: herbalTraditionsMatch[3].trim(),
            safetyNote: herbalTraditionsMatch[4].trim(),
          }
        : null;

      if (
        herbalContext &&
        /\b(?:teaspoons?|tablespoons?|dosage|dose|recipe)\b|\b\d+\s*(?:g|mg|ml|oz)\b|\b(?:boil|steep)\s+for\b/i.test(
          Object.values(herbalContext).join(" ")
        )
      ) {
        throw new Error(
          "Herbal traditions response included prohibited preparation or dosage instructions"
        );
      }

      setResult({
        interpretation: interpretationMatch[1].trim(),
        additionalContext: additionalContextMatch[1].trim(),
        actions,
        herbalContext,
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
          aiRole={aiRole}
          onToggleTheme={() => setDarkMode((current) => !current)}
          onRoleChange={setAiRole}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
