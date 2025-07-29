
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface BookingHistoryDialogProps {
  onClose: () => void;
}

interface Booking {
  id: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: string;
  amount: string;
}

const BookingHistoryDialog = ({ onClose }: BookingHistoryDialogProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching bookings for user:', user.uid);
        const bookingsRef = collection(db, 'bookings');
        const q = query(
          bookingsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const userBookings: Booking[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userBookings.push({
            id: doc.id,
            service: data.service || 'Unknown Service',
            date: data.date || 'Unknown Date',
            time: data.time || 'Unknown Time',
            location: data.location || 'Unknown Location',
            status: data.status || 'Unknown Status',
            amount: data.amount || '₹0'
          });
        });
        
        console.log('Found bookings:', userBookings.length);
        setBookings(userBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Booking History</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading your bookings...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{booking.service}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {booking.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {booking.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {booking.location}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <span className="font-semibold text-orange-600">{booking.amount}</span>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Bookings Yet</h3>
              <p className="text-gray-500">Your booking history will appear here once you make your first booking.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingHistoryDialog;
