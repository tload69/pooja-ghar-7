
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface RatingFeedbackDialogProps {
  onClose: () => void;
}

const RatingFeedbackDialog = ({ onClose }: RatingFeedbackDialogProps) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      // In a real app, this would send the feedback to your backend
      console.log('Feedback submitted:', { rating, feedback });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h3>
          <p className="text-gray-600">Your feedback has been submitted successfully.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Rating & Feedback</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How was your experience?</h3>
            <p className="text-gray-600">Your feedback helps us improve our services</p>
          </div>

          <div className="space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-3">Rate your experience:</p>
              <div className="flex justify-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            {/* Feedback Text */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Additional Comments (Optional)
              </label>
              <Textarea
                placeholder="Tell us more about your experience..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-24"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 text-right">
                {feedback.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={rating === 0}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RatingFeedbackDialog;
