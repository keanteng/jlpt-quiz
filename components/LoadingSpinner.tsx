
import React from 'react';

const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "新しい問題を生成中..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
