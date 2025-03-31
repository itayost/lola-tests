// components/test/PracticeTest.jsx
import React, { useState, useEffect } from 'react';
import Question from './Question';
import QuestionReview from './QuestionReview';
import TestResults from './TestResults';
import TestTimer from './TestTimer';
import ProgressBar from './ProgressBar';
import { Button } from '../ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '../ui/card';
import { getRandomQuestions } from '../../services/questions';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const PracticeTest = ({ config, onComplete, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testComplete, setTestComplete] = useState(false);
  const [score, setScore] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(0);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const fetchedQuestions = await getRandomQuestions(config.numberOfQuestions);
      setQuestions(config.randomizeQuestions ? shuffleArray(fetchedQuestions) : fetchedQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load questions. Please try again later.');
      setLoading(false);
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    // Calculate unanswered questions
    const answeredCount = Object.keys(answers).length;
    setRemainingQuestions(questions.length - answeredCount);
  }, [answers, questions]);

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      window.scrollTo(0, 0);
    } else {
      if (Object.keys(answers).length < questions.length) {
        setShowConfirmFinish(true);
      } else {
        finishTest();
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo(0, 0);
    }
  };

  const finishTest = () => {
    setShowConfirmFinish(false);
    const correctAnswers = questions.filter((q, index) => q.correctAnswer === answers[index]).length;
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setTestComplete(true);
    window.scrollTo(0, 0);
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestion(index);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <Card className="max-w-3xl mx-auto border-0 shadow-md">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading practice test questions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-3xl mx-auto border-0 shadow-md">
        <CardContent className="p-8">
          <div className="text-center text-red-500 flex flex-col items-center">
            <AlertCircle className="h-12 w-12 mb-4" />
            <p className="mb-4">{error}</p>
            <Button onClick={() => loadQuestions()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
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
        name="Practice"
        score={score}
        totalQuestions={questions.length}
        questions={questions}
        answers={answers}
        passingScore={config.passingScore}
        onBack={onBack}
        showReviewButton={true}
        onReview={() => setShowReview(true)}
        isPractice={true}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress and timer */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <TestTimer timeLimit={config.timeLimit} onTimeUp={finishTest} />
            <ProgressBar current={currentQuestion + 1} total={questions.length} questionsAnswered={answers} />
          </div>
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
        questionNumber={currentQuestion + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        currentAnswer={answers[currentQuestion]}
      />

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePreviousQuestion} 
          disabled={currentQuestion === 0}
          className="px-4 py-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <Button 
          onClick={handleNextQuestion}
          className="px-4 py-2"
        >
          {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          {currentQuestion < questions.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>
      </div>
      
      {/* Confirmation modal */}
      {showConfirmFinish && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle>Finish Test?</CardTitle>
              <CardDescription>
                You still have {remainingQuestions} unanswered {remainingQuestions === 1 ? 'question' : 'questions'}.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-gray-600">
                Unanswered questions will be marked as incorrect. Do you want to review your answers before submitting?
              </p>
            </CardContent>
            <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmFinish(false)}
                className="flex-1"
              >
                Continue Test
              </Button>
              <Button 
                onClick={finishTest}
                className="flex-1"
              >
                Submit Test
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PracticeTest;