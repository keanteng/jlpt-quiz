
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, type QuizQuestion, type UserAnswer } from './types';
import { generateQuizQuestions } from './services/geminiService';
import QuizView from './components/QuizView';
import FeedbackView from './components/FeedbackView';
import ResultsView from './components/ResultsView';
import LoadingSpinner from './components/LoadingSpinner';

const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="w-full max-w-xl p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">JLPT N2 文法・語彙クイズ</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            日本語能力試験N2合格に向けて、実践的な問題で実力を試しましょう。
            詳細な解説と音声機能で、あなたの学習を徹底サポートします。
        </p>
        <button
            onClick={onStart}
            className="mt-8 py-3 px-8 bg-blue-600 text-white font-bold text-lg rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 duration-200"
        >
            クイズを始める
        </button>
    </div>
);


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [incorrectQuestionHistory, setIncorrectQuestionHistory] = useState<string[]>([]);

  const fetchQuestions = useCallback(async () => {
    setAppState(AppState.LOADING);
    setError(null);
    try {
      const newQuestions = await generateQuizQuestions(incorrectQuestionHistory);
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setAppState(AppState.QUIZ);
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました。");
      setAppState(AppState.WELCOME); // エラー時はウェルカム画面に戻す
    }
  }, [incorrectQuestionHistory]);
  
  const handleStartQuiz = () => {
      fetchQuestions();
  };

  const handleAnswer = (selectedOptionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correct_answer_index === selectedOptionIndex;
    
    if (!isCorrect) {
        setIncorrectQuestionHistory(prev => {
            const newHistory = new Set([...prev, currentQuestion.id]);
            return Array.from(newHistory);
        });
    }

    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedOptionIndex,
        isCorrect,
      }
    ]);
    setAppState(AppState.FEEDBACK);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAppState(AppState.QUIZ);
    } else {
      setAppState(AppState.RESULTS);
    }
  };

  const handleRestart = () => {
    fetchQuestions();
  };

  const handleReviewIncorrect = () => {
    const incorrectAnswers = userAnswers.filter(a => !a.isCorrect);
    const incorrectQuestions = incorrectAnswers.map(a => questions.find(q => q.id === a.questionId)).filter(Boolean) as QuizQuestion[];

    if (incorrectQuestions.length > 0) {
        setQuestions(incorrectQuestions);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setAppState(AppState.QUIZ);
    }
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.LOADING:
        return <LoadingSpinner />;
      case AppState.QUIZ:
        return questions.length > 0 ? (
          <QuizView
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
        ) : <WelcomeScreen onStart={handleStartQuiz} />;
      case AppState.FEEDBACK:
        return (
          <FeedbackView
            question={questions[currentQuestionIndex]}
            userAnswer={userAnswers[currentQuestionIndex]}
            onNext={handleNext}
          />
        );
      case AppState.RESULTS:
        return (
          <ResultsView
            userAnswers={userAnswers}
            questions={questions}
            onRestart={handleRestart}
            onReview={handleReviewIncorrect}
          />
        );
      case AppState.WELCOME:
      default:
        return <WelcomeScreen onStart={handleStartQuiz} />;
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      {error && (
          <div className="absolute top-4 w-full max-w-xl p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-red-900 dark:text-red-200" role="alert">
              <span className="font-medium">エラー:</span> {error}
          </div>
      )}
      {renderContent()}
      <footer className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} JLPT N2 完全没入型クイズ. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default App;
