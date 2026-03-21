import express from 'express';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ielts';
  try {
    await mongoose.connect(MONGODB_URI);
    // Connected to MongoDB
  } catch (error) {
    // Failed to connect to MongoDB. App will run in mock mode if DB is unavailable.
  }

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  });

  app.post('/api/evaluate/writing', async (req, res) => {
    try {
      const { text, taskType = 'Task 2', prompt = 'General IELTS Writing' } = req.body;
      
      if (!text || text.trim().length < 50) {
        return res.status(400).json({ error: 'Text is too short for evaluation (minimum 50 words)' });
      }

      const systemInstruction = `You are an expert IELTS examiner. Evaluate the following IELTS Writing ${taskType} response.
The prompt/topic was: "${prompt}"
Provide a detailed evaluation in JSON format including:
1. band: number (Estimated Band Score 0-9, in 0.5 increments)
2. grammar: string[] (Grammar & Accuracy feedback, 2-3 specific points)
3. vocabulary: string[] (Lexical Resource/Vocabulary feedback, 2-3 specific points)
4. coherence: string (Coherence & Cohesion feedback, 1-2 paragraphs)
5. improvements: string[] (Practical suggestions for improvement)`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: [{ role: 'user', parts: [{ text }] }],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              band: { type: Type.NUMBER, description: "Estimated band score" },
              grammar: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Grammar feedback points" },
              vocabulary: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Vocabulary feedback points" },
              coherence: { type: Type.STRING, description: "Coherence feedback paragraph" },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggestions for improvement" }
            },
            required: ["band", "grammar", "vocabulary", "coherence", "improvements"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (error) {
      console.error('Error evaluating writing:', error);
      res.status(500).json({ error: 'Failed to evaluate writing. Please try again later.' });
    }
  });

  app.post('/api/evaluate/speaking', upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No audio file provided' });
      }

      const prompt = req.body.prompt || 'Describe a memorable journey you have taken.';

      const systemInstruction = `You are an expert IELTS examiner. Evaluate the following IELTS Speaking response based on the audio provided.
The prompt was: "${prompt}"
Provide a detailed evaluation including:
1. Estimated Band Score (0-9, in 0.5 increments)
2. Pronunciation feedback (list of 2-3 points)
3. Fluency & Coherence feedback (list of 2-3 points)
4. Lexical Resource (Vocabulary) feedback (list of 2-3 points)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [
          {
            inlineData: {
              data: req.file.buffer.toString('base64'),
              mimeType: req.file.mimetype
            }
          },
          { text: 'Please evaluate this speaking response.' }
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              band: { type: Type.NUMBER, description: "Estimated band score" },
              pronunciation: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Pronunciation feedback points" },
              fluency: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Fluency feedback points" },
              vocabulary: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Vocabulary feedback points" }
            },
            required: ["band", "pronunciation", "fluency", "vocabulary"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (error) {
      // Error evaluating speaking
      res.status(500).json({ error: 'Failed to evaluate speaking' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    // Server running
  });
}

startServer();
