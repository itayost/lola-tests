import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  limit,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';

const QUESTIONS_COLLECTION = 'questions';

export const addQuestion = async (questionData) => {
  try {
    const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), {
      ...questionData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding question:', error);
    throw new Error('Failed to add question: ' + error.message);
  }
};

export const updateQuestion = async (questionId, questionData) => {
  try {
    const questionRef = doc(db, QUESTIONS_COLLECTION, questionId);
    await updateDoc(questionRef, {
      ...questionData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating question:', error);
    throw new Error('Failed to update question: ' + error.message);
  }
};

export const deleteQuestion = async (questionId) => {
  try {
    const questionRef = doc(db, QUESTIONS_COLLECTION, questionId);
    await deleteDoc(questionRef);
  } catch (error) {
    console.error('Error deleting question:', error);
    throw new Error('Failed to delete question: ' + error.message);
  }
};

export const getAllQuestions = async () => {
  try {
    const q = query(
      collection(db, QUESTIONS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Error('Failed to fetch questions: ' + error.message);
  }
};

export const getRandomQuestions = async (count = 15) => {
  try {
    // Get all questions and shuffle them
    const allQuestions = await getAllQuestions();
    if (!allQuestions.length) {
      throw new Error('No questions available');
    }
    
    // Fisher-Yates shuffle
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }
    
    return allQuestions.slice(0, Math.min(count, allQuestions.length));
  } catch (error) {
    console.error('Error fetching random questions:', error);
    throw new Error('Failed to fetch random questions: ' + error.message);
  }
};