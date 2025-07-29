
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, History, Gift, MessageCircle, Star, ChevronRight, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { getUserProfile, signOut } from '@/lib/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { ScrollArea } from '@/components/ui/scroll-area';
import EditProfileDialog from './EditProfileDialog';
import BookingHistoryDialog from './BookingHistoryDialog';
import ReferEarnDialog from './ReferEarnDialog';
import CustomerSupportDialog from './CustomerSupportDialog';
import RatingFeedbackDialog from './RatingFeedbackDialog';

interface UserProfile {
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: Date;
  address: string;
  referralCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileDrawer = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            // Fallback to basic user info if profile not found
            const now = new Date();
            setUserProfile({
              fullName: user.displayName || 'User',
              email: user.email || '',
              gender: '',
              dateOfBirth: new Date(),
              address: '',
              referralCode: '',
              createdAt: now,
              updatedAt: now
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      icon: User,
      title: 'Edit Your Profile',
      description: 'Update your personal information',
      action: () => setActiveDialog('editProfile')
    },
    {
      icon: History,
      title: 'Booking History',
      description: 'View your past and current bookings',
      action: () => setActiveDialog('bookingHistory')
    },
    {
      icon: Gift,
      title: 'Refer & Earn',
      description: 'Invite friends and earn rewards',
      action: () => setActiveDialog('referEarn')
    },
    {
      icon: MessageCircle,
      title: 'Customer Support',
      description: 'Get help and support',
      action: () => setActiveDialog('customerSupport')
    },
    {
      icon: LogOut,
      title: 'Logout',
      description: 'Sign out of your account',
      action: handleLogout
    },
    {
      icon: Star,
      title: 'Rating & Feedback',
      description: 'Share your experience',
      action: () => setActiveDialog('ratingFeedback')
    }
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Profile Header - Fixed */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-orange-400 to-orange-600 p-6 text-white flex-shrink-0"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{userProfile?.fullName || 'User'}</h2>
              <p className="text-sm opacity-90">{userProfile?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Scrollable Menu Items */}
        <ScrollArea className="flex-1">
          <div className="py-4">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                onClick={item.action}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.title === 'Logout' ? 'bg-red-100' : 'bg-orange-100'
                    }`}>
                      <item.icon className={`w-5 h-5 ${
                        item.title === 'Logout' ? 'text-red-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* App Version - Fixed at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="p-6 text-center border-t border-gray-200 flex-shrink-0"
        >
          <p className="text-sm text-gray-500">Pooja Ghar v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">Made with 🧡 for spiritual wellness</p>
        </motion.div>
      </div>

      {/* Dialogs */}
      {activeDialog === 'editProfile' && userProfile && (
        <EditProfileDialog 
          userProfile={userProfile}
          onClose={() => setActiveDialog(null)}
          onUpdate={(updatedProfile) => {
            setUserProfile(updatedProfile);
            setActiveDialog(null);
          }}
        />
      )}
      
      {activeDialog === 'bookingHistory' && (
        <BookingHistoryDialog onClose={() => setActiveDialog(null)} />
      )}
      
      {activeDialog === 'referEarn' && userProfile && (
        <ReferEarnDialog 
          userProfile={userProfile}
          onClose={() => setActiveDialog(null)} 
        />
      )}
      
      {activeDialog === 'customerSupport' && (
        <CustomerSupportDialog onClose={() => setActiveDialog(null)} />
      )}
      
      {activeDialog === 'ratingFeedback' && (
        <RatingFeedbackDialog onClose={() => setActiveDialog(null)} />
      )}
    </>
  );
};

export default ProfileDrawer;
