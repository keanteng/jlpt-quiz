
import React from 'react';
import type { QuizQuestion } from '../types';
import ProgressBar from './ProgressBar';
import AudioPlayer from './AudioPlayer';

interface QuizViewProps {
  question: QuizQuestion;
  onAnswer: (selectedOptionIndex: number) => void;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const QuizView: React.FC<QuizViewProps> = ({ question, onAnswer, currentQuestionIndex, totalQuestions }) => {
  return (
    <div className="w-full max-w-2xl p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg animate-fade-in">
      <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
      <div className="mt-6">
        <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-200 rounded-full mb-4">
          {question.type}
        </span>
        <div className="flex items-center space-x-2">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
              {question.question_sentence}
            </h2>
            <AudioPlayer text={question.question_sentence} />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className="w-full text-left p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            <span className="mr-4 font-bold text-blue-600 dark:text-blue-400">{index + 1}.</span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizView;
