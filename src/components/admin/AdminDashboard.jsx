// components/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { signOut } from '../../services/auth';
import QuestionList from './QuestionList';
import QuestionForm from './QuestionForm';
import { WaiterList } from './WaiterList';
import { WaiterForm } from './WaiterForm';
import TestResultsList from './TestResultsList';
import TestConfig from './TestConfig';
import { 
  ClipboardList, 
  Users, 
  BarChart4, 
  Settings, 
  LogOut,
  Plus,
  ChevronLeft
} from 'lucide-react';

const AdminDashboard = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('questions');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut();
      if (onBack) onBack();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSubmitSuccess = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  const renderHeader = () => {
    let title = '';
    let addButtonText = '';
    
    switch (activeTab) {
      case 'questions':
        title = 'Question Management';
        addButtonText = 'Add Question';
        break;
      case 'waiters':
        title = 'Waiter Management';
        addButtonText = 'Add Waiter';
        break;
      case 'results':
        title = 'Test Results';
        break;
      case 'settings':
        title = 'Test Configuration';
        break;
      default:
        title = 'Dashboard';
    }

    return (
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div className="flex gap-2">
          {(activeTab === 'questions' || activeTab === 'waiters') && !showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {addButtonText}
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout} className="ml-2">
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === 'questions') {
      if (showForm) {
        return (
          <QuestionForm
            question={selectedItem}
            onSuccess={handleSubmitSuccess}
            onCancel={() => {
              setShowForm(false);
              setSelectedItem(null);
            }}
          />
        );
      }
      return (
        <QuestionList
          onEdit={(question) => {
            setSelectedItem(question);
            setShowForm(true);
          }}
        />
      );
    }
    
    if (activeTab === 'waiters') {
      if (showForm) {
        return (
          <WaiterForm
            waiter={selectedItem}
            onSuccess={handleSubmitSuccess}
            onCancel={() => {
              setShowForm(false);
              setSelectedItem(null);
            }}
          />
        );
      }
      return (
        <WaiterList
          onEdit={(waiter) => {
            setSelectedItem(waiter);
            setShowForm(true);
          }}
        />
      );
    }
    
    if (activeTab === 'results') {
      return <TestResultsList />;
    }
    
    if (activeTab === 'settings') {
      return <TestConfig />;
    }
    
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {renderHeader()}
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 shrink-0 flex flex-col">
          <Card className="flex-grow">
            <CardContent className="p-4">
              <Tabs
                orientation="vertical"
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value);
                  setShowForm(false);
                  setSelectedItem(null);
                }}
                className="w-full"
              >
                <TabsList className="flex flex-row md:flex-col justify-start w-full bg-transparent space-y-0 md:space-y-1 p-0">
                  <TabsTrigger 
                    value="questions" 
                    className="w-full justify-start data-[state=active]:bg-blue-50"
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    <span>Questions</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="waiters" 
                    className="w-full justify-start data-[state=active]:bg-blue-50"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    <span>Waiters</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="results" 
                    className="w-full justify-start data-[state=active]:bg-blue-50"
                  >
                    <BarChart4 className="h-4 w-4 mr-2" />
                    <span>Test Results</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="w-full justify-start data-[state=active]:bg-blue-50"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;