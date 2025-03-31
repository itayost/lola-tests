// pages/HomePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList,
  Users,
  Settings,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const HomePage = ({ onNavigate }) => {
  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Lola Staff Training Platform</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Test your knowledge and improve your service skills
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                onClick={() => handleNavigation('test')}
                className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-lg py-6 px-8"
                size="lg"
              >
                <ClipboardList className="mr-2 h-5 w-5" />
                Take a Test
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleNavigation('admin')}
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg py-6 px-8"
                size="lg"
              >
                <Settings className="mr-2 h-5 w-5" />
                Admin Portal
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* How it works section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 font-bold text-xl">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Choose a Test Type</h3>
                  <p className="text-gray-600">
                    Select between a practice test to prepare or an official assessment for certification.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 font-bold text-xl">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Complete the Questions</h3>
                  <p className="text-gray-600">
                    Answer all questions within the time limit. You can navigate back and forth between questions.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 font-bold text-xl">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Review Your Results</h3>
                  <p className="text-gray-600">
                    Get instant feedback on your performance. Review correct answers and explanations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                onClick={() => handleNavigation('test')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Get Started Now
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Lola Restaurant | Staff Training Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;