import { 
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

const RESULTS_COLLECTION = 'test-results';

export const saveTestResult = async (resultData) => {
  try {
    // Ensure we're working with a plain object that Firestore can handle
    const cleanedData = JSON.parse(JSON.stringify({
      ...resultData,
      timestamp: new Date().getTime() // Add a timestamp for sorting
    }));

    console.log('Saving to Firestore:', cleanedData);

    const docRef = await addDoc(collection(db, RESULTS_COLLECTION), cleanedData);
    console.log('Document written with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error in saveTestResult:', error);
    throw new Error('Error saving test result: ' + error.message);
  }
};

export const getTestResults = async (userName = null) => {
  try {
    let q = query(
      collection(db, RESULTS_COLLECTION),
      orderBy('timestamp', 'desc')
    );

    if (userName) {
      q = query(q, where('userName', '==', userName));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error in getTestResults:', error);
    throw new Error('Error fetching test results: ' + error.message);
  }
};