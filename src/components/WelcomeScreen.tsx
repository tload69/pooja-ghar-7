
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';

interface WelcomeScreenProps {
  onEmailSubmit: (email: string) => void;
}

const WelcomeScreen = ({ onEmailSubmit }: WelcomeScreenProps) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    onEmailSubmit(email);
  };

  return (
    <>
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
              🪔
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to Pooja Ghar
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Book Service Providers in Minutes
              </p>
              <p className="text-base text-gray-500 mt-2">
                Connect with spiritual guides, access sacred content, and find everything you need for your spiritual journey
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              {emailError && (
                <p className="text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg"
            >
              Continue
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <button
                onClick={() => setShowTerms(true)}
                className="text-orange-600 hover:text-orange-700 underline"
              >
                Terms of Service
              </button>
              {' '}and{' '}
              <button
                onClick={() => setShowPrivacy(true)}
                className="text-orange-600 hover:text-orange-700 underline"
              >
                Privacy Policy
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {showTerms && <TermsOfService onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
    </>
  );
};

export default WelcomeScreen;
