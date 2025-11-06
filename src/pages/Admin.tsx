import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { 
  RefreshCw, Mail, Calendar, Trash2, Download, User, LogOut, Plus, 
  TrendingUp, Users, DollarSign, Activity, BarChart3, PieChart,
  Search, Filter, Eye, Edit, MoreHorizontal, ArrowUpRight, ArrowDownRight, Phone
} from "lucide-react";
import { parseStoredBudget, convertRangeToINR } from "@/lib/currency";

interface Booking {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  service: string;
  budget: string;
  message: string;
  status: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'users' | 'analytics'>('overview');
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to access admin dashboard");
        navigate('/auth');
        return;
      }

      // Check if user is admin (restrict to specific emails)
      const adminEmails = [
        'adwheyofficial@gmail.com',
        // Add more admin emails here
      ];
      
      if (!adminEmails.includes(session.user.email || '')) {
        toast.error("Access denied. Admin privileges required.");
        navigate('/');
        return;
      }

      setUser(session.user);
      fetchBookings();
      fetchUsers();
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast.error("Failed to load bookings");
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        // Filter out admin users from the count
        const adminEmails = [
          'adwheyofficial@gmail.com',
          // Add more admin emails here
        ];
        const nonAdminUsers = (data || []).filter(user => !adminEmails.includes(user.email));
        setUsers(nonAdminUsers);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) {
        toast.error("Failed to update status");
      } else {
        toast.success("Status updated successfully");
        fetchBookings();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteBooking = async (id: string) => {
    setDeletingBookingId(id);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("Failed to delete booking");
      } else {
        toast.success("Booking deleted successfully");
        fetchBookings();
        setShowDeleteDialog(null);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingBookingId(null);
    }
  };

  const exportData = () => {
    const data = activeTab === 'bookings' ? bookings : users;
    const csvContent = "data:text/csv;charset=utf-8," + 
      (activeTab === 'bookings' 
        ? "Name,Email,Mobile,Service,Budget(INR),Budget(Original),Status,Date\n" +
          data.map((item: any) => {
            const parsed = parseStoredBudget(item.budget);
            if (parsed) {
              const inr = convertRangeToINR(parsed.currency, parsed.range);
              return `${item.name},${item.email},${item.mobile || ''},${item.service},${inr},${parsed.currency} ${parsed.range},${item.status},${item.created_at}`;
            }
            return `${item.name},${item.email},${item.mobile || ''},${item.service},${item.budget},${item.budget},${item.status},${item.created_at}`;
          }).join("\n")
        : "Email,Full Name,Company,Date\n" +
          data.map((item: any) => 
            `${item.email},${item.full_name || ''},${item.company_name || ''},${item.created_at}`
          ).join("\n")
      );
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${activeTab} data exported successfully`);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtered data
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (booking.mobile && booking.mobile.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalUsers = users.length;
  const recentBookings = bookings.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  // Service distribution
  const serviceStats = bookings.reduce((acc, booking) => {
    acc[booking.service] = (acc[booking.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Monthly trends - actual data from bookings
  const getMonthlyTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyData = new Array(12).fill(0);
    
    bookings.forEach(booking => {
      const bookingDate = new Date(booking.created_at);
      if (bookingDate.getFullYear() === currentYear) {
        const month = bookingDate.getMonth();
        monthlyData[month]++;
      }
    });
    
    return { months, data: monthlyData };
  };

  const { months, data: monthlyData } = getMonthlyTrends();
  const maxMonthlyBookings = Math.max(...monthlyData, 1); // Prevent division by zero

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gradient-primary" />
          <p className="text-lg font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Ocean Abyss Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000",
        }}
      />
      
      <Helmet>
        <title>Admin Dashboard | AdWhey</title>
        <meta name="description" content="Admin dashboard for managing AdWhey bookings and inquiries." />
      </Helmet>
      
      <Navbar />
      
      <main className="container py-8 relative z-10 pt-16 md:pt-24 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
            </div>
            <Button onClick={signOut} variant="outline" className="border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 transition-all duration-200">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-ocean-card border-cyan-500/20 hover:shadow-ocean transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyan-400">Total Bookings</p>
                    <p className="text-3xl font-bold text-white">{totalBookings}</p>
                  </div>
                  <div className="p-3 bg-cyan-500 rounded-full">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-cyan-400">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>{totalBookings > 0 ? `${totalBookings} total bookings` : 'No bookings yet'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-ocean-card border-cyan-500/20 hover:shadow-ocean transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-400">Pending</p>
                    <p className="text-3xl font-bold text-white">{pendingBookings}</p>
                  </div>
                  <div className="p-3 bg-yellow-500 rounded-full">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-yellow-400">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span>{pendingBookings > 0 ? `${pendingBookings} pending` : 'All caught up'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-ocean-card border-cyan-500/20 hover:shadow-ocean transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-400">Confirmed</p>
                    <p className="text-3xl font-bold text-white">{confirmedBookings}</p>
                  </div>
                  <div className="p-3 bg-green-500 rounded-full">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-green-400">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>{confirmedBookings > 0 ? `${confirmedBookings} confirmed` : 'No confirmed bookings'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-ocean-card border-cyan-500/20 hover:shadow-ocean transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-400">Total Users</p>
                    <p className="text-3xl font-bold text-white">{totalUsers}</p>
                  </div>
                  <div className="p-3 bg-purple-500 rounded-full">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-purple-400">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>{totalUsers > 0 ? `${totalUsers} registered users` : 'No users yet'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          <TabsList className="w-full flex md:grid md:grid-cols-4 gap-2 bg-ocean-card backdrop-blur-sm border border-cyan-500/20 p-1 overflow-x-auto md:overflow-x-hidden scrollbar-hide">
            <TabsTrigger value="overview" className="min-w-[7rem] md:min-w-[9rem] text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-300">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="min-w-[7rem] md:min-w-[9rem] text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="users" className="min-w-[7rem] md:min-w-[9rem] text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="min-w-[7rem] md:min-w-[9rem] text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-300">
              <PieChart className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card className="bg-ocean-card border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    Recent Bookings
                  </CardTitle>
                  <CardDescription className="text-gray-300">Latest booking inquiries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-cyan-500/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">{booking.name[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{booking.name}</p>
                            <p className="text-sm text-gray-300">{booking.service}</p>
                            {booking.mobile && (
                              <p className="text-xs text-gray-400">{booking.mobile}</p>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Distribution */}
              <Card className="bg-ocean-card border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    Service Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-300">Most requested services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(serviceStats).map(([service, count]) => (
                      <div key={service} className="flex items-center justify-between">
                        <span className="font-medium text-white">{service}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(count / totalBookings) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-300">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-ocean-card border-cyan-500/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by name, email, mobile, or service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-black/30 border-cyan-500/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48 bg-black/30 border-cyan-500/30 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 border border-cyan-500/30 text-white z-50">
                      <SelectItem value="all" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">All Status</SelectItem>
                      <SelectItem value="pending" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">Pending</SelectItem>
                      <SelectItem value="contacted" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">Contacted</SelectItem>
                      <SelectItem value="confirmed" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">Confirmed</SelectItem>
                      <SelectItem value="completed" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={fetchBookings} variant="outline" disabled={loading} className="w-full md:w-auto border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50">
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button onClick={exportData} variant="outline" className="w-full md:w-auto border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bookings List */}
            {loading ? (
              <Card className="bg-ocean-card border-cyan-500/20">
                <CardContent className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-400" />
                  <p className="text-white">Loading bookings...</p>
                </CardContent>
              </Card>
            ) : filteredBookings.length === 0 ? (
              <Card className="bg-ocean-card border-cyan-500/20">
                <CardContent className="text-center py-12">
                  <p className="text-gray-300">No bookings found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id} className="bg-ocean-card border-cyan-500/20 hover:shadow-ocean transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-base md:text-lg">{booking.name[0]}</span>
                          </div>
                                                      <div>
                              <CardTitle className="flex items-center gap-2 md:gap-3 text-white text-sm md:text-base">
                                {booking.name}
                                <Badge className={`${getStatusColor(booking.status)} text-xs`}>
                                  {booking.status}
                                </Badge>
                              </CardTitle>
                            <CardDescription className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-gray-300 min-w-0 text-xs md:text-sm">
                              <span className="flex items-center gap-1 break-all max-w-full">
                                <Mail className="w-3 h-3 md:w-4 md:h-4" />
                                {booking.email}
                              </span>
                              {booking.mobile && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 md:w-4 md:h-4" />
                                  {booking.mobile}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                {formatDate(booking.created_at)}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2 mt-4 md:mt-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(booking.id, 'contacted')}
                            disabled={booking.status === 'contacted'}
                            className="hover:bg-blue-500/10 hover:border-blue-400/50 border-blue-500/30 text-blue-400 whitespace-nowrap text-xs md:text-sm"
                          >
                            Mark Contacted
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            disabled={booking.status === 'confirmed'}
                            className="hover:bg-green-500/10 hover:border-green-400/50 border-green-500/30 text-green-400 whitespace-nowrap text-xs md:text-sm"
                          >
                            Mark Confirmed
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(booking.id, 'completed')}
                            disabled={booking.status === 'completed'}
                            className="hover:bg-gray-500/10 hover:border-gray-400/50 border-gray-500/30 text-gray-400 whitespace-nowrap text-xs md:text-sm"
                          >
                            Mark Completed
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(booking.id)}
                            disabled={deletingBookingId === booking.id}
                            className="hover:bg-red-500/10 hover:border-red-400/50 border-red-500/30 text-red-400 whitespace-nowrap text-xs md:text-sm"
                          >
                            {deletingBookingId === booking.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                          
                          <Dialog 
                            open={showDeleteDialog === booking.id} 
                            onOpenChange={(open) => {
                              if (!deletingBookingId || deletingBookingId !== booking.id) {
                                setShowDeleteDialog(open ? booking.id : null);
                              }
                            }}
                          >
                            <DialogContent className="bg-black/95 backdrop-blur-xl border border-cyan-500/30 shadow-2xl max-w-[90vw] sm:max-w-lg mx-4">
                              <DialogHeader className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                                  <Trash2 className="w-8 h-8 text-red-400" />
                                </div>
                                <DialogTitle className="text-2xl font-bold text-white">Delete Booking</DialogTitle>
                                <DialogDescription className="text-gray-300 text-base mt-2">
                                  Are you sure you want to delete this booking? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                               <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setShowDeleteDialog(null)}
                                  disabled={deletingBookingId === booking.id}
                                  className="px-6 py-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all duration-200"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => deleteBooking(booking.id)}
                                  disabled={deletingBookingId === booking.id}
                                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                  {deletingBookingId === booking.id ? (
                                    <>
                                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    'Delete'
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 bg-black/30 rounded-lg border border-cyan-500/20">
                          <h4 className="font-semibold mb-2 text-cyan-400">Service & Budget</h4>
                          <p className="text-sm text-gray-300 mb-1">
                            <strong>Service:</strong> {booking.service}
                          </p>
                          <p className="text-sm text-gray-300 mb-1">
                            <strong>Budget:</strong>{' '}
                            {(() => {
                              const parsed = parseStoredBudget(booking.budget);
                              if (!parsed) return booking.budget;
                              const inr = convertRangeToINR(parsed.currency, parsed.range);
                              // Show: INR value (CURRENCY original)
                              return (
                                <span>
                                  {inr} ({parsed.currency} {parsed.range})
                                </span>
                              );
                            })()}
                          </p>
                          {booking.mobile && (
                            <p className="text-sm text-gray-300">
                              <strong>Mobile:</strong> {booking.mobile}
                            </p>
                          )}
                        </div>
                        <div className="p-4 bg-black/30 rounded-lg border border-cyan-500/20">
                          <h4 className="font-semibold mb-2 text-green-400">Message</h4>
                          <p className="text-sm text-gray-300">
                            {booking.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-ocean-card border-cyan-500/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Registered Users</h3>
                    <p className="text-sm text-gray-300">Total: {users.length} users</p>
                  </div>
                  <Button onClick={exportData} variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50">
                    <Download className="w-4 h-4 mr-2" />
                    Export Users
                  </Button>
                </div>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-cyan-500/20 hover:bg-black/40 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {(user.full_name || user.email)[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.full_name || 'No Name'}</p>
                          <p className="text-sm text-gray-300">{user.email}</p>
                          {user.company_name && (
                            <p className="text-xs text-cyan-400">{user.company_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-300">
                          Joined {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card className="bg-ocean-card border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Monthly Trends
                  </CardTitle>
                  <CardDescription className="text-gray-300">Booking growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-center gap-1.5 md:gap-2 overflow-x-hidden overflow-y-hidden sm:overflow-x-auto pr-0">
                    {monthlyData.map((value, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="min-w-[1.25rem] w-5 md:min-w-[1.5rem] md:w-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-sm transition-all duration-500 hover:from-cyan-400 hover:to-blue-400"
                          style={{ height: `${(value / maxMonthlyBookings) * 200}px` }}
                        ></div>
                        <span className="text-[10px] md:text-xs text-gray-300 mt-1 md:mt-2">
                          {months[index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card className="bg-ocean-card border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    Status Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-300">Current booking statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { status: 'Pending', count: pendingBookings, color: 'bg-yellow-500' },
                      { status: 'Contacted', count: bookings.filter(b => b.status === 'contacted').length, color: 'bg-blue-500' },
                      { status: 'Confirmed', count: confirmedBookings, color: 'bg-green-500' },
                      { status: 'Completed', count: bookings.filter(b => b.status === 'completed').length, color: 'bg-gray-500' }
                    ].filter(item => item.count > 0).map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                          <span className="font-medium text-white">{item.status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div 
                              className={`${item.color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${totalBookings > 0 ? (item.count / totalBookings) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-300">{item.count}</span>
                        </div>
                      </div>
                    ))}
                    {totalBookings === 0 && (
                      <div className="text-center text-gray-400 py-4">
                        No bookings data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin; 