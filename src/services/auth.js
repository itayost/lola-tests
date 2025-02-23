import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    let message = 'Failed to sign in';
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        message = 'Email not found';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      default:
        message = error.message;
    }
    throw new Error(message);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error('Failed to sign out');
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};