
import { motion } from 'framer-motion';
import { X, Phone, Mail, MessageCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerSupportDialogProps {
  onClose: () => void;
}

const CustomerSupportDialog = ({ onClose }: CustomerSupportDialogProps) => {
  const faqs = [
    {
      question: "How do I book a puja service?",
      answer: "You can book a puja service through our app by selecting the type of puja, choosing date and time, and confirming your booking with payment."
    },
    {
      question: "What is your cancellation policy?",
      answer: "You can cancel your booking up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may incur charges."
    },
    {
      question: "Are the priests verified?",
      answer: "Yes, all our priests are thoroughly verified and have years of experience in performing various religious ceremonies."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets for your convenience."
    },
    {
      question: "Do you provide puja materials?",
      answer: "Yes, we can provide all necessary puja materials and items. This can be specified during booking for an additional cost."
    }
  ];

  const contactInfo = {
    phone: "+91 98765 43210",
    email: "support@poojaghar.com",
    hours: "24/7 Customer Support"
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
            <h2 className="text-2xl font-bold text-gray-800">Customer Support</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contact Information */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-orange-800 mb-3">Contact Us</h3>
            <div className="space-y-3">
              <a 
                href={`tel:${contactInfo.phone}`}
                className="flex items-center space-x-3 p-2 hover:bg-orange-100 rounded"
              >
                <Phone className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-800">{contactInfo.phone}</p>
                  <p className="text-sm text-gray-600">Call us anytime</p>
                </div>
              </a>
              
              <a 
                href={`mailto:${contactInfo.email}`}
                className="flex items-center space-x-3 p-2 hover:bg-orange-100 rounded"
              >
                <Mail className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-800">{contactInfo.email}</p>
                  <p className="text-sm text-gray-600">Email support</p>
                </div>
              </a>
              
              <div className="flex items-center space-x-3 p-2">
                <MessageCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-800">{contactInfo.hours}</p>
                  <p className="text-sm text-gray-600">We're here to help</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details key={index} className="border border-gray-200 rounded-lg">
                  <summary className="p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                    <span className="font-medium text-gray-700">{faq.question}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </summary>
                  <div className="p-3 pt-0 text-sm text-gray-600">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => window.open(`tel:${contactInfo.phone}`)}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </Button>
            
            <Button
              onClick={() => window.open(`mailto:${contactInfo.email}`)}
              variant="outline"
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerSupportDialog;
