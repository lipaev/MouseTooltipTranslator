import ky from "ky";
import BaseTranslator from "./baseTranslator";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";
const GEMINI_API_KEY = "AIzaSyA7ppT_p7WCNGJsmzB_Z_oC8lbVdA9lI_0"; // замените на ваш ключ

export default class gemini extends BaseTranslator {
  static async requestTranslate(text, sourceLang, targetLang) {
    // Формируем промпт для перевода
    const fullPrompt = `Переведи "${text}" на ${targetLang} язык. Ответь лаконично.`;

    const body = {
      contents: [
        {
          parts: [{ text: fullPrompt }]
        }
      ],
      "generationConfig": {
        "temperature": 0.7,
        "topP": 0.8
      }
    };

    const response = await ky.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      json: body,
      headers: {
        "Content-Type": "application/json"
      }
    }).json();

    return response;
  }

  static async wrapResponse(res, text, sourceLang, targetLang) {
    const targetText = res.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return {
      targetText,
      detectedLang: sourceLang,
      transliteration: "",
    };
  }
}