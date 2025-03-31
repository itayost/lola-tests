// pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminPage = ({ onBack }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AdminLogin 
        onLoginSuccess={() => setUser(auth.currentUser)}
        onBack={onBack}
      />
    );
  }

  return <AdminDashboard onBack={onBack} />;
};

export default AdminPage;