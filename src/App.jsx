import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { getUser } from './services/users';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser);
      
      if (firebaseUser) {
        try {
          const userData = await getUser(firebaseUser.uid);
          if (userData) {
            console.log('User data from Firestore:', userData);
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData
            });
          } else {
            console.log('No user document found');
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              isAdmin: false
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            isAdmin: false
          });
        }
      } else {
        console.log('No user signed in');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderPage = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    // Redirect non-admin users from admin page
    if (currentPage === 'admin' && (!currentUser || !currentUser.isAdmin)) {
      setCurrentPage('home');
      return null;
    }

    // Redirect non-authenticated users from test page
    if (currentPage === 'test' && !currentUser) {
      setCurrentPage('home');
      return null;
    }

    switch (currentPage) {
      case 'test':
        return <TestPage currentUser={currentUser} />;
      case 'admin':
        return <AdminPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        currentUser={currentUser} 
      />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;