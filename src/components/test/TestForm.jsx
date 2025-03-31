// components/test/TestForm.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Question from './Question';
import TestResults from './TestResults';
import { getRandomQuestions } from '../../services/questions';
import { updateLastTestDate } from '../../services/waiters';
import { saveTestResult } from '../../services/test-results';
import { AlertCircle, User, ArrowLeft, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import ProgressBar from './ProgressBar';

const TestForm = ({ isPractice, waiter, onBack }) => {
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testComplete, setTestComplete] = useState(false);
  const [score, setScore] = useState(null);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const startTest = async () => {
    if (isPractice && !name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fetchedQuestions = await getRandomQuestions(15);
      setQuestions(fetchedQuestions);
      setCurrentQuestion(0);
      setAnswers({});
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNavigate = (direction) => {
    if (direction === 'next') {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        finishTest();
      }
    } else if (direction === 'prev') {
      if (currentQuestion > 0) {
        setCurrentQuestion(prev => Math.max(0, prev - 1));
        window.scrollTo(0, 0);
      }
    }
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestion(index);
    window.scrollTo(0, 0);
  };

  const finishTest = async () => {
    setSubmitInProgress(true);
    setLoading(true);
    setError('');
    
    try {
      // Calculate score
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      const scorePercentage = Math.round((correctAnswers / questions.length) * 100);
      setScore(scorePercentage);

      if (!isPractice && waiter) {
        const testData = {
          waiterId: waiter.id,
          waiterName: waiter.name,
          employeeId: waiter.employeeId,
          score: scorePercentage,
          correctAnswers,
          totalQuestions: questions.length,
          answers,
          questions
        };

        await saveTestResult(testData);
        await updateLastTestDate(waiter.id);
      }

      setTestComplete(true);
      window.scrollTo(0, 0);

    } catch (error) {
      console.error('Test completion error:', error);
      setError(`Failed to save test results: ${error.message}`);
    } finally {
      setLoading(false);
      setSubmitInProgress(false);
    }
  };

  if (testComplete) {
    return (
      <TestResults
        name={isPractice ? name : waiter.name}
        score={score}
        totalQuestions={questions.length}
        questions={questions}
        answers={answers}
        passingScore={70}
        onBack={onBack}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle>{isPractice ? 'Practice Test' : 'Official Test'}</CardTitle>
            <CardDescription>
              {isPractice 
                ? 'This is a practice test to help you prepare'
                : `Welcome ${waiter.name}, please click start when you're ready`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isPractice && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Enter your name to begin
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800">
              <div className="flex">
                <Info className="h-5 w-5 mr-3 shrink-0 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-medium mb-1">Test Information</p>
                  <ul className="text-sm space-y-1 list-disc ml-4">
                    <li>This test contains 15 multiple choice questions</li>
                    <li>You can navigate between questions freely</li>
                    <li>Your answers are saved as you go</li>
                    {!isPractice && <li>Results will be recorded in your profile</li>}
                  </ul>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                disabled={loading}
                className="flex-1 flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={startTest}
                disabled={loading || (isPractice && !name.trim())}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Loading...
                  </>
                ) : 'Start Test'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress tracker */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <ProgressBar current={currentQuestion + 1} total={questions.length} questionsAnswered={answers} />
        </CardContent>
      </Card>
      
      {/* Quick navigation */}
      <div className="bg-white p-3 rounded-lg border shadow-sm">
        <div className="flex flex-wrap gap-2 justify-center">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => navigateToQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center transition-colors
                ${currentQuestion === index 
                  ? 'bg-blue-500 text-white' 
                  : Object.prototype.hasOwnProperty.call(answers, index)
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    
      {/* Question */}
      <Question
        question={questions[currentQuestion]}
        onAnswer={handleAnswer}
        currentAnswer={answers[currentQuestion]}
        questionNumber={currentQuestion + 1}
        totalQuestions={questions.length}
      />
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => handleNavigate('prev')}
          disabled={currentQuestion === 0 || loading}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <Button
          onClick={() => handleNavigate('next')}
          disabled={answers[currentQuestion] === undefined || loading}
          className="flex items-center"
        >
          {currentQuestion === questions.length - 1 ? (
            submitInProgress ? 'Submitting...' : 'Finish'
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TestForm;