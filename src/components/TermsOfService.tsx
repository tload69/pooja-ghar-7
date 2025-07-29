
import { motion } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TermsOfServiceProps {
  onClose: () => void;
}

const TermsOfService = ({ onClose }: TermsOfServiceProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Terms of Service</h2>
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
            
            <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
            <p className="text-gray-700 mb-4">
              By accessing and using Pooja Ghar, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h3 className="text-lg font-semibold mb-3">2. Services</h3>
            <p className="text-gray-700 mb-4">
              Pooja Ghar provides a platform to connect users with spiritual guides and service providers. We facilitate bookings and connections but are not responsible for the quality of services provided by third parties.
            </p>

            <h3 className="text-lg font-semibold mb-3">3. User Responsibilities</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide accurate and truthful information</li>
              <li>Respect other users and service providers</li>
              <li>Follow applicable laws and regulations</li>
              <li>Not misuse the platform for illegal activities</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">4. Payment Terms</h3>
            <p className="text-gray-700 mb-4">
              All payments are processed securely. Refund policies vary by service provider. Please review specific terms before booking.
            </p>

            <h3 className="text-lg font-semibold mb-3">5. Privacy</h3>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.
            </p>

            <h3 className="text-lg font-semibold mb-3">6. Limitation of Liability</h3>
            <p className="text-gray-700 mb-4">
              Pooja Ghar is not liable for any damages arising from the use of our services or interactions with service providers.
            </p>

            <h3 className="text-lg font-semibold mb-3">7. Changes to Terms</h3>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.
            </p>

            <h3 className="text-lg font-semibold mb-3">8. Contact Information</h3>
            <p className="text-gray-700 mb-4">
              For questions about these Terms of Service, please contact us at support@poojaghar.com
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

export default TermsOfService;
