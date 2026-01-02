
import { GoogleGenAI, Type } from "@google/genai";
import { Exam } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateExamByTopic = async (topic: string): Promise<Exam> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a comprehensive multiple-choice exam about "${topic}". The questions should vary in difficulty.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING },
          duration: { type: Type.NUMBER, description: "Duration in minutes" },
          totalQuestions: { type: Type.NUMBER },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                text: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  minItems: 4,
                  maxItems: 4
                },
                correctAnswer: { type: Type.NUMBER, description: "Index (0-3) of the correct option" }
              },
              required: ["id", "text", "options", "correctAnswer"]
            }
          }
        },
        required: ["title", "category", "duration", "totalQuestions", "difficulty", "questions"]
      }
    }
  });

  const examData = JSON.parse(response.text || '{}');
  return {
    ...examData,
    id: `ai-${Date.now()}`
  };
};

export const getExamFeedback = async (
  examTitle: string, 
  score: number, 
  total: number, 
  wrongQuestions: string[]
): Promise<string> => {
  const prompt = `
    A student just finished an exam on "${examTitle}".
    Score: ${score}/${total} (${Math.round((score/total)*100)}%)
    
    They struggled with these concepts/questions:
    ${wrongQuestions.map(q => `- ${q}`).join('\n')}
    
    Provide:
    1. A supportive and motivating opening.
    2. A brief, high-level explanation of the missed concepts.
    3. Three actionable study tips tailored to these specific weaknesses.
    4. A confident closing.
    
    Keep it concise, friendly, and encouraging. Use Markdown for formatting.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.7,
      topP: 0.8,
    }
  });

  return response.text || "I couldn't analyze your results at this time. Great job on completing the test!";
};
