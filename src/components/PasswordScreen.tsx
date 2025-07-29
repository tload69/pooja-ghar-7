
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { signUpUser, signInUser, checkUserHasProfile } from '@/lib/auth';

interface PasswordScreenProps {
  email: string;
  onPasswordSubmit: (password: string, hasCompletedProfile: boolean) => void;
}

const PasswordScreen = ({ email, onPasswordSubmit }: PasswordScreenProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordError('');
    setIsLoading(true);
    
    try {
      console.log('Starting authentication for:', email);
      
      // Try to sign up first (for new users)
      try {
        console.log('Attempting to create new account');
        const newUser = await signUpUser(email, password);
        
        if (newUser) {
          console.log('New user created successfully:', newUser.uid);
          onPasswordSubmit(password, false); // New user needs to complete profile
          return;
        }
      } catch (signUpError: any) {
        console.log('Sign up failed, trying sign in:', signUpError.code);
        
        // If email already exists, try to sign in
        if (signUpError.code === 'auth/email-already-in-use') {
          try {
            console.log('Email exists, attempting to sign in');
            const user = await signInUser(email, password);
            
            if (user) {
              console.log('Sign in successful, checking profile completion');
              const hasProfile = await checkUserHasProfile(user.uid);
              console.log('User has completed profile:', hasProfile);
              onPasswordSubmit(password, hasProfile);
              return;
            }
          } catch (signInError: any) {
            console.error('Sign in error:', signInError);
            if (signInError.code === 'auth/wrong-password' || signInError.code === 'auth/invalid-credential') {
              setPasswordError('Wrong password. Please try again.');
            } else if (signInError.code === 'auth/too-many-requests') {
              setPasswordError('Too many failed attempts. Please try again later.');
            } else {
              setPasswordError('Authentication failed. Please try again.');
            }
          }
        } else if (signUpError.code === 'auth/weak-password') {
          setPasswordError('Password is too weak. Please choose a stronger password.');
        } else if (signUpError.code === 'auth/invalid-email') {
          setPasswordError('Invalid email address format.');
        } else {
          console.error('Unexpected sign up error:', signUpError);
          setPasswordError('Failed to create account. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Unexpected authentication error:', error);
      setPasswordError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            className="text-6xl mb-6"
          >
            🔐
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome
          </h1>
          <p className="text-lg text-gray-600">
            Enter your password for
          </p>
          <p className="text-orange-600 font-semibold">{email}</p>
          <p className="text-sm text-gray-500 mt-2">
            New user? We'll create your account automatically
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="pl-10 pr-10 h-12 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {passwordError}
              </p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            Forgot your password? <span className="text-orange-600 cursor-pointer">Reset it here</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PasswordScreen;
