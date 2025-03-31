import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, Home, RefreshCw, Award, BarChart3 } from 'lucide-react';

const TestResults = ({ 
  name = "User", 
  score = 0, 
  totalQuestions = 0, 
  correctAnswers = 0, 
  passingScore = 70, 
  questions = [], 
  answers = {},
  onBack,
  showReviewButton = false,
  onReview = () => {},
  isPractice = false
}) => {
  // Ensure all values have defaults to prevent undefined errors
  const safeScore = score || 0;
  const safeTotal = totalQuestions || 1; // Prevent division by zero
  const safeCorrect = correctAnswers || 0;
  const safePassing = passingScore || 70;
  
  // Format score with one decimal place
  const formattedScore = typeof safeScore === 'number' ? safeScore.toFixed(1) : '0.0';
  
  // Determine if passed
  const passed = safeScore >= safePassing;

  // Calculate the percentage for the circular progress indicator
  const circumference = 2 * Math.PI * 45; // 45 is the radius
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className={`h-2 w-full ${passed ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <CardHeader className="text-center pt-8 pb-6">
          <div className="mx-auto mb-6">
            {passed ? (
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 text-green-600">
                <Award className="h-10 w-10" />
              </div>
            ) : (
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 text-red-600">
                <XCircle className="h-10 w-10" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl md:text-3xl">
            {passed ? 'Congratulations!' : 'Test Completed'}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {isPractice 
              ? 'You have completed the practice test' 
              : passed 
                ? 'You have passed the assessment!' 
                : 'You did not meet the passing criteria'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32">
                  <circle
                    className="text-gray-200"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="60"
                    cy="60"
                  />
                  <circle
                    className={`${passed ? 'text-green-500' : 'text-red-500'}`}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="60"
                    cy="60"
                  />
                </svg>
                <span className="absolute text-3xl font-bold">{formattedScore}%</span>
              </div>
              <p className="mt-4 text-gray-600">Your Score</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Correct Answers:</span>
                  <span className="font-medium">{safeCorrect} of {safeTotal}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Passing Score:</span>
                  <span className="font-medium">{safePassing}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Result:</span>
                  <span className={`font-medium ${passed ? 'text-green-600' : 'text-red-600'}`}>
                    {passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                passed ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <p className="font-medium">
                  {passed 
                    ? 'You have successfully completed this assessment. Great job!' 
                    : `You need ${safePassing - safeScore > 0 ? (safePassing - safeScore).toFixed(1) : 0}% more to pass. Keep practicing!`}
                </p>
              </div>
            </div>
          </div>
          
          {!isPractice && passed && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 mb-6">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 mt-0.5 mr-3 text-blue-500 shrink-0" />
                <div>
                  <p className="font-medium mb-1">Certificate Available</p>
                  <p className="text-sm text-blue-700">
                    Your completion has been recorded. You can access your certificate from your profile.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col md:flex-row gap-3 pt-0">
          <Button 
            variant="outline" 
            className="flex items-center w-full md:w-auto"
            onClick={onBack || (() => {})}
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          {showReviewButton && (
            <Button 
              className="flex items-center w-full md:w-auto"
              onClick={onReview}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Review Answers
            </Button>
          )}
          
          {!passed && !isPractice && (
            <Button 
              className="flex items-center w-full md:w-auto"
              variant="secondary"
              onClick={onBack || (() => {})}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again Tomorrow
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestResults;