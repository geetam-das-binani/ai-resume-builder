import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });
const model = ai.models.generateContent({
  model: "gemini-1.5-flash",
  contents: "",
});
