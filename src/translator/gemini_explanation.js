import ky from "ky";
import gemini from "./gemini.js";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
const GEMINI_API_KEY = "";

export default class gemini_explanation extends gemini {

  static async requestTranslate(text, sourceLang, targetLang) {

    const fullPrompt = `Объясни лаконично что такое «${text.trim()}»`;

    const body = {
      contents: [
        {
          parts: [{ text: fullPrompt }]
        }
      ],
      "generationConfig": {
        "temperature": 0.7,
        "topP": 0.9
      }
    };

    let response = await ky.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      json: body,
      headers: {
        "Content-Type": "application/json"
      }
    }).json();

    response = {
          targetText: response.candidates?.[0]?.content?.parts?.[0]?.text?.trim(),
          sourceLang,
          transliteration: "",
        };

    return response;
  }
}