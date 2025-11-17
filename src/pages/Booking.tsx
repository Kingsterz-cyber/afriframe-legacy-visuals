import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

interface Service {
  id: string;
  name: string;
  description: string;
  starting_price: number;
  duration_minutes: number;
}

interface BookingDate {
  id: string;
  date: string;
  available: boolean;
  slots: Array<{ time: string; available: boolean }>;
}

const Booking = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableDates, setAvailableDates] = useState<BookingDate[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true);
      
      if (error) {
        toast.error('Failed to load services');
        return;
      }
      setServices(data || []);
    };
    fetchServices();
  }, []);

  // Fetch available dates when service is selected
  useEffect(() => {
    if (!selectedService) return;

    const fetchAvailableDates = async () => {
      const { data, error } = await supabase
        .from('booking_dates')
        .select('*')
        .eq('service_id', selectedService)
        .eq('available', true);
      
      if (error) {
        console.error('Error fetching dates:', error);
        return;
      }
      // Cast slots from Json to the correct type
      const formattedData = (data || []).map(item => ({
        ...item,
        slots: (item.slots as unknown) as Array<{ time: string; available: boolean }>
      }));
      setAvailableDates(formattedData);
    };
    fetchAvailableDates();
  }, [selectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !name || !email || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('reserve-slot', {
        body: {
          serviceId: selectedService,
          date: format(selectedDate, 'yyyy-MM-dd'),
          slotTime: selectedSlot || null,
          name,
          email,
          phone,
          message
        }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success('Booking request submitted! We\'ll contact you shortly.');
        // Reset form
        setSelectedDate(undefined);
        setSelectedSlot('');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const dateBooking = availableDates.find(
    d => selectedDate && d.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const availableSlots = dateBooking?.slots.filter(s => s.available) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl mb-4 text-foreground">Book Your Session</h1>
            <p className="text-muted-foreground text-lg">
              Reserve your date and let us capture your moments
            </p>
          </div>

          <form onSubmit={handleSubmit} className="afri-glass p-8 space-y-6">
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Service *</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - Starting from ${service.starting_price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            {selectedService && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Date *</label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      return !availableDates.some(d => d.date === dateStr);
                    }}
                    className="rounded-md border"
                  />
                </div>
              </div>
            )}

            {/* Slot Selection */}
            {selectedDate && availableSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Time Slot</label>
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      type="button"
                      variant={selectedSlot === slot.time ? 'default' : 'outline'}
                      onClick={() => setSelectedSlot(slot.time)}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+250 7XX XXX XXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your vision..."
                rows={4}
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Reserve Your Date'}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
