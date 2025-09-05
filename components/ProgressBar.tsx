
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 my-4">
      <div
        className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
       <p className="text-center text-xs font-medium text-slate-600 dark:text-slate-300 -mt-4">
        {current} / {total}
      </p>
    </div>
  );
};

export default ProgressBar;
