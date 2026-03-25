import React, { useState } from "react";
import BodyMapForm from "./BodyMapForm";
import OutputCard from "./OutputCard";
import axios from "axios";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    // Always reference the env var here, not at top-level
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      console.error("API key is missing! Check .env file placement.");
      setResult({ interpretation: "API key missing", actions: [] });
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

Respond in EXACTLY this format:

Interpretation:
An interpretation of what these body sensations may reflect.

Recommended Actions:
1. A gentle exercise
2. A second gentle exercise (movement, touch, or attention-based)
3. A third gentle exercise (rest, situational, or environmental)

Do not include anything else.
`;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
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
        /Interpretation:\s*([\s\S]*?)\n\nRecommended Actions:/i
      );

      // Parse Recommended Actions block
      const actionsMatch = aiText.match(
        /Recommended Actions:\s*([\s\S]*)/i
      );

      let actions = [
          "First gentle exercise",
          "Second gentle exercise",
          "Third gentle exercise"
        ];

      if (actionsMatch) {
        actions = actionsMatch[1]
          .split(/\n+/)
          .map(line => line.replace(/^\d+\.\s*/, "").trim())
          .filter(Boolean);
      }

      setResult({
        interpretation: interpretationMatch
          ? interpretationMatch[1].trim()
          : aiText,
        actions,
      });
    } catch (error) {
      console.error("Axios/AI error:", error);
      setResult({ interpretation: "Error contacting AI", actions: [] });
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Biofeedback Artificial Intelligence</h1>
      <BodyMapForm onSubmit={handleSubmit} />
      {loading ? <p>Loading AI interpretation...</p> : <OutputCard result={result} />}
      <footer className="app-footer">
          made by haley
      </footer>
    </div>
  );
}

export default App;
