// services/firebase-config-check.js
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export const checkFirebaseConnection = async () => {
  try {
    // First, log the database instance
    console.log('Firestore instance:', db);
    
    // Try to get a reference to the waiters collection
    const waitersRef = collection(db, 'waiters');
    console.log('Waiters collection reference:', waitersRef);
    
    // Attempt to get documents
    const snapshot = await getDocs(waitersRef);
    console.log('Query snapshot:', snapshot);
    console.log('Number of documents:', snapshot.size);
    
    return {
      success: true,
      message: `Successfully connected. Found ${snapshot.size} documents.`
    };
  } catch (error) {
    console.error('Firebase connection check failed:', error);
    return {
      success: false,
      message: error.message,
      code: error.code
    };
  }
};