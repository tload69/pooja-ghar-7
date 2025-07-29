
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Share2, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserProfile {
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: Date;
  address: string;
  referralCode?: string;
}

interface ReferEarnDialogProps {
  userProfile: UserProfile;
  onClose: () => void;
}

const ReferEarnDialog = ({ userProfile, onClose }: ReferEarnDialogProps) => {
  const [copied, setCopied] = useState(false);
  
  // Generate unique referral code if not exists
  const referralCode = userProfile.referralCode || 
    `POOJA${userProfile.fullName.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const referralLink = `https://pooja-ghar.com/signup?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Pooja Ghar',
          text: `Use my referral code ${referralCode} to get special benefits when you sign up for Pooja Ghar!`,
          url: referralLink
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Refer & Earn</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Invite Friends & Earn Rewards</h3>
            <p className="text-gray-600">Share your unique referral code and earn benefits when your friends join!</p>
          </div>

          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Your Referral Code</h4>
              <div className="flex items-center space-x-2">
                <Input
                  value={referralCode}
                  readOnly
                  className="bg-white text-center font-mono text-lg"
                />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Share your referral code with friends</li>
                <li>2. They sign up using your code</li>
                <li>3. You both get special benefits!</li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Rewards:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• ₹100 credit for each successful referral</li>
                <li>• Your friend gets ₹50 welcome bonus</li>
                <li>• Extra discounts on future bookings</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleShare}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Now
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReferEarnDialog;
