import express from 'express';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import multer from 'multer';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

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
1. band: number (Estimated Band Score 0-9, in 0.5 increments)
2. pronunciation: string[] (feedback points)
3. fluency: string[] (feedback points)
4. vocabulary: string[] (feedback points)`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
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
              band: { type: Type.NUMBER },
              pronunciation: { type: Type.ARRAY, items: { type: Type.STRING } },
              fluency: { type: Type.ARRAY, items: { type: Type.STRING } },
              vocabulary: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["band", "pronunciation", "fluency", "vocabulary"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (error) {
      console.error('Speaking evaluation error:', error);
      res.status(500).json({ error: 'Failed to evaluate speaking' });
    }
  });

  // ─── TELEGRAM REPORTING ───
  app.post('/api/telegram/send-report', async (req, res) => {
    try {
      const { pdfData, filename, caption } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        return res.status(400).json({ error: 'Telegram bot token or chat ID not configured' });
      }

      const blob = Buffer.from(pdfData, 'base64');
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('document', new Blob([blob], { type: 'application/pdf' }), `${filename}.pdf`);
      formData.append('caption', caption || 'New IELTS Test Result');

      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: 'POST',
        body: formData,
      });

      if (!tgRes.ok) {
        const errText = await tgRes.text();
        console.error('Telegram API error:', errText);
        throw new Error('Failed to send to Telegram');
      }

      res.json({ status: 'ok' });
    } catch (error) {
      console.error('Telegram report error:', error);
      res.status(500).json({ error: 'Failed to send report to Telegram' });
    }
  });

  app.post('/api/telegram/send-audio', async (req, res) => {
    try {
      const { audioData, filename, caption } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        return res.status(400).json({ error: 'Telegram bot token or chat ID not configured' });
      }

      const blob = Buffer.from(audioData, 'base64');
      const formData = new FormData();
      formData.append('chat_id', chatId);
      // Sending as audio/webm which is common for browser recordings
      formData.append('audio', new Blob([blob], { type: 'audio/webm' }), `${filename}.webm`);
      formData.append('caption', caption || 'New IELTS Speaking Recording');

      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendAudio`, {
        method: 'POST',
        body: formData,
      });

      if (!tgRes.ok) {
        const errText = await tgRes.text();
        console.error('Telegram API error:', errText);
        throw new Error('Failed to send audio to Telegram');
      }

      res.json({ status: 'ok' });
    } catch (error) {
      console.error('Telegram audio error:', error);
      res.status(500).json({ error: 'Failed to send audio to Telegram' });
    }
  });

  // ─── GLOBAL PAYMENT INTEGRATION ───
  app.post('/api/payment/notify-admin', async (req, res) => {
    try {
      const { userId, userEmail, amount, cardLast4 } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        return res.status(400).json({ error: 'Telegram bot not configured' });
      }

      const message = `💰 *Yangi To'lov Xabarnomasi!*\n\n` +
                      `👤 Foydalanuvchi: ${userEmail}\n` +
                      `🆔 ID: ${userId}\n` +
                      `💳 Karta: **** **** **** ${cardLast4 || 'XXXX'}\n` +
                      `💵 Miqdor: ${amount || 'Noma\'lum'}\n\n` +
                      `Iltimos, to'lovni tekshiring va premiumni faollashtiring.`;

      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (!tgRes.ok) throw new Error('Failed to notify admin via Telegram');

      res.json({ status: 'ok' });
    } catch (error) {
      console.error('Payment notification error:', error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  });

  // ─── GLOBAL PAYMENT WEBHOOK ───
  app.post('/api/payment/global-webhook', async (req, res) => {
    try {
      const { transactionId, status, userId, amount } = req.body;
      
      console.log(`📡 Webhook received: ID=${userId}, Status=${status}, Tx=${transactionId}`);

      if (status === 'success' || status === 'paid') {
        const firebaseConfig = {
          projectId: "flutter-ai-playground-e59c0",
          appId: "1:739402615898:web:36c8d993157efdd874dc63",
          apiKey: process.env.FIREBASE_API_KEY || "AIzaSyA2ueFz2ijbBz8uoNxWW4RlGhqcTJqjhWM",
          authDomain: "flutter-ai-playground-e59c0.firebaseapp.com",
          storageBucket: "flutter-ai-playground-e59c0.firebasestorage.app",
        };

        const fbApp = initializeApp(firebaseConfig, "server-instance");
        const db = getFirestore(fbApp);
        
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const currentPremiumUntil = userSnap.data().premiumUntil || Date.now();
          const newExpiry = Math.max(currentPremiumUntil, Date.now()) + (30 * 24 * 60 * 60 * 1000);
          
          await updateDoc(userRef, {
            premiumUntil: newExpiry,
            isPremium: true
          });

          console.log(`✅ Webhook: Premium granted to user ${userId} for 30 days.`);
          
          // Notify admin of success
          const botToken = process.env.TELEGRAM_BOT_TOKEN;
          const chatId = process.env.TELEGRAM_CHAT_ID;
          if (botToken && chatId) {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: `✅ *To'lov Tasdiqlandi!*\n\nFoydalanuvchi: ${userSnap.data().email || userId}\nStatus: Avtomatik faollashtirildi.`,
                parse_mode: 'Markdown'
              })
            });
          }
        } else {
          console.error(`❌ Webhook: User ${userId} not found.`);
        }
      }
      
      res.json({ status: 'ok' });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
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
