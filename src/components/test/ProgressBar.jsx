// components/test/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ current, total, questionsAnswered = 0 }) => {
  const progress = (current / total) * 100;
  const answeredProgress = (questionsAnswered / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Question {current} of {total}</span>
        <span className="flex items-center">
          <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-1.5"></span>
          {questionsAnswered} of {total} answered
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative">
        {/* Track of answered questions */}
        <div
          className="absolute top-0 left-0 h-full bg-green-100 transition-all duration-300"
          style={{ width: `${answeredProgress}%` }}
        />
        
        {/* Current position indicator */}
        <div 
          className="absolute top-0 left-0 h-full bg-blue-500 w-1.5 transition-all duration-300"
          style={{ left: `${progress - 0.75}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;