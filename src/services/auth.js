// auth.js
import { 
  signInWithEmailAndPassword,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './firebase';

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signInAnonymously = async () => {
  try {
    const userCredential = await firebaseSignInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const isAnonymous = (user) => {
  return user?.isAnonymous || false;
};