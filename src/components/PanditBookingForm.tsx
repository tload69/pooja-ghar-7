
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, Users, X } from 'lucide-react';

interface BookingFormData {
  ceremonyType: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  participants: string;
  specialRequirements: string;
  budget: string;
}

interface PanditBookingFormProps {
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
}

const PanditBookingForm = ({ onClose, onSubmit }: PanditBookingFormProps) => {
  const form = useForm<BookingFormData>();

  const ceremonyTypes = [
    'Wedding Ceremony',
    'Griha Pravesh',
    'Satyanarayan Puja',
    'Birthday Puja',
    'Navratri Puja',
    'Karva Chauth',
    'Thread Ceremony',
    'Funeral Rites',
    'Other'
  ];

  const timeSlots = [
    '6:00 AM - 8:00 AM',
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
    '8:00 PM - 10:00 PM'
  ];

  const handleSubmit = (data: BookingFormData) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800">Book a Pandit</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ceremonyType"
                rules={{ required: "Please select a ceremony type" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ceremony Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ceremony type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ceremonyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  rules={{ required: "Please select a date" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type="date"
                            className="pl-10"
                            {...field}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  rules={{ required: "Please select a time slot" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Slot</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <Clock className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="duration"
                rules={{ required: "Please specify duration" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                        <SelectItem value="2-3 hours">2-3 hours</SelectItem>
                        <SelectItem value="3-4 hours">3-4 hours</SelectItem>
                        <SelectItem value="4+ hours">4+ hours</SelectItem>
                        <SelectItem value="full-day">Full Day</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                rules={{ required: "Please enter location" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Enter full address"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="participants"
                  rules={{ required: "Please specify number of participants" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Participants</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type="number"
                            placeholder="e.g., 25"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  rules={{ required: "Please specify your budget" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1000-2500">₹1,000 - ₹2,500</SelectItem>
                          <SelectItem value="2500-5000">₹2,500 - ₹5,000</SelectItem>
                          <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                          <SelectItem value="10000+">₹10,000+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requirements (Optional)</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Any specific requirements, language preferences, or additional details..."
                        className="w-full p-3 border border-gray-300 rounded-md resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                  Send Booking Request
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PanditBookingForm;
