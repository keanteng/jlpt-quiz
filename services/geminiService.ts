
import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("APIキーが設定されていません。環境変数 'API_KEY' を設定してください。");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "問題のユニークID (例: g001, v001)" },
      level: { type: Type.STRING, description: "常に 'N2' を設定" },
      type: { type: Type.STRING, description: "'文法' または '語彙' のいずれか" },
      question_sentence: { type: Type.STRING, description: "空欄を含む問題文。空欄は「＿＿＿」で示す。" },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "4つの選択肢の配列"
      },
      correct_answer_index: { type: Type.INTEGER, description: "正解の選択肢のインデックス (0-3)" },
      explanation: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "文法項目または語彙のタイトル (例:【文法】〜をめぐって)" },
          meaning: { type: Type.STRING, description: "文法・語彙の意味の解説" },
          why_correct: { type: Type.STRING, description: "なぜその選択肢が正解かの詳細な理由" },
          why_incorrect: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "他の3つの選択肢がなぜ間違いかの理由の配列"
          },
          example_sentences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sentence: { type: Type.STRING, description: "解説のための例文" }
              },
              required: ['sentence']
            },
            description: "文法・語彙を使った複数の例文の配列"
          }
        },
        required: ['title', 'meaning', 'why_correct', 'why_incorrect', 'example_sentences']
      }
    },
    required: ['id', 'level', 'type', 'question_sentence', 'options', 'correct_answer_index', 'explanation']
  }
};

export const generateQuizQuestions = async (pastIncorrectIds: string[]): Promise<QuizQuestion[]> => {
  const incorrectFocusPrompt = pastIncorrectIds.length > 0
    ? `ユーザーは以前、以下のIDの問題を間違えました: ${pastIncorrectIds.join(', ')}。これらの問題に関連する文法項目や語彙、または類似の文脈を持つ問題を優先的に生成してください。`
    : '';

  const prompt = `
    あなたは日本語能力試験(JLPT) N2レベルの問題を作成する専門家です。
    これからJLPT N2レベルのクイズ問題を20問生成してください。文法問題を10問、語彙問題を10問含めてください。
    問題は、単なる知識だけでなく、文脈におけるニュアンスの理解を問うような、質の高いものにしてください。
    すべてのコンテンツは日本語で生成してください。
    ${incorrectFocusPrompt}
    以下のJSONスキーマに厳密に従って、結果をJSON配列として返してください。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const questions = JSON.parse(jsonText) as QuizQuestion[];
    
    // 生成された問題が20問であることを確認
    if (questions.length !== 20) {
        console.warn(`Geminiが期待した数と異なる${questions.length}問を生成しました。`);
    }

    return questions;
  } catch (error) {
    console.error("Gemini APIからの問題生成に失敗しました:", error);
    // ユーザーへのフィードバックのためにエラーを再スロー
    throw new Error("問題の生成に失敗しました。APIキーを確認するか、しばらくしてから再試行してください。");
  }
};
