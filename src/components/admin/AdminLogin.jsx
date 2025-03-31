// components/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { signIn } from '../../services/auth';
import { Lock, Mail, ArrowLeft, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const user = await signIn(email, password);
      if (user) {
        onLoginSuccess(user);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-2 w-full bg-blue-600"></div>
        <CardHeader className="text-center pt-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription className="mt-2">
            Please enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="border-t py-4 bg-gray-50">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="flex items-center mx-auto text-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;