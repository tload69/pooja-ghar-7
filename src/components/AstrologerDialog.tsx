
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Clock, Users } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Astrologer {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  pricePerMinute: number;
  isOnline: boolean;
  languages: string[];
  description?: string;
}

interface AstrologerDialogProps {
  onClose: () => void;
}

const AstrologerDialog = ({ onClose }: AstrologerDialogProps) => {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAstrologers();
  }, []);

  const fetchAstrologers = async () => {
    try {
      const astrologersRef = collection(db, 'astrologers');
      const querySnapshot = await getDocs(astrologersRef);
      const astrologersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || '',
        specialization: doc.data().specialization || '',
        experience: doc.data().experience || '',
        rating: doc.data().rating || 0,
        pricePerMinute: doc.data().pricePerMinute || 0,
        isOnline: doc.data().isOnline || false,
        languages: doc.data().languages || [],
        description: doc.data().description || '',
        ...doc.data()
      })) as Astrologer[];
      
      setAstrologers(astrologersData);
    } catch (error) {
      console.error('Error fetching astrologers:', error);
      setAstrologers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseTime = (astrologer: Astrologer) => {
    // This will be implemented when payment system is added
    console.log('Purchase time for astrologer:', astrologer.name);
    alert(`Feature coming soon! You will be able to purchase time to chat with ${astrologer.name}`);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Talk to Astrologer
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600">Loading astrologers...</span>
          </div>
        ) : astrologers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔮</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Astrologers Available
            </h3>
            <p className="text-gray-600">
              Our astrologers are currently not available. Please check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Choose from our verified astrologers and purchase time to get personalized guidance.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {astrologers.map((astrologer) => (
                <Card key={astrologer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {astrologer.name.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{astrologer.name}</CardTitle>
                          <p className="text-sm text-gray-600">{astrologer.specialization}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        astrologer.isOnline 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {astrologer.isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {astrologer.description && (
                      <p className="text-sm text-gray-600">{astrologer.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>{astrologer.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{astrologer.experience}</span>
                      </div>
                    </div>
                    
                    {astrologer.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {astrologer.languages.map((language, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {language}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-lg font-semibold text-orange-600">
                        ₹{astrologer.pricePerMinute}/min
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handlePurchaseTime(astrologer)}
                        disabled={!astrologer.isOnline}
                        className={astrologer.isOnline ? 'bg-orange-500 hover:bg-orange-600' : ''}
                      >
                        {astrologer.isOnline ? 'Buy Time' : 'Offline'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AstrologerDialog;
