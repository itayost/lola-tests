import React from 'react';

const ProgressBar = ({ current, total, answers }) => {
  const progress = (Object.keys(answers).length / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress: {Math.round(progress)}%</span>
        <span>Answered: {Object.keys(answers).length}/{total}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;