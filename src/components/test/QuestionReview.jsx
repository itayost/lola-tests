// components/test/QuestionReview.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, ArrowLeft, ChevronLeft, ChevronRight, CheckSquare, AlertCircle, Search, Home } from 'lucide-react';
import { Input } from '../ui/input';

const QuestionReview = ({ questions = [], answers = {}, onHide }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [filterType, setFilterType] = useState('all'); // 'all', 'correct', 'incorrect'
  const [searchTerm, setSearchTerm] = useState('');

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No questions available for review.</p>
            <Button 
              onClick={onHide}
              className="mt-4"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredQuestions = questions.filter((question, index) => {
    const isCorrect = answers[index] === question.correctAnswer;
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'correct' && isCorrect) || 
      (filterType === 'incorrect' && !isCorrect);
    
    const matchesSearch = 
      !searchTerm || 
      question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.options.some(option => option.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const getQuestionIndex = (filteredIndex) => {
    return questions.findIndex((q, i) => 
      q === filteredQuestions[filteredIndex]
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderQuestion = () => {
    if (filteredQuestions.length === 0) {
      return (
        <div className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No questions match your filters.</p>
          <Button 
            variant="outline"
            onClick={() => {
              setFilterType('all');
              setSearchTerm('');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      );
    }

    const question = filteredQuestions[currentQuestion];
    const originalIndex = getQuestionIndex(currentQuestion);
    const userAnswer = answers[originalIndex];
    const isCorrect = userAnswer === question.correctAnswer;

    return (
      <>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <CardTitle className="text-lg">Question {originalIndex + 1}</CardTitle>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isCorrect ? 'Correct' : 'Incorrect'}
            </div>
          </div>
          <p className="text-lg font-medium">{question.text}</p>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => {
              const isUserSelection = optionIndex === userAnswer;
              const isCorrectAnswer = optionIndex === question.correctAnswer;
              
              let className = "p-4 rounded-lg border ";
              
              if (isUserSelection && isCorrectAnswer) {
                className += "bg-green-50 border-green-300";
              } else if (isUserSelection) {
                className += "bg-red-50 border-red-300";
              } else if (isCorrectAnswer) {
                className += "bg-blue-50 border-blue-300";
              } else {
                className += "bg-gray-50 border-gray-200";
              }
              
              return (
                <div key={optionIndex} className={className}>
                  <div className="flex items-center">
                    {isUserSelection && isCorrectAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    )}
                    {isUserSelection && !isCorrectAnswer && (
                      <XCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                    )}
                    {!isUserSelection && isCorrectAnswer && (
                      <CheckSquare className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                    )}
                    <span className={isCorrectAnswer ? "font-medium" : ""}>{option}</span>
                  </div>
                  {isCorrectAnswer && !isUserSelection && (
                    <p className="text-sm text-blue-600 mt-2 ml-7">
                      This was the correct answer
                    </p>
                  )}
                  {isUserSelection && !isCorrectAnswer && (
                    <p className="text-sm text-red-600 mt-2 ml-7">
                      You selected this answer
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </>
    );
  };

  // Calculate statistics
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter((q, i) => answers[i] === q.correctAnswer).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onHide}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </Button>
        
        <div className="text-sm text-gray-500">
          Showing {currentQuestion + 1} of {filteredQuestions.length} 
          {filteredQuestions.length !== totalQuestions && ` (filtered from ${totalQuestions})`}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm" 
            onClick={() => setFilterType('all')}
            className="text-xs h-8"
          >
            All ({totalQuestions})
          </Button>
          <Button 
            variant={filterType === 'correct' ? 'default' : 'outline'}
            size="sm" 
            onClick={() => setFilterType('correct')}
            className="text-xs h-8"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Correct ({correctAnswers})
          </Button>
          <Button 
            variant={filterType === 'incorrect' ? 'default' : 'outline'}
            size="sm" 
            onClick={() => setFilterType('incorrect')}
            className="text-xs h-8"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Incorrect ({incorrectAnswers})
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
      </div>

      <Card className="border-0 shadow-md">
        {renderQuestion()}
        
        <CardFooter className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={handlePreviousQuestion} 
            disabled={currentQuestion === 0}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <Button
            variant="outline"
            onClick={onHide}
            className="flex items-center mx-2"
          >
            <Home className="h-4 w-4 mr-1" />
            Exit Review
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleNextQuestion}
            disabled={currentQuestion === filteredQuestions.length - 1}
            className="flex items-center"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuestionReview;