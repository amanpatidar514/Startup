import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  User, Mail, Building, Phone, Save, LogOut, Edit, Calendar, 
  Shield, Settings, Activity, Star, Award, TrendingUp, RefreshCw,
  CheckCircle, AlertCircle, Clock, Globe, Briefcase
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    phone: '',
    bio: ''
  });
  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    completedBookings: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please sign in to access your profile",
        });
        navigate('/auth');
        return;
      }
      setUser(session.user);
      await fetchProfile(session.user.id);
      await fetchBookingStats(session.user.email || '');
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Profile Load Error",
          description: "Failed to load profile",
        });
      } else if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          company_name: data.company_name || '',
          phone: data.phone || '',
          bio: data.bio || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingStats = async (userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('email', userEmail);

      if (error) {
        console.error('Error fetching booking stats:', error);
      } else {
        const totalBookings = data?.length || 0;
        const completedBookings = data?.filter(booking => booking.status === 'completed').length || 0;
        setBookingStats({ totalBookings, completedBookings });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Try UPDATE first (works if row already exists and user has update rights)
      const { data: updated, error: updateError } = await supabase
        .from('users')
        .update({
          email: user.email,
          full_name: formData.full_name,
          company_name: formData.company_name,
          phone: formData.phone,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select('id')
        .single();

      if (!updateError) {
        toast({
          title: "Profile Updated",
          description: "Profile updated successfully",
        });
        setEditing(false);
        await fetchProfile(user.id);
        setSaving(false);
        return;
      }

      // If no row found or not allowed, attempt INSERT (requires insert policy)
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          full_name: formData.full_name,
          company_name: formData.company_name,
          phone: formData.phone,
          bio: formData.bio,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        toast({
          variant: "destructive",
          title: "Save Error",
          description: insertError.message || "Failed to save profile",
        });
      } else {
        toast({
          title: "Profile Saved",
          description: "Profile saved successfully",
        });
        setEditing(false);
        await fetchProfile(user.id);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Something went wrong",
      });
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getMemberSince = () => {
    if (!profile?.created_at) return 'N/A';
    const date = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const getLastUpdated = () => {
    if (!profile?.updated_at) return 'N/A';
    const date = new Date(profile.updated_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full relative bg-black">
        {/* Ocean Abyss Background with Top Glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000",
          }}
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-400" />
            <p className="text-lg font-medium text-white">Loading Profile...</p>
          </div>
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
        <title>Profile | AdWhey</title>
        <meta name="description" content="Manage your AdWhey profile and account settings." />
      </Helmet>
      
      <Navbar />
      
      <main className="container py-8 relative z-10 pt-16 md:pt-24 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, <span className="text-gradient-ocean">{(profile?.full_name || user?.user_metadata?.full_name || 'User').split(' ')[0]}</span>
            </h1>
            <p className="text-gray-300">Manage your account settings and view your information</p>
          </div>
          <Button 
            onClick={signOut} 
            variant="outline" 
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-ocean-card border-cyan-500/20 shadow-ocean">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                    {profile?.full_name?.[0] || user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {profile?.full_name || user?.user_metadata?.full_name || 'User Name'}
                  </h2>
                  <p className="text-gray-300 text-sm">{user?.email}</p>
                </div>
                
                <Separator className="my-4 bg-cyan-500/20" />
                
                {/* Booking Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Total Bookings</span>
                    <span className="text-cyan-400 text-sm font-medium">{bookingStats.totalBookings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Completed Projects</span>
                    <span className="text-green-400 text-sm font-medium">{bookingStats.completedBookings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <Card className="bg-ocean-card border-cyan-500/20 hover:shadow-ocean transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl text-white">
                      <User className="w-6 h-6 text-cyan-400" />
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-base mt-2 text-gray-300">
                      Update your personal and professional details
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {editing ? (
                      <>
                        <Button
                          onClick={saveProfile}
                          disabled={saving}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          onClick={() => {
                            setEditing(false);
                            setFormData({
                              full_name: profile?.full_name || '',
                              company_name: profile?.company_name || '',
                              phone: profile?.phone || '',
                              bio: profile?.bio || ''
                            });
                          }}
                          variant="outline"
                          className="hover:bg-gray-500/10 hover:border-gray-400/50 border-gray-500/30 text-gray-400 transition-all duration-200"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setEditing(true)}
                        variant="outline"
                        className="hover:bg-cyan-500/10 hover:border-cyan-400/50 border-cyan-500/30 text-cyan-400 transition-all duration-200"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email (Read-only) */}
                <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30">
                  <Label className="flex items-center gap-2 font-semibold text-cyan-400">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    value={user?.email || ''}
                    disabled
                    className="mt-2 bg-black/30 border-cyan-500/30 text-white font-medium"
                  />
                  <p className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Email cannot be changed for security reasons
                  </p>
                </div>

                {/* Full Name */}
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/30">
                  <Label htmlFor="full_name" className="flex items-center gap-2 font-semibold text-purple-400">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    disabled={!editing}
                    className="mt-2 bg-black/30 border-purple-500/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 text-white transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                  {!editing && !formData.full_name && (
                    <p className="text-xs text-purple-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Add your name to complete your profile
                    </p>
                  )}
                </div>

                {/* Company Name */}
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/30">
                  <Label htmlFor="company_name" className="flex items-center gap-2 font-semibold text-green-400">
                    <Building className="w-4 h-4" />
                    Company Name
                  </Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    disabled={!editing}
                    className="mt-2 bg-black/30 border-green-500/30 focus:border-green-400 focus:ring-2 focus:ring-green-500/20 text-white transition-all duration-200"
                    placeholder="Enter your company name"
                  />
                </div>

                {/* Phone */}
                <div className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg border border-orange-500/30">
                  <Label htmlFor="phone" className="flex items-center gap-2 font-semibold text-orange-400">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!editing}
                    className="mt-2 bg-black/30 border-orange-500/30 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 text-white transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Bio */}
                <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 rounded-lg border border-indigo-500/30">
                  <Label htmlFor="bio" className="flex items-center gap-2 font-semibold text-indigo-400">
                    <Activity className="w-4 h-4" />
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!editing}
                    rows={4}
                    className="mt-2 bg-black/30 border-indigo-500/30 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 text-white transition-all duration-200 resize-none"
                    placeholder="Tell us about yourself, your expertise, or what you're looking for..."
                  />
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-lg border border-gray-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-white">Member Since</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 rounded-lg border border-cyan-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-white">Last Updated</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile; 