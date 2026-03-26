const { GoogleGenAI, Type } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const promptText = `
You are a strict IELTS essay examiner.

Evaluate this Task 2 essay.
Return ONLY valid JSON.

Prompt/Topic:
"""
General IELTS Writing
"""

Essay:
"""
this is a sample essay about a given topic which has more than twenty words inside of it to pass the minimum word count validation filter easily. i believe it is a good essay.
"""

Scoring requirements:
- Give estimated overall band
- Score these categories separately:
  - task_response
  - coherence_and_cohesion
  - lexical_resource
  - grammatical_range_and_accuracy
- Find grammar mistakes
- Find vocabulary weaknesses
- Give clear improvement advice
- Rewrite the essay in a stronger version
- Keep feedback concise but useful
`;

    console.log("Calling Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overall_band: { type: Type.NUMBER },
            scores: {
              type: Type.OBJECT,
              properties: {
                task_response: { type: Type.NUMBER },
                coherence_and_cohesion: { type: Type.NUMBER },
                lexical_resource: { type: Type.NUMBER },
                grammatical_range_and_accuracy: { type: Type.NUMBER }
              },
              required: [
                "task_response",
                "coherence_and_cohesion",
                "lexical_resource",
                "grammatical_range_and_accuracy"
              ]
            },
            grammar_issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  corrected: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["original", "corrected", "explanation"]
              }
            },
            vocabulary_issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weak_wording: { type: Type.STRING },
                  better_option: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["weak_wording", "better_option", "explanation"]
              }
            },
            advice: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            improved_essay: { type: Type.STRING }
          },
          required: [
            "overall_band",
            "scores",
            "grammar_issues",
            "vocabulary_issues",
            "advice",
            "improved_essay"
          ]
        }
      }
    });

    console.log("SUCCESS!");
    console.log(response.text);
  } catch (err) {
    console.error("ERROR DETECTED:");
    console.error(err);
  }
}

run();
