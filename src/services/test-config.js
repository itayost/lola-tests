// services/test-config.js
import { 
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export const defaultConfig = {
  timeLimit: 30,
  numberOfQuestions: 15,
  passingScore: 70,
  randomizeQuestions: true,
  lastUpdated: new Date().toISOString()
};

export const saveTestConfig = async (config) => {
  try {
    console.log('Saving config to Firestore:', config); // Debug log
    const configRef = doc(db, 'config', 'test-settings');
    
    // Ensure all required fields are present
    const configToSave = {
      ...defaultConfig,
      ...config,
      lastUpdated: new Date().toISOString()
    };

    await setDoc(configRef, configToSave);
    console.log('Config saved successfully'); // Debug log
  } catch (error) {
    console.error('Firestore save error:', error); // Debug log
    throw error;
  }
};

export const getTestConfig = async () => {
  try {
    const configRef = doc(db, 'config', 'test-settings');
    const docSnap = await getDoc(configRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Loaded config from Firestore:', data); // Debug log
      return data;
    }
    
    // If no config exists, create default
    console.log('No config found, creating default'); // Debug log
    await saveTestConfig(defaultConfig);
    return defaultConfig;
  } catch (error) {
    console.error('Firestore load error:', error); // Debug log
    return defaultConfig;
  }
};