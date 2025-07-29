
import { motion } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy = ({ onClose }: PrivacyPolicyProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, such as when you create an account, book services, or contact us for support.
            </p>

            <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>To provide and maintain our services</li>
              <li>To process bookings and payments</li>
              <li>To communicate with you about your account</li>
              <li>To improve our services and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">3. Information Sharing</h3>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>

            <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h3 className="text-lg font-semibold mb-3">5. Cookies and Tracking</h3>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to enhance your experience and analyze how our services are used.
            </p>

            <h3 className="text-lg font-semibold mb-3">6. Your Rights</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Opt-out of communications</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">7. Children's Privacy</h3>
            <p className="text-gray-700 mb-4">
              Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>

            <h3 className="text-lg font-semibold mb-3">8. Changes to Privacy Policy</h3>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>

            <h3 className="text-lg font-semibold mb-3">9. Contact Us</h3>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy, please contact us at privacy@poojaghar.com
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <Button
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Registration
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
