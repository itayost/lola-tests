import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  deleteUser as deleteFirebaseUser,
  updatePassword,
  updateEmail,
  getAuth
} from 'firebase/auth';
import { auth, db } from './firebase';

const USERS_COLLECTION = 'users';

export const getCurrentUser = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const docRef = doc(db, USERS_COLLECTION, user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        uid: docSnap.id,
        ...docSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw new Error('Error getting current user: ' + error.message);
  }
};

export const createUser = async ({ email, password, name, isAdmin }) => {
  try {
    console.log('Creating new user:', { email, name, isAdmin });
    
    // Create the user in Firebase Auth
    const adminAuth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(adminAuth, email, password);
    const { uid } = userCredential.user;

    console.log('User created in Firebase Auth:', uid);

    // Store additional user data in Firestore
    const userData = {
      email,
      name,
      isAdmin: Boolean(isAdmin),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, USERS_COLLECTION, uid), userData);
    console.log('User document created in Firestore');

    return {
      uid,
      ...userData
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user: ' + error.message);
  }
};

export const updateUser = async (uid, { email, password, name, isAdmin }) => {
  try {
    const updates = {
      updatedAt: serverTimestamp()
    };

    if (email) updates.email = email;
    if (name) updates.name = name;
    if (isAdmin !== undefined) updates.isAdmin = isAdmin;
    
    // Update user data in Firestore
    await setDoc(doc(db, USERS_COLLECTION, uid), updates, { merge: true });
    console.log('User document updated in Firestore');

    // Update Firebase Auth if needed
    const user = auth.currentUser;
    if (user) {
      if (email) await updateEmail(user, email);
      if (password) await updatePassword(user, password);
    }

    return {
      uid,
      ...updates
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Error updating user: ' + error.message);
  }
};

export const deleteUser = async (uid) => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, USERS_COLLECTION, uid));
    console.log('User document deleted from Firestore');
    
    // Delete from Firebase Auth
    const user = auth.currentUser;
    if (user && user.uid === uid) {
      await deleteFirebaseUser(user);
      console.log('User deleted from Firebase Auth');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Error deleting user: ' + error.message);
  }
};

export const getAllUsers = async () => {
  try {
    const q = query(collection(db, USERS_COLLECTION));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Error fetching users: ' + error.message);
  }
};

export const getUser = async (uid) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        uid: docSnap.id,
        ...docSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Error getting user: ' + error.message);
  }
};