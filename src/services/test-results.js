// services/test-results.js
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const RESULTS_COLLECTION = 'test-results';

export const saveTestResult = async (resultData) => {
  try {
    // Basic data cleanup
    const data = {
      waiterId: resultData.waiterId,
      waiterName: resultData.waiterName,
      employeeId: resultData.employeeId,
      score: Number(resultData.score),
      correctAnswers: Number(resultData.correctAnswers),
      totalQuestions: Number(resultData.totalQuestions),
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    // Log the attempt
    console.log('Attempting to save test result:', data);

    // Try to save
    const docRef = await addDoc(collection(db, RESULTS_COLLECTION), data);
    console.log('Test result saved successfully with ID:', docRef.id);
    return docRef.id;

  } catch (error) {
    // Log the full error
    console.error('Error saving test result:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const getTestResults = async () => {
  try {
    console.log("Fetching test results...");
    const querySnapshot = await getDocs(collection(db, RESULTS_COLLECTION));
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("Test results fetched:", results);
    return results;
  } catch (error) {
    console.error('Error fetching results:', error);
    return []; // Return empty array on error
  }
};