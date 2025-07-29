
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { auth } from '@/lib/firebase';
import { saveUserProfile } from '@/lib/auth';

interface ProfileCompletionScreenProps {
  onComplete: () => void;
}

const ProfileCompletionScreen = ({ onComplete }: ProfileCompletionScreenProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    day: '',
    month: '',
    year: '',
    address: '',
    referralCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Generate arrays for day, month, year options
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.day || !formData.month || !formData.year) {
      newErrors.dateOfBirth = 'Complete date of birth is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('Profile submission started');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      console.error('No authenticated user found');
      setErrors({ submit: 'Please sign in again' });
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      console.log('Starting profile save process for user:', user.uid);
      
      // Create date object from selected values
      const dateOfBirth = new Date(
        parseInt(formData.year),
        parseInt(formData.month) - 1, // JavaScript months are 0-indexed
        parseInt(formData.day)
      );

      console.log('Date of birth created:', dateOfBirth);
      console.log('Saving complete user profile to Firestore...');
      
      // Save complete user profile to Firestore
      const profileData = {
        fullName: formData.fullName.trim(),
        email: user.email!,
        gender: formData.gender,
        dateOfBirth,
        address: formData.address.trim(),
        referralCode: formData.referralCode.trim() || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Profile data to save:', profileData);
      
      await saveUserProfile(user.uid, profileData);

      console.log('Profile saved successfully! Calling onComplete...');
      
      // Call onComplete to navigate to home page
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ submit: `Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Help us serve you better</p>
        </div>

        <div className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name *</label>
            <Input
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="h-12 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
              disabled={isLoading}
            />
            {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Gender *</label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })} disabled={isLoading}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date of Birth *</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })} disabled={isLoading}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })} disabled={isLoading}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })} disabled={isLoading}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Address *</label>
            <Textarea
              placeholder="Enter your complete address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="min-h-20 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
              disabled={isLoading}
            />
            {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
          </div>

          {/* Referral Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Referral Code (Optional)</label>
            <Input
              placeholder="Enter referral code if you have one"
              value={formData.referralCode}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
              className="h-12 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
              disabled={isLoading}
            />
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 p-3 rounded">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg mt-8"
            disabled={isLoading}
          >
            {isLoading ? 'Saving Profile...' : 'Complete Profile'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCompletionScreen;
