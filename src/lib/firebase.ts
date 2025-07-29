
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAc48gK6io9e6oDCS1U-QRsOdcZAITgOp4",
  authDomain: "pooja-ghar-297e3.firebaseapp.com",
  projectId: "pooja-ghar-297e3",
  storageBucket: "pooja-ghar-297e3.firebasestorage.app",
  messagingSenderId: "781983163156",
  appId: "1:781983163156:web:a0940c253d508f1b951801",
  measurementId: "G-DJPH4GDMYC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
