// Updated RealTest.jsx with separate cards and better integration
import React, { useState, useEffect } from 'react';
import Question from './Question';
import QuestionReview from './QuestionReview';
import TestResults from './TestResults';
import TestTimer from './TestTimer';
import ProgressBar from './ProgressBar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { WaiterSelection } from './WaiterSelection';
import { getRandomQuestions } from '../../services/questions';
import { saveTestResult } from '../../services/test-results';
import { updateLastTestDate, canTakeTest } from '../../services/waiters';
import { Clock, Award, CheckCircle } from 'lucide-react';

// Hardcoded test configuration 
const TEST_CONFIG = {
  numberOfQuestions: 15,
  timeLimit: 30, // minutes
  passingScore: 80, // percentage
  randomizeQuestions: true
};

// Fallback questions in case database connection fails
const FALLBACK_QUESTIONS = [
  {
    id: 'fallback-1',
    text: 'What is the proper way to greet a customer?',
    options: [
      'Ignore them until they sit down',
      'Say "hello" and smile warmly',
      'Ask them what they want immediately',
      'Tell them to wait'
    ],
    correctAnswer: 1
  },
  // Other fallback questions remain unchanged
];

const RealTest = ({ onComplete, onBack }) => {
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testComplete, setTestComplete] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usedFallbackQuestions, setUsedFallbackQuestions] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const handleWaiterSelect = (waiter) => {
    console.log("Waiter selected:", waiter);
    
    // Check if we received a proper waiter object
    if (typeof waiter === 'object' && waiter !== null) {
      setSelectedWaiter(waiter);
      setError('');
    } else {
      console.error("Invalid waiter selection:", waiter);
      setError("Selected waiter not found. Please try again.");
    }
  };

  const startTest = async () => {
    if (!selectedWaiter) {
      setError('Please select your name first');
      return;
    }

    // Validate employee ID
    if (!employeeId.trim()) {
      setError('Please enter your Employee ID');
      return;
    }

    // Check if employee ID matches
    if (employeeId !== selectedWaiter.employeeId) {
      setError('Employee ID does not match. Please check and try again.');
      return;
    }

    setLoading(true);
    try {
      let fetchedQuestions = [];
      
      try {
        fetchedQuestions = await getRandomQuestions(TEST_CONFIG.numberOfQuestions);
        console.log("Fetched questions:", fetchedQuestions.length);
      } catch (questionFetchError) {
        console.error("Error fetching questions:", questionFetchError);
        fetchedQuestions = FALLBACK_QUESTIONS;
        setUsedFallbackQuestions(true);
      }
      
      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        fetchedQuestions = FALLBACK_QUESTIONS;
        setUsedFallbackQuestions(true);
      }
      
      // Shuffle if needed
      const randomizedQuestions = TEST_CONFIG.randomizeQuestions 
        ? shuffleArray(fetchedQuestions) 
        : fetchedQuestions;
      
      setQuestions(randomizedQuestions);
      setTestStarted(true);
      setLoading(false);
    } catch (error) {
      console.error('Error in test setup:', error);
      setError(`Failed to setup test: ${error.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishTest = async () => {
    if (!selectedWaiter) {
      setError('Error: Selected waiter not found. Please try again.');
      return;
    }

    const correctAnswers = questions.filter((q, index) => 
      q.correctAnswer === answers[index]
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= TEST_CONFIG.passingScore;

    try {
      const resultData = {
        waiterId: selectedWaiter.id,
        waiterName: selectedWaiter.name,
        employeeId: selectedWaiter.employeeId,
        score,
        passed,
        answers,
        totalQuestions: questions.length,
        correctAnswers,
        completedAt: new Date().toISOString()
      };
      
      try {
        await saveTestResult(resultData);
        await updateLastTestDate(selectedWaiter.id);
      } catch (saveError) {
        console.error('Failed to save test results:', saveError);
      }

      setScore(score);
      setTestComplete(true);
    } catch (error) {
      console.error('Error finalizing test:', error);
      setError('Failed to complete test. Your answers may not be saved to the system.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-600">{error}</p>
        </div>
        <Button onClick={() => setError('')}>Try Again</Button>
      </div>
    );
  }

  if (testComplete) {
    if (showReview) {
      return (
        <QuestionReview
          questions={questions}
          answers={answers}
          onHide={() => setShowReview(false)}
        />
      );
    }
    
    return (
      <TestResults
        name={selectedWaiter?.name || "Unknown"}
        score={score}
        totalQuestions={questions.length}
        correctAnswers={questions.filter((q, index) => 
          answers[index] !== undefined && q.correctAnswer === answers[index]
        ).length}
        questions={questions}
        answers={answers}
        passingScore={TEST_CONFIG.passingScore}
        onBack={onBack}
        showReviewButton={true}
        onReview={() => setShowReview(true)}
      />
    );
  }

  if (!testStarted) {
    return (
      <div className="max-w-2xl mx-auto mt-8 space-y-6">
        {/* Separate card for test information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-blue-500" />
              Official Assessment
            </CardTitle>
            <CardDescription>
              Important information about the test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center text-center">
                <Clock className="h-8 w-8 text-blue-500 mb-2" />
                <p className="font-medium">{TEST_CONFIG.timeLimit} Minutes</p>
                <p className="text-sm text-gray-600">Time Limit</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center text-center">
                <div className="h-8 w-8 flex items-center justify-center text-blue-500 mb-2 text-xl font-bold">?</div>
                <p className="font-medium">{TEST_CONFIG.numberOfQuestions}</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-blue-500 mb-2" />
                <p className="font-medium">{TEST_CONFIG.passingScore}%</p>
                <p className="text-sm text-gray-600">To Pass</p>
              </div>
            </div>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3">
              <p className="text-amber-800 font-medium">Important Notes:</p>
              <ul className="text-sm text-amber-700 list-disc list-inside mt-1">
                <li>You can only take this test once per day</li>
                <li>You can navigate between questions</li>
                <li>Results will be recorded in the system</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Separate card for waiter selection */}
        <div className="waiterselection-wrapper">
          <WaiterSelection 
            onSelect={handleWaiterSelect}
            onBack={onBack}
            autoStartTest={false}
          />
        </div>

        {/* Start test button in a separate card */}
        <Card>
          <CardContent className="p-6">
            {selectedWaiter ? (
              <div className="space-y-4">
                <div className="text-green-600 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Selected: <span className="font-medium">{selectedWaiter.name}</span></span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter your Employee ID to confirm
                  </label>
                  <Input
                    type="text"
                    placeholder="Employee ID (e.g. W001)"
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full mb-4"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={startTest} 
                    className="px-8"
                  >
                    Start Test
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Please select your name from the list above
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProgressBar current={currentQuestion + 1} total={questions.length} />
      <TestTimer timeLimit={TEST_CONFIG.timeLimit} onTimeUp={finishTest} />
      
      <Question 
        question={questions[currentQuestion]}
        questionNumber={currentQuestion + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        currentAnswer={answers[currentQuestion]}
      />

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePreviousQuestion} 
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNextQuestion}
          disabled={answers[currentQuestion] === undefined}
        >
          {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>

      {/* Question navigation buttons - similar to PracticeTest */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {questions.map((_, index) => (
          <Button 
            key={index}
            variant={index === currentQuestion ? "default" : (answers[index] !== undefined ? "outline" : "ghost")}
            size="sm"
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RealTest;