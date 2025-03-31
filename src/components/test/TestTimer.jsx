// components/test/TestTimer.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock } from 'lucide-react';

const TestTimer = ({ timeLimit, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds
  const [isWarning, setIsWarning] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  useEffect(() => {
    // Show warning when less than 5 minutes remaining
    setIsWarning(timeLeft <= 300 && timeLeft > 60);
    // Urgent warning when less than 1 minute remaining
    setIsUrgent(timeLeft <= 60);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (isUrgent) return 'bg-red-500 text-white';
    if (isWarning) return 'bg-amber-500 text-white';
    return 'bg-blue-100 text-blue-800';
  };

  const getTimerAnimation = () => {
    if (isUrgent) return 'animate-pulse';
    return '';
  };

  const getTimerIcon = () => {
    if (isUrgent || isWarning) {
      return <AlertCircle className="h-4 w-4 mr-2" />;
    }
    return <Clock className="h-4 w-4 mr-2" />;
  };

  // Calculate progress percentage
  const totalTimeInSeconds = timeLimit * 60;
  const percentageLeft = (timeLeft / totalTimeInSeconds) * 100;

  return (
    <div className="mb-6">
      <div className={`relative rounded-full h-10 overflow-hidden border shadow-sm ${
        isUrgent ? 'border-red-600' : isWarning ? 'border-amber-600' : 'border-gray-200'
      }`}>
        {/* Background progress bar */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-100 to-blue-200 transition-all duration-1000"
          style={{ width: `${percentageLeft}%` }}
        ></div>
        
        {/* Timer text */}
        <div 
          className={`absolute top-0 left-0 w-full h-full flex items-center justify-center font-mono font-bold text-sm ${getTimerAnimation()}`}
        >
          <div className={`px-4 py-1 rounded-full flex items-center ${getTimerColor()}`}>
            {getTimerIcon()}
            <span>{formatTime(timeLeft)}</span>
            <span className="ml-2 text-xs font-normal">remaining</span>
          </div>
        </div>
      </div>
      
      {(isWarning || isUrgent) && (
        <p className={`text-xs mt-2 text-center ${
          isUrgent ? 'text-red-600' : 'text-amber-600'
        }`}>
          {isUrgent 
            ? 'Less than 1 minute remaining! Please finish your test.' 
            : 'Less than 5 minutes remaining. Please complete soon.'}
        </p>
      )}
    </div>
  );
};

export default TestTimer;