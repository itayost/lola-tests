import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { getAllQuestions, deleteQuestion } from '../../services/questions';

const QuestionList = ({ onEdit }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const fetchedQuestions = await getAllQuestions();
      setQuestions(fetchedQuestions);
    } catch (error) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await deleteQuestion(questionId);
      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (error) {
      setError('Failed to delete question');
    }
  };

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Bank</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="font-medium">{question.text}</p>
                  <div className="space-y-1">
                    {question.options.map((option, index) => (
                      <p 
                        key={index} 
                        className={`text-sm ${index === question.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}`}
                      >
                        {option}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(question)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDelete(question.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <p className="text-center text-gray-500">No questions added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionList;