import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { addQuestion, updateQuestion } from '../../services/questions';

const QuestionForm = ({ question = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    text: question?.text || '',
    options: question?.options || ['', '', '', ''],
    correctAnswer: question?.correctAnswer || 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (question?.id) {
        await updateQuestion(question.id, formData);
      } else {
        await addQuestion(formData);
      }
      onSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question ? 'Edit Question' : 'Add New Question'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Question text"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-4">
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...formData.options];
                    newOptions[index] = e.target.value;
                    setFormData(prev => ({ ...prev, options: newOptions }));
                  }}
                  placeholder={`Option ${index + 1}`}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    correctAnswer: index
                  }))}
                  className={formData.correctAnswer === index ? 'bg-green-100' : ''}
                  disabled={loading}
                >
                  Correct
                </Button>
              </div>
            ))}
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : (question ? 'Update' : 'Create')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionForm;