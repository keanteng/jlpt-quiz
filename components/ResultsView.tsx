
import React from 'react';
import type { QuizQuestion, UserAnswer } from '../types';
import AudioPlayer from './AudioPlayer';

interface ResultsViewProps {
  userAnswers: UserAnswer[];
  questions: QuizQuestion[];
  onRestart: () => void;
  onReview: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ userAnswers, questions, onRestart, onReview }) => {
  const correctAnswersCount = userAnswers.filter(answer => answer.isCorrect).length;
  const totalQuestions = questions.length;
  const score = totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 0;
  
  const incorrectAnswers = userAnswers.filter(answer => !answer.isCorrect);
  const hasIncorrectAnswers = incorrectAnswers.length > 0;

  return (
    <div className="w-full max-w-3xl p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100">クイズ結果</h2>
      
      <div className="my-8 text-center">
        <p className="text-xl text-slate-600 dark:text-slate-300">あなたのスコア</p>
        <p className="text-6xl font-bold text-blue-600 dark:text-blue-400 my-2">{score}<span className="text-3xl">%</span></p>
        <p className="text-lg font-semibold">{correctAnswersCount} / {totalQuestions} 問正解</p>
      </div>

      {hasIncorrectAnswers && (
        <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">間違えた問題</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                {incorrectAnswers.map(({ questionId }) => {
                    const question = questions.find(q => q.id === questionId);
                    if (!question) return null;
                    return (
                        <div key={questionId} className="p-3 bg-white dark:bg-slate-800 rounded-md shadow-sm">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">{question.question_sentence.replace('＿＿＿', `【${question.options[question.correct_answer_index]}】`)}</p>
                              <AudioPlayer text={question.question_sentence.replace('＿＿＿', question.options[question.correct_answer_index])} />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">正解: {question.options[question.correct_answer_index]}</p>
                        </div>
                    );
                })}
            </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 mt-8">
        {hasIncorrectAnswers && (
          <button
            onClick={onReview}
            className="w-full py-3 px-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            間違えた問題だけ復習する
          </button>
        )}
        <button
          onClick={onRestart}
          className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
        >
          新しい問題セットを生成
        </button>
      </div>
    </div>
  );
};

export default ResultsView;
