import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { signIn, signOut } from '../../services/auth';

const Header = ({ currentPage, onNavigate, currentUser }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      setShowLoginForm(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Lola Tests</h1>
          
          <nav className="flex items-center space-x-4">
            <Button 
              variant={currentPage === 'home' ? 'default' : 'outline'}
              onClick={() => onNavigate('home')}
            >
              Home
            </Button>
            
            {currentUser && (
              <>
                <Button 
                  variant={currentPage === 'test' ? 'default' : 'outline'}
                  onClick={() => onNavigate('test')}
                >
                  Take Test
                </Button>
                
                {currentUser.isAdmin === true && (
                  <Button 
                    variant={currentPage === 'admin' ? 'default' : 'outline'}
                    onClick={() => onNavigate('admin')}
                  >
                    Admin Panel
                  </Button>
                )}
              </>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {currentUser.email}
                  {currentUser.isAdmin === true && " (Admin)"}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowLoginForm(!showLoginForm)}>
                Login
              </Button>
            )}
          </nav>
        </div>
      </div>

      {/* Login Form Dropdown */}
      {showLoginForm && !currentUser && (
        <div className="absolute top-full right-0 mt-2 mr-4 z-50">
          <Card className="w-80">
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </header>
  );
};

export default Header;