import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  booking_date: string;
  slot_time: string | null;
  status: string;
  payment_status: string;
  message: string | null;
  created_at: string;
  services: {
    name: string;
  };
}

const Admin = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin-login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBookings();

      // Set up realtime subscription
      const channel = supabase
        .channel('bookings-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings'
          },
          () => {
            fetchBookings();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin-login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-4xl mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your bookings and availability</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="afri-glass p-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{bookings.length}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
            </div>
          </Card>
          <Card className="afri-glass p-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{pendingBookings.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>
          <Card className="afri-glass p-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{confirmedBookings.length}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bookings Table */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <BookingsList bookings={bookings} onUpdateStatus={updateBookingStatus} />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <BookingsList bookings={pendingBookings} onUpdateStatus={updateBookingStatus} />
          </TabsContent>

          <TabsContent value="confirmed" className="mt-6">
            <BookingsList bookings={confirmedBookings} onUpdateStatus={updateBookingStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const BookingsList = ({ 
  bookings, 
  onUpdateStatus 
}: { 
  bookings: Booking[];
  onUpdateStatus: (id: string, status: string) => void;
}) => (
  <div className="space-y-4">
    {bookings.length === 0 ? (
      <p className="text-center text-muted-foreground py-8">No bookings found</p>
    ) : (
      bookings.map((booking) => (
        <Card key={booking.id} className="afri-glass p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{booking.name}</h3>
                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                  {booking.status}
                </Badge>
                <Badge variant={booking.payment_status === 'paid' ? 'default' : 'outline'}>
                  {booking.payment_status}
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <p>📧 {booking.email}</p>
                <p>📱 {booking.phone}</p>
                <p>🎯 {booking.services.name}</p>
                <p>📅 {format(new Date(booking.booking_date), 'PPP')} {booking.slot_time && `at ${booking.slot_time}`}</p>
              </div>
              {booking.message && (
                <p className="mt-2 text-sm italic">💬 {booking.message}</p>
              )}
            </div>
            <div className="flex md:flex-col gap-2">
              {booking.status === 'pending' && (
                <Button 
                  size="sm" 
                  onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                >
                  Confirm
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onUpdateStatus(booking.id, 'cancelled')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ))
    )}
  </div>
);

export default Admin;
