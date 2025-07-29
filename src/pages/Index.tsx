
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/auth';
import { onAuthStateChanged } from 'firebase/auth';
import SplashScreen from '@/components/SplashScreen';
import WelcomeScreen from '@/components/WelcomeScreen';
import PasswordScreen from '@/components/PasswordScreen';
import ProfileCompletionScreen from '@/components/ProfileCompletionScreen';
import HomePage from '@/components/HomePage';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-transition from splash to welcome after 3.5 seconds
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('welcome');
        setIsLoading(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed. User:', user?.email || 'No user');
      
      if (user && currentScreen !== 'splash') {
        console.log('User is authenticated, checking profile status...');
        try {
          const profile = await getUserProfile(user.uid);
          console.log('User profile found:', !!profile);
          
          if (profile) {
            console.log('Profile complete, navigating to home');
            setCurrentScreen('home');
          } else {
            console.log('Profile incomplete or not found');
            // Only redirect to profile completion if not already there
            if (currentScreen !== 'profile') {
              console.log('User needs to complete profile');
            }
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
        }
      } else if (!user && currentScreen === 'home') {
        // User logged out, redirect to welcome
        console.log('User logged out, redirecting to welcome');
        setCurrentScreen('welcome');
      }
    });

    return () => unsubscribe();
  }, [currentScreen]);

  const handleEmailSubmit = (email: string) => {
    console.log('Email submitted:', email);
    setUserEmail(email);
    setCurrentScreen('password');
  };

  const handlePasswordSubmit = async (password: string, hasCompletedProfile: boolean) => {
    console.log('Password authentication successful. Has profile:', hasCompletedProfile);
    
    if (hasCompletedProfile) {
      console.log('User has completed profile, navigating to home');
      setCurrentScreen('home');
    } else {
      console.log('User needs to complete profile');
      setCurrentScreen('profile');
    }
  };

  const handleProfileComplete = async () => {
    console.log('Profile completion finished, navigating to home');
    setCurrentScreen('home');
  };

  if (isLoading && currentScreen === 'splash') {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {currentScreen === 'splash' && <SplashScreen />}
      {currentScreen === 'welcome' && <WelcomeScreen onEmailSubmit={handleEmailSubmit} />}
      {currentScreen === 'password' && <PasswordScreen email={userEmail} onPasswordSubmit={handlePasswordSubmit} />}
      {currentScreen === 'profile' && <ProfileCompletionScreen onComplete={handleProfileComplete} />}
      {currentScreen === 'home' && <HomePage />}
    </div>
  );
};

export default Index;
