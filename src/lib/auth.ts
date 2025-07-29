import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, AuthError } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export interface UserProfile {
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: Date;
  address: string;
  referralCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const signUpUser = async (email: string, password: string) => {
  try {
    console.log('Creating new user with email:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created successfully:', userCredential.user.uid);
    
    // Create initial user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      createdAt: serverTimestamp(),
      profileCompleted: false
    });
    
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    console.log('Signing in user with email:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in successfully:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const checkUserHasProfile = async (userId: string): Promise<boolean> => {
  try {
    console.log('Checking if user has completed profile:', userId);
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      const hasProfile = data.profileCompleted === true && data.fullName;
      console.log('User profile status:', hasProfile);
      return hasProfile;
    }
    return false;
  } catch (error) {
    console.error('Error checking user profile:', error);
    return false;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log('Getting user profile for:', userId);
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.profileCompleted) {
        return {
          ...data,
          dateOfBirth: data.dateOfBirth.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as UserProfile;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const saveUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    console.log('Saving user profile for:', userId, profileData);
    
    // Prepare the data for Firestore
    const dataToSave = {
      fullName: profileData.fullName,
      email: profileData.email,
      gender: profileData.gender,
      dateOfBirth: profileData.dateOfBirth, // Keep as Date object, Firestore will handle conversion
      address: profileData.address,
      referralCode: profileData.referralCode || '',
      profileCompleted: true,
      updatedAt: serverTimestamp()
    };
    
    console.log('Data being saved to Firestore:', dataToSave);
    
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, dataToSave, { merge: true });
    
    console.log('Profile saved successfully to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    console.log('Signing out user...');
    await firebaseSignOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
