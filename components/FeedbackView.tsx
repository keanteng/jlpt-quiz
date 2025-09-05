
import React from 'react';
import type { QuizQuestion, UserAnswer } from '../types';
import AudioPlayer from './AudioPlayer';

interface FeedbackViewProps {
  question: QuizQuestion;
  userAnswer: UserAnswer;
  onNext: () => void;
}

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

const FeedbackView: React.FC<FeedbackViewProps> = ({ question, userAnswer, onNext }) => {
  const { isCorrect, selectedOptionIndex } = userAnswer;
  const { correct_answer_index, options, explanation } = question;

  return (
    <div className="w-full max-w-2xl p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg animate-fade-in">
      <div className="flex items-center mb-4">
        {isCorrect ? <CheckIcon /> : <XCircleIcon />}
        <h2 className={`ml-3 text-2xl font-bold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isCorrect ? '正解' : '不正解'}
        </h2>
      </div>

      <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
        <p className="text-lg font-semibold">{question.question_sentence.replace('＿＿＿', `【${options[correct_answer_index]}】`)}</p>
      </div>
      
      {!isCorrect && (
        <div className="mt-4">
          <p>あなたの回答: <span className="font-semibold">{options[selectedOptionIndex]}</span></p>
          <p>正解: <span className="font-semibold">{options[correct_answer_index]}</span></p>
        </div>
      )}
      
      <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{explanation.title}</h3>
        <p><strong className="text-blue-600 dark:text-blue-400">意味:</strong> {explanation.meaning}</p>
        <p><strong className="text-green-600 dark:text-green-400">解説:</strong> {explanation.why_correct}</p>
        
        <div>
          <h4 className="font-bold mb-2 text-slate-800 dark:text-slate-200">他の選択肢</h4>
          <ul className="list-disc list-inside space-y-1">
            {explanation.why_incorrect.map((reason, index) => (
                <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>

        <div>
            <h4 className="font-bold mb-2 text-slate-800 dark:text-slate-200">例文</h4>
            <ul className="space-y-2">
                {explanation.example_sentences.map((ex, index) => (
                    <li key={index} className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                        <AudioPlayer text={ex.sentence} />
                        <span>{ex.sentence}</span>
                    </li>
                ))}
            </ul>
        </div>

      </div>

      <button
        onClick={onNext}
        className="w-full mt-8 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
      >
        次の問題へ
      </button>
    </div>
  );
};

export default FeedbackView;
