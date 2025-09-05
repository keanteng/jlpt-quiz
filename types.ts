
export interface ExampleSentence {
  sentence: string;
}

export interface Explanation {
  title: string;
  meaning: string;
  why_correct: string;
  why_incorrect: string[];
  example_sentences: ExampleSentence[];
}

export interface QuizQuestion {
  id: string;
  level: "N2";
  type: "文法" | "語彙";
  question_sentence: string;
  options: string[];
  correct_answer_index: number;
  explanation: Explanation;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

export enum AppState {
  WELCOME,
  LOADING,
  QUIZ,
  FEEDBACK,
  RESULTS,
}
