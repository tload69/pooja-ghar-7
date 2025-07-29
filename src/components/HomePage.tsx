
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, MessageCircle, Play, Star, Calendar, Users, Filter, User, BookOpen, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ProfileDrawer from '@/components/ProfileDrawer';
import PanditBookingForm from '@/components/PanditBookingForm';
import AstrologerDialog from '@/components/AstrologerDialog';
import { auth, db } from '@/lib/firebase';
import { getUserProfile } from '@/lib/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface PanditData {
  id: string;
  type: 'pandit';
  name: string;
  specialization: string;
  rating?: number;
  experience?: string;
  isOnline?: boolean;
  price?: string;
  [key: string]: any;
}

interface MantraData {
  id: string;
  type: 'mantra';
  title: string;
  description: string;
  category?: string;
  duration?: string;
  [key: string]: any;
}

interface ProductData {
  id: string;
  type: 'product';
  name: string;
  description: string;
  price?: string;
  category?: string;
  [key: string]: any;
}

type SearchResult = PanditData | MantraData | ProductData;

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Fetching location...');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [mantras, setMantras] = useState<MantraData[]>([]);
  const [poojaProducts, setPoojaProducts] = useState<ProductData[]>([]);
  const [showAstrologerDialog, setShowAstrologerDialog] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // In a real app, you'd use a geocoding service
            setCurrentLocation('Delhi, India'); // Placeholder
          } catch (error) {
            setCurrentLocation('Delhi, India');
          }
        },
        () => {
          setCurrentLocation('Delhi, India');
        }
      );
    }
  }, []);

  // Auto-fetch pooja products on component mount
  useEffect(() => {
    fetchPoojaProducts();
  }, []);

  const fetchMantras = async () => {
    try {
      const mantrasRef = collection(db, 'mantras');
      const querySnapshot = await getDocs(mantrasRef);
      const mantrasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'mantra' as const,
        title: doc.data().title || '',
        description: doc.data().description || '',
        category: doc.data().category || '',
        duration: doc.data().duration || '',
        ...doc.data()
      })) as MantraData[];
      setMantras(mantrasData);
    } catch (error) {
      console.error('Error fetching mantras:', error);
      setMantras([]);
    }
  };

  const fetchPoojaProducts = async () => {
    try {
      const productsRef = collection(db, 'service_item');
      const querySnapshot = await getDocs(productsRef);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'product' as const,
        name: doc.data().name || '',
        description: doc.data().description || '',
        price: doc.data().price || '',
        category: doc.data().category || '',
        ...doc.data()
      })) as ProductData[];
      setPoojaProducts(productsData);
      console.log('Fetched pooja products:', productsData);
    } catch (error) {
      console.error('Error fetching pooja products:', error);
      setPoojaProducts([]);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const results: SearchResult[] = [];
      
      // Search for mantras
      const mantrasRef = collection(db, 'mantras');
      const mantrasSnapshot = await getDocs(mantrasRef);
      const mantrasResults = mantrasSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'mantra' as const,
        title: doc.data().title || '',
        description: doc.data().description || '',
        category: doc.data().category || '',
        duration: doc.data().duration || '',
        ...doc.data()
      })) as MantraData[];
      
      const filteredMantras = mantrasResults.filter(mantra => 
        mantra.title?.toLowerCase().includes(query.toLowerCase()) ||
        mantra.description?.toLowerCase().includes(query.toLowerCase()) ||
        mantra.category?.toLowerCase().includes(query.toLowerCase())
      );
      
      // Search for pooja samagri items
      const productsRef = collection(db, 'service_item');
      const productsSnapshot = await getDocs(productsRef);
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'product' as const,
        name: doc.data().name || '',
        description: doc.data().description || '',
        price: doc.data().price || '',
        category: doc.data().category || '',
        ...doc.data()
      })) as ProductData[];
      
      const filteredProducts = products.filter(product => 
        product.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase())
      );
      
      results.push(...filteredMantras, ...filteredProducts);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    }
    
    setIsSearching(false);
  };

  const handlePanditBooking = () => {
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    console.log('Booking request:', bookingData);
    
    try {
      // In real implementation, this would:
      // 1. Save booking request to Firestore
      // 2. Find matching online pandits based on criteria
      // 3. Send notifications to eligible pandits
      // 4. Handle accept/decline responses
      
      alert('Booking request sent! Online pandits matching your requirements will be notified.');
      setShowBookingForm(false);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Error sending booking request. Please try again.');
    }
  };

  const handleMantrasClick = async () => {
    await fetchMantras();
  };

  const handlePoojaClick = async () => {
    // Products are already loaded, just log for debugging
    console.log('Pooja Samagri clicked, current products:', poojaProducts);
  };

  const handleAstrologerClick = () => {
    setShowAstrologerDialog(true);
  };

  const services = [
    {
      icon: User,
      title: 'Pandit Booking',
      subtitle: 'Professional Sanskrit Scholars',
      description: 'Book experienced pandits for all religious ceremonies',
      color: 'from-orange-500 to-orange-600',
      action: handlePanditBooking
    },
    {
      icon: BookOpen,
      title: 'Mantras',
      subtitle: 'Sacred Chants & Prayers',
      description: 'Access authentic mantras and spiritual guidance',
      color: 'from-amber-500 to-orange-500',
      action: handleMantrasClick
    },
    {
      icon: ShoppingBag,
      title: 'Pooja Samagri',
      subtitle: 'Authentic Religious Items',
      description: 'Premium quality items for all religious rituals',
      color: 'from-red-500 to-orange-500',
      action: handlePoojaClick
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
                    <User className="w-6 h-6 text-white" />
                  </div>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <ProfileDrawer />
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Welcome {userProfile?.fullName || 'User'}!
                </h1>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{currentLocation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for mantras or pooja samagri..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-12 h-14 text-lg border-gray-300 focus:border-orange-400 focus:ring-orange-400 rounded-xl shadow-sm"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-6 right-6 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto z-50">
              {searchResults.map((result) => (
                <div key={result.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {result.type === 'mantra' ? result.title : result.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {result.description}
                      </p>
                      {result.type === 'mantra' && result.category && (
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded mt-1 inline-block">
                          {result.category}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      {result.type === 'product' && result.price && (
                        <p className="font-semibold text-orange-600">₹{result.price}</p>
                      )}
                      {result.type === 'mantra' && result.duration && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Play className="w-3 h-3 mr-1" />
                          {result.duration}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 space-y-8">
        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Our Services</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 group" onClick={service.action}>
                  <CardHeader className={`bg-gradient-to-r ${service.color} text-white rounded-t-lg`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <service.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <CardDescription className="text-white/90 text-sm">{service.subtitle}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Button size="sm" className="group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Talk to Astrologer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">Talk to Astrologer</CardTitle>
                  <CardDescription>Connect with verified astrologers for guidance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Get personalized astrological guidance</p>
                  <p className="text-xs text-gray-500 mt-1">Purchase time to talk with professional astrologers</p>
                </div>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleAstrologerClick}
                >
                  Start Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mantras Section */}
        {mantras.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Mantras</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mantras.map((mantra) => (
                <Card key={mantra.id} className="cursor-pointer hover:shadow-md transition-shadow group">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <BookOpen className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-sm text-gray-800 mb-1">{mantra.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">{mantra.category}</p>
                      {mantra.duration && (
                        <div className="flex items-center justify-center text-xs text-gray-500">
                          <Play className="w-3 h-3 mr-1" />
                          {mantra.duration}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pooja Samagri Section */}
        {poojaProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Pooja Samagri</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {poojaProducts.map((product) => (
                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow group">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <ShoppingBag className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-sm text-gray-800 mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{product.description}</p>
                      {product.price && (
                        <p className="font-semibold text-orange-600">₹{product.price}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <PanditBookingForm
          onClose={() => setShowBookingForm(false)}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Astrologer Dialog */}
      {showAstrologerDialog && (
        <AstrologerDialog
          onClose={() => setShowAstrologerDialog(false)}
        />
      )}

      <div className="h-8"></div>
    </div>
  );
};

export default HomePage;
