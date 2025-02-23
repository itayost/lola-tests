import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';
import { getTestResults } from '../../services/test-results';

const TestResultsList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedResult, setExpandedResult] = useState(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const fetchedResults = await getTestResults();
      console.log('Fetched results:', fetchedResults); // Debug log
      setResults(fetchedResults);
    } catch (error) {
      console.error('Error loading results:', error);
      setError('Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(result => 
    result.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (resultId) => {
    setExpandedResult(expandedResult === resultId ? null : resultId);
  };

  if (loading) return <div>Loading results...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      
      {filteredResults.map((result) => (
        <Card key={result.id} className="w-full">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Name: {result.userName}</p>
                <p className="text-sm text-gray-600">
                  Completed: {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-lg">
                  Score: {result.score.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">
                  {result.correctAnswers} / {result.totalQuestions} correct
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="w-full mt-4 flex items-center justify-center"
              onClick={() => toggleExpand(result.id)}
            >
              {expandedResult === result.id ? (
                <>Hide Answers <ChevronUp className="ml-2 h-4 w-4" /></>
              ) : (
                <>Review Answers <ChevronDown className="ml-2 h-4 w-4" /></>
              )}
            </Button>

            {expandedResult === result.id && (
              <div className="mt-4 space-y-4 border-t pt-4">
                {result.answersData?.map((answer, index) => {
                  const isCorrect = answer.selectedAnswer === answer.correctAnswer;
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium mb-2">
                            Question {index + 1}: {answer.questionText}
                          </p>
                          <div className="space-y-2">
                            {answer.options.map((option, optionIndex) => (
                              <div 
                                key={optionIndex}
                                className={`p-2 rounded ${
                                  optionIndex === answer.selectedAnswer 
                                    ? isCorrect 
                                      ? 'bg-green-50 text-green-700'
                                      : 'bg-red-50 text-red-700'
                                    : optionIndex === answer.correctAnswer && !isCorrect
                                      ? 'bg-green-50 text-green-700'
                                      : ''
                                }`}
                              >
                                <div className="flex items-center">
                                  {optionIndex === answer.selectedAnswer && (
                                    isCorrect 
                                      ? <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                      : <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                  )}
                                  <span>{option}</span>
                                </div>
                                {optionIndex === answer.correctAnswer && !isCorrect && (
                                  <span className="text-sm text-green-600 mt-1 block">
                                    ← Correct answer
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {filteredResults.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">
              {searchTerm ? 'No results found' : 'No tests completed yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestResultsList;