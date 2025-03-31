// App.jsx
import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigateBack = () => {
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'test':
        return <TestPage onBack={handleNavigateBack} />;
      case 'admin':
        return <AdminPage onBack={handleNavigateBack} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
};

export default App;