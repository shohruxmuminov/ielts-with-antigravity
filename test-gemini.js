import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI, Type } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('Testing generateContent...');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: [
        { role: 'user', parts: [{ text: 'Evaluate this IELTS Task 2 essay: Many people think that...', }] }
      ],
      config: {
        systemInstruction: 'You are an examiner. Output JSON with a band score.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            band: { type: Type.NUMBER, description: "Estimated band score" }
          },
          required: ["band"]
        }
      }
    });

    console.log('Response:', response.text);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
