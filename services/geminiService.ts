
import { GoogleGenAI, Type } from "@google/genai";
import { StoryTheme, StoryResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStory = async (input: string, theme: string, themePrompt: string): Promise<StoryResponse> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    Sei un maestro di micro-narrativa e flash fiction. 
    Il tuo compito è trasformare le parole dell'utente in una mini-storia brevissima (max 100 parole).
    REGOLE CRITICHE:
    1. Ogni storia DEVE avere un finale a sorpresa, un colpo di scena o un'ironia finale che ribalta il senso.
    2. Rispetta lo stile richiesto: ${themePrompt}
    3. La risposta deve essere in formato JSON valido.
    4. Usa la lingua italiana.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: `Parole chiave: ${input}. Tema: ${theme}. Genera la storia.`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Un titolo breve e accattivante." },
          content: { type: Type.STRING, description: "Il corpo della storia (escluso il colpo di scena finale)." },
          twist: { type: Type.STRING, description: "La frase o il paragrafo finale che contiene il colpo di scena." }
        },
        required: ["title", "content", "twist"],
        propertyOrdering: ["title", "content", "twist"]
      },
      temperature: 1.1,
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    throw new Error("Impossibile generare la storia al momento.");
  }
};
