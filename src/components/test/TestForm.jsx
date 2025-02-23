import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import Question from './Question';
import { getRandomQuestions } from '../../services/questions';
import { saveTestResult } from '../../services/test-results';

const TestForm = ({ currentUser }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testComplete, setTestComplete] = useState(false);
  const [score, setScore] = useState(null);

  const startTest = async () => {
    setLoading(true);
    setError('');

    try {
      const fetchedQuestions = await getRandomQuestions(15);
      setQuestions(fetchedQuestions);
      setCurrentQuestion(0);
      setAnswers({});
    } catch (error) {
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

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = async () => {
    setLoading(true);
    
    try {
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      const scorePercentage = (correctAnswers / questions.length) * 100;
      setScore(scorePercentage);

      // Save the test result
      await saveTestResult({
        userName: currentUser.name,
        userId: currentUser.uid,
        email: currentUser.email,
        score: scorePercentage,
        answers: questions.reduce((acc, question, index) => {
          acc[question.id] = answers[index];
          return acc;
        }, {}),
        totalQuestions: questions.length,
        correctAnswers,
        answersData: questions.map((question, index) => ({
          questionText: question.text,
          selectedAnswer: answers[index],
          correctAnswer: question.correctAnswer,
          options: question.options
        }))
      });

      setTestComplete(true);
    } catch (error) {
      console.error('Error saving test result:', error);
      setError('Failed to save test results: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (testComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Complete</CardTitle>
          <CardDescription>
            Thank you for completing the test, {currentUser.name}!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold">
              Your Score: {score.toFixed(1)}%
            </p>
            <p>
              You answered {Math.round((score / 100) * questions.length)} out of {questions.length} questions correctly.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {questions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Start Test</CardTitle>
            <CardDescription>Welcome, {currentUser.name}!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button 
              className="w-full" 
              onClick={startTest}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Start Test'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Question
            key={`question-${currentQuestion}`}
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
          />
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0 || loading}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined || loading}
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default TestForm;