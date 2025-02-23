import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import QuestionList from './QuestionList';
import QuestionForm from './QuestionForm';

const ManageQuestions = ({ onBack }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleQuestionSubmit = () => {
    setShowForm(false);
    setSelectedQuestion(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Question Management</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={onBack}
          >
            Back to Dashboard
          </Button>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              Add Question
            </Button>
          )}
        </div>
      </div>

      {showForm ? (
        <QuestionForm
          question={selectedQuestion}
          onSuccess={handleQuestionSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedQuestion(null);
          }}
        />
      ) : (
        <QuestionList
          onEdit={(question) => {
            setSelectedQuestion(question);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
};

export default ManageQuestions;