import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AdminLogin from '../components/admin/AdminLogin';
import QuestionList from '../components/admin/QuestionList';
import QuestionForm from '../components/admin/QuestionForm';
import TestResultsList from '../components/admin/TestResultsList';
import UserManagement from '../components/admin/UserManagement';
import { Button } from '../components/ui/button';
import { signOut } from '../services/auth';
import { getUser } from '../services/users';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState('questions');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await getUser(firebaseUser.uid);
          if (!userData?.isAdmin) {
            window.location.href = '/';
            return;
          }
          setUser(userData);
        } catch (error) {
          console.error('Error getting user data:', error);
          window.location.href = '/';
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleQuestionSubmit = () => {
    setShowForm(false);
    setSelectedQuestion(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return <AdminLogin onLoginSuccess={() => setUser(auth.currentUser)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'questions':
        return (
          <div>
            {!showForm && (
              <div className="mb-4">
                <Button onClick={() => setShowForm(true)}>Add Question</Button>
              </div>
            )}
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
      case 'results':
        return <TestResultsList />;
      case 'users':
        return <UserManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      <div className="mb-6 flex space-x-4">
        <Button
          variant={activeTab === 'questions' ? 'default' : 'outline'}
          onClick={() => setActiveTab('questions')}
        >
          Question Bank
        </Button>
        <Button
          variant={activeTab === 'results' ? 'default' : 'outline'}
          onClick={() => setActiveTab('results')}
        >
          Test Results
        </Button>
        <Button
          variant={activeTab === 'users' ? 'default' : 'outline'}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </Button>
      </div>

      {renderContent()}
    </div>
  );
};

export default AdminPage;