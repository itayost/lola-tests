import React from 'react';
import TestForm from '../components/test/TestForm';

function TestPage({ currentUser }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Staff Assessment</h1>
      {currentUser && <TestForm currentUser={currentUser} />}
    </div>
  );
}

export default TestPage;