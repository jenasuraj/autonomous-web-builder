import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Flash-Lite is Gemini's cheapest tier; override with GEMINI_MODEL in .env
export function getLLM(
  model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Add it to your .env file.');
  }
  return new ChatGoogleGenerativeAI({ model, apiKey, temperature: 0.7 });
}
