import ky from "ky";
import BaseTranslator from "./baseTranslator";
import google from "./google";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";
const GEMINI_API_KEY = "";

export default class gemini extends BaseTranslator {

  static async detectLanguage(text, sourceLang, targetLang) {
    const res = await google.requestTranslate(text, sourceLang, targetLang);
    return res.src || "auto";
  };

  static async requestTranslate(text, sourceLang, targetLang) {

    let detectedLang = sourceLang;
    if (sourceLang === "auto") {
      detectedLang = await this.detectLanguage(text, sourceLang, targetLang);
    }

    if (detectedLang === targetLang) {
      const response = {
          targetText: text,
          detectedLang,
          transliteration: "",
        };
      return response
    }

    const fullPrompt = `Переведи «${text.trim()}» на ${targetLang} язык. Ответь лаконично.`;

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

    let response = await ky.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      json: body,
      headers: {
        "Content-Type": "application/json"
      }
    }).json();

    response = {
          targetText: response.candidates?.[0]?.content?.parts?.[0]?.text?.trim(),
          detectedLang,
          transliteration: "",
        };

    return response;
  }

  static async wrapResponse(res, text, sourceLang, targetLang) {
    let targetText = res['targetText']

    if (targetText) {
      targetText = targetText.replace(/(^|\s)\*(\s)/g, '$1• $2');
      targetText = targetText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    }

    return {
      targetText,
      detectedLang: res['detectedLang'],
      transliteration: res['transliteration'],
    };
  }
}