// services/waiters.js
import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

const WAITERS_COLLECTION = 'waiters';

export const getAllWaiters = async (includeInactive = false) => {
  try {
    let waitersQuery = collection(db, WAITERS_COLLECTION);
    
    if (!includeInactive) {
      waitersQuery = query(
        waitersQuery,
        where('isActive', '==', true)
      );
    }

    const querySnapshot = await getDocs(waitersQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error('Failed to load waiters: ' + error.message);
  }
};

export const addWaiter = async (waiterData) => {
  try {
    // Get all waiters to determine the next ID
    const querySnapshot = await getDocs(collection(db, WAITERS_COLLECTION));
    const currentIds = querySnapshot.docs
      .map(doc => doc.data().employeeId)
      .filter(id => id)
      .map(id => parseInt(id.replace('W', '')))
      .filter(id => !isNaN(id));

    const highestId = currentIds.length > 0 ? Math.max(...currentIds) : 0;
    const nextId = `W${String(highestId + 1).padStart(3, '0')}`;

    const docRef = await addDoc(collection(db, WAITERS_COLLECTION), {
      ...waiterData,
      employeeId: nextId,
      createdAt: new Date().toISOString(),
      isActive: true,
      lastTestDate: null  // Initialize last test date as null
    });
    
    return { id: docRef.id, employeeId: nextId };
  } catch (error) {
    throw new Error('Error adding waiter: ' + error.message);
  }
};

export const updateWaiter = async (waiterId, waiterData) => {
  try {
    const waiterRef = doc(db, WAITERS_COLLECTION, waiterId);
    await updateDoc(waiterRef, {
      ...waiterData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    throw new Error('Error updating waiter: ' + error.message);
  }
};

export const deleteWaiter = async (waiterId) => {
  try {
    const waiterRef = doc(db, WAITERS_COLLECTION, waiterId);
    await updateDoc(waiterRef, {
      isActive: false,
      deactivatedAt: new Date().toISOString()
    });
  } catch (error) {
    throw new Error('Error deleting waiter: ' + error.message);
  }
};

export const updateLastTestDate = async (waiterId) => {
  try {
    const waiterRef = doc(db, WAITERS_COLLECTION, waiterId);
    await updateDoc(waiterRef, {
      lastTestDate: new Date().toISOString()
    });
  } catch (error) {
    throw new Error('Error updating test date: ' + error.message);
  }
};

export const canTakeTest = (waiter) => {
  if (!waiter.lastTestDate) return true;
  
  const lastTest = new Date(waiter.lastTestDate);
  const today = new Date();
  
  return lastTest.getDate() !== today.getDate() ||
         lastTest.getMonth() !== today.getMonth() ||
         lastTest.getFullYear() !== today.getFullYear();
};