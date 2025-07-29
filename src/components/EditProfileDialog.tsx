
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { auth } from '@/lib/firebase';
import { saveUserProfile } from '@/lib/auth';

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

interface EditProfileDialogProps {
  userProfile: UserProfile;
  onClose: () => void;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const EditProfileDialog = ({ userProfile, onClose, onUpdate }: EditProfileDialogProps) => {
  const [formData, setFormData] = useState({
    fullName: userProfile.fullName,
    gender: userProfile.gender,
    day: userProfile.dateOfBirth.getDate().toString().padStart(2, '0'),
    month: (userProfile.dateOfBirth.getMonth() + 1).toString().padStart(2, '0'),
    year: userProfile.dateOfBirth.getFullYear().toString(),
    address: userProfile.address,
    referralCode: userProfile.referralCode || ''
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
    if (!validateForm()) {
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setErrors({ submit: 'Please sign in again' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const dateOfBirth = new Date(
        parseInt(formData.year),
        parseInt(formData.month) - 1,
        parseInt(formData.day)
      );

      const profileData = {
        fullName: formData.fullName.trim(),
        email: userProfile.email,
        gender: formData.gender,
        dateOfBirth,
        address: formData.address.trim(),
        referralCode: formData.referralCode.trim() || undefined,
        createdAt: userProfile.createdAt || new Date(),
        updatedAt: new Date()
      };

      await saveUserProfile(user.uid, profileData);
      
      // Update the parent component with new profile data
      onUpdate({
        ...profileData,
        createdAt: userProfile.createdAt || new Date()
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: `Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsLoading(false);
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
            <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name *</label>
              <Input
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="h-12"
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
              {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Address *</label>
              <Textarea
                placeholder="Enter your complete address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="min-h-20"
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
                className="h-12"
                disabled={isLoading}
              />
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 p-3 rounded">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-12"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 h-12 bg-orange-500 hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfileDialog;
