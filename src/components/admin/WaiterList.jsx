// components/admin/WaiterList.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Pencil, Trash } from 'lucide-react';
import { getAllWaiters, deleteWaiter } from '../../services/waiters';

export const WaiterList = ({ onEdit }) => {
  const [waiters, setWaiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteInProgress, setDeleteInProgress] = useState(null);

  useEffect(() => {
    loadWaiters();
  }, []);

  const loadWaiters = async () => {
    setLoading(true);
    setError('');
    try {
      const fetchedWaiters = await getAllWaiters();
      setWaiters(fetchedWaiters);
    } catch (error) {
      console.error('Error loading waiters:', error);
      setError('Failed to load waiters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (waiterId) => {
    if (!window.confirm('Are you sure you want to remove this waiter?')) return;
    
    setDeleteInProgress(waiterId);
    try {
      await deleteWaiter(waiterId);
      setWaiters(waiters.filter(w => w.id !== waiterId));
    } catch (error) {
      console.error('Error deleting waiter:', error);
      setError('Failed to delete waiter. Please try again.');
    } finally {
      setDeleteInProgress(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center">
            <p className="text-gray-500">Loading waiters...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waiters List</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          {waiters.map((waiter) => (
            <div key={waiter.id} className="p-4 border rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{waiter.name}</p>
                  <p className="text-sm text-gray-500">{waiter.employeeId}</p>
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(waiter)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(waiter.id)}
                    disabled={deleteInProgress === waiter.id}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    {deleteInProgress === waiter.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {waiters.length === 0 && !error && (
            <div className="text-center py-8">
              <p className="text-gray-500">No waiters added yet</p>
              <p className="text-sm text-gray-400 mt-1">Click the "Add Waiter" button to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};