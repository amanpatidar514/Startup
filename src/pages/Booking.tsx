import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Briefcase, DollarSign, MessageCircle, Loader2, LogIn, Plus, Edit2, Trash2, CalendarDays, RefreshCw, Send, Clock, Shield, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { COUNTRIES, type CountryCode, buildStoredBudget } from "@/lib/currency";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  mobile: z.string().min(6, "Please enter a valid mobile number"),
  service: z.string().min(1, "Please select a service"),
  budget: z.string().min(1, "Please enter your budget"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type BookingForm = z.infer<typeof bookingSchema>;

const Booking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [country, setCountry] = useState<CountryCode>('IN');
  const [dialCode, setDialCode] = useState<string>(COUNTRIES['IN'].dialCode);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  // Check auth and preload data
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email || null;
      setUserEmail(email);
      setAuthChecking(false);
      
      if (email) {
        setValue("email", email);
        fetchMyBookings(email);
      }
    };
    init();
    const { data: listener } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      const email = session?.user?.email || null;
      setUserEmail(email);
      if (email) {
        setValue("email", email);
        fetchMyBookings(email);
      } else {
        setMyBookings([]);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [setValue]);

  useEffect(() => {
    setDialCode(COUNTRIES[country].dialCode);
  }, [country]);

  const fetchMyBookings = async (email: string) => {
    setLoadingBookings(true);
    try {
      const sb: any = supabase;
      const { data, error } = await sb
        .from('bookings')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });
      if (error) {
        console.error(error);
      } else {
        setMyBookings(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const onSubmit = async (data: BookingForm) => {
    setLoading(true);
    
    try {
      const sb: any = supabase;
      const currency = COUNTRIES[country].currency;
      const normalizedBudget = buildStoredBudget(currency, data.budget);
      const fullMobile = `${dialCode} ${data.mobile}`.trim();
      // Insert or update depending on editing state
      if (editingId) {
        const { error } = await sb
          .from('bookings')
          .update({
            name: data.name,
            email: data.email,
            mobile: fullMobile,
            service: data.service,
            budget: normalizedBudget,
            message: data.message,
          })
          .eq('id', editingId);

        if (error) {
          console.error('Supabase error:', error);
          toast.error(error.message || "Failed to submit booking. Please try again.");
        } else {
          toast.success("Booking updated.");
          setEditingId(null);
          if (userEmail) fetchMyBookings(userEmail);
          reset({ name: "", email: userEmail || "", mobile: "", service: "", budget: "", message: "" });
        }
      } else {
        const { data: inserted, error } = await sb
          .from('bookings')
          .insert([
            {
              name: data.name,
              email: data.email,
              mobile: fullMobile,
              service: data.service,
              budget: normalizedBudget,
              message: data.message,
              status: 'pending'
            }
          ])
          .select('*')
          .single();

        if (error) {
          console.error('Supabase error:', error);
          toast.error(error.message || "Failed to submit booking. Please try again.");
        } else {
          // Silent admin notification via webhook if configured
          await sendEmailNotification({
            ...data,
            id: inserted?.id,
            created_at: inserted?.created_at,
          } as any);

          toast.success("Booking submitted successfully!");
          if (userEmail) {
            fetchMyBookings(userEmail);
          }
          reset({ name: "", email: userEmail || "", mobile: "", service: "", budget: "", message: "" });
        }
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendEmailNotification = async (bookingData: any) => {
    try {
      // Use Supabase Edge Function to send email
      const { data, error } = await supabase.functions.invoke('notify-admin', {
        body: {
          subject: 'New Booking Submitted',
          adminEmail: 'adwheyofficial@gmail.com',
          booking: bookingData,
        }
      });
      if (error) {
        console.error('Edge function error:', error);
      } else {
        console.debug('Admin notified (edge):', data);
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const handleEdit = (b: any) => {
    setEditingId(b.id);
    setValue('name', b.name);
    setValue('email', b.email);
    setValue('mobile', b.mobile || '');
    setValue('service', b.service);
    setValue('budget', b.budget);
    setValue('message', b.message);
  };

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    setMyBookings((prev) => prev.filter((b) => b.id !== id));
    try {
      const sb: any = supabase;
      const { error } = await sb.from('bookings').delete().eq('id', id);
      if (error) {
        toast.error(error.message || 'Failed to delete booking');
        // Re-sync in case optimistic update was wrong
        if (userEmail) fetchMyBookings(userEmail);
      } else {
        toast.success('Booking deleted');
        if (editingId === id) {
          setEditingId(null);
          reset({ name: "", email: userEmail || "", mobile: "", service: "", budget: "", message: "" });
        }
      }
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong');
      if (userEmail) fetchMyBookings(userEmail);
    }
  };

  const ld = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Book AdWhey Services",
    url: "/booking",
    description: "Book social media marketing services with AdWhey.",
  };

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
        <title>Book Services | AdWhey</title>
        <meta name="description" content="Book AdWhey's social media marketing and content creation services." />
      </Helmet>
      
      <Navbar />
      
             {authChecking ? (
         <main className="section-padding relative z-10 pt-16 md:pt-24">
           <div className="container">
             <div className="flex items-center justify-center min-h-[60vh]">
               <div className="text-center">
                 <div className="inline-flex items-center gap-2 text-cyan-400 mb-4">
                   <RefreshCw className="w-6 h-6 animate-spin" />
                   Checking authentication...
                 </div>
                 <p className="text-gray-300">Please wait while we verify your access.</p>
               </div>
             </div>
           </div>
         </main>
       ) : !userEmail ? (
         <main className="section-padding relative z-10 pt-16 md:pt-24">
           <div className="container">
             <div className="flex items-center justify-center min-h-[60vh]">
               <div className="text-center max-w-2xl mx-auto">
                 <div className="mb-8">
                   <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <LogIn className="w-12 h-12 text-white" />
                   </div>
                   <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                     Sign In to <span className="text-gradient-ocean">Book Services</span>
                   </h1>
                   <p className="text-xl text-gray-300 mb-8">
                     To book our services and start your project, please sign in to your account or create a new one.
                   </p>
                 </div>
                 
                 <div className="grid gap-4 md:grid-cols-2 max-w-md mx-auto">
                   <Button 
                     onClick={() => navigate('/auth?tab=signin')}
                     className="btn-ocean hover:scale-105 transition-all duration-300"
                   >
                     <LogIn className="w-5 h-5 mr-2" />
                     Sign In
                   </Button>
                   <Button 
                     onClick={() => navigate('/auth?tab=signup')}
                     variant="outline"
                     className="btn-ocean-outline hover:scale-105 transition-all duration-300"
                   >
                     <Plus className="w-5 h-5 mr-2" />
                     Sign Up
                   </Button>
                 </div>
                 
                 <div className="mt-8 p-6 bg-ocean-card border border-cyan-500/20 rounded-lg">
                   <h3 className="text-lg font-semibold text-white mb-3">Why Sign Up?</h3>
                   <div className="grid gap-3 text-sm text-gray-300">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                       <span>Track your booking status and progress</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                       <span>Manage multiple project requests</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                       <span>Receive updates and communications</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                       <span>Access your project history</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </main>
       ) : (
         <main className="section-padding relative z-10 pt-16 md:pt-24">
        <div className="container">
          {/* Header */}
          <header className="text-center mb-16 relative isolate">
            {/* Enhanced Ocean Glow behind heading */}
            <div aria-hidden className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
              <div className="w-[95%] max-w-4xl h-32 rounded-full blur-2xl bg-gradient-to-r from-cyan-400/30 via-blue-400/25 to-cyan-500/20"></div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 inline-block relative z-10">
              <span className="relative z-10">Book Our <span className="text-gradient-ocean">Services</span></span>
              {/* Soft Ocean glow underline */}
              <span aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 w-[120%] h-4 rounded-full blur-lg bg-gradient-to-r from-cyan-400/40 via-blue-400/30 to-cyan-500/40"></span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to transform your social media presence? Let's discuss your project and create something amazing together.
            </p>
          </header>

          {/* Booking Form */}
          <div className="max-w-4xl mx-auto px-4">
            <Card className="bg-ocean-card border-cyan-500/20 shadow-ocean">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-white">Project Details</CardTitle>
                <CardDescription className="text-lg text-gray-300">
                  Tell us about your project and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Full Name *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className="bg-black/30 border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder:text-gray-400"
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-400">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="bg-black/30 border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder:text-gray-400"
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-white">Mobile Number *</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <Label className="sr-only">Country</Label>
                        <Select value={country} onValueChange={(val) => setCountry(val as CountryCode)}>
                          <SelectTrigger className="w-full bg-black/50 border border-cyan-500/30 text-white">
                            <SelectValue placeholder="Country" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/95 border border-cyan-500/30 text-white">
                            <SelectItem value="IN">🇮🇳 India (+91)</SelectItem>
                            <SelectItem value="US">🇺🇸 United States (+1)</SelectItem>
                            <SelectItem value="UK">🇬🇧 United Kingdom (+44)</SelectItem>
                            <SelectItem value="EU">🇪🇺 European Union (+49)</SelectItem>
                            <SelectItem value="AE">🇦🇪 United Arab Emirates (+971)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 flex">
                        <div className="px-3 flex items-center justify-center bg-black/50 border border-cyan-500/30 text-white rounded-l-md text-sm whitespace-nowrap">{dialCode}</div>
                        <Input
                          id="mobile"
                          {...register("mobile")}
                          className="bg-black/30 border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder:text-gray-400 rounded-l-none"
                          placeholder="Enter your mobile number"
                        />
                      </div>
                    </div>
                    {errors.mobile && (
                      <p className="text-sm text-red-400">{errors.mobile.message}</p>
                    )}
                  </div>

                  {/* Service and Budget */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="service" className="text-white font-medium">
                          Service Type *
                        </Label>
                        <Select onValueChange={(value) => setValue('service', value)}>
                          <SelectTrigger className="w-full bg-black/50 border border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20">
                            <SelectValue placeholder="Select a service" className="text-white" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/95 border border-cyan-500/30 text-white">
                            <SelectItem value="social-strategy" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">Social Strategy</SelectItem>
                            <SelectItem value="content-production" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">Content Production</SelectItem>
                            <SelectItem value="paid-social-ads" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">Paid Social Ads</SelectItem>
                            <SelectItem value="video-production" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">Video Production</SelectItem>
                            <SelectItem value="property-campaigns" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">Property Seller Campaigns</SelectItem>
                            <SelectItem value="analytics-reporting" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">Analytics & Reporting</SelectItem>
                            <SelectItem value="instagram-smm" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">Instagram SMM</SelectItem>
                            <SelectItem value="youtube-smm" className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">YouTube SMM</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.service && (
                          <p className="text-sm text-red-400">{errors.service.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="budget" className="text-white font-medium">
                          Budget Range *
                        </Label>
                        <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Showing budgets for {COUNTRIES[country].name} ({COUNTRIES[country].currency})
                        </div>
                        <Select onValueChange={(value) => setValue('budget', value)}>
                          <SelectTrigger className="w-full bg-black/50 border border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20">
                            <SelectValue placeholder="Select budget range" className="text-white" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/95 border border-cyan-500/30 text-white">
                            {COUNTRIES[country].budgetRanges.map((r) => (
                              <SelectItem key={r.value} value={r.value} className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/20">{r.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.budget && (
                          <p className="text-sm text-red-400">{errors.budget.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Project Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white">Project Details *</Label>
                                         <Textarea
                       id="message"
                       {...register("message")}
                       rows={6}
                       className="bg-black/30 border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder:text-gray-400 resize-none"
                       placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                     />
                    {errors.message && (
                      <p className="text-sm text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-4 text-lg btn-ocean hover:scale-105 transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Booking
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <Card className="bg-ocean-card border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    We typically respond to all inquiries within 24 hours. For urgent projects, 
                    please mention your timeline in the message.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-ocean-card border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="w-5 h-5 text-green-400" />
                    Free Consultation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    All project discussions and consultations are completely free. 
                    We'll help you understand the best approach for your goals.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Your Bookings Section - Only show if user has bookings */}
            {userEmail && myBookings && myBookings.length > 0 && (
              <div className="mt-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text white mb-2">
                    Your <span className="text-gradient-ocean">Bookings</span>
                  </h2>
                  <p className="text-gray-300">View and manage your existing project requests</p>
                </div>
                
                {loadingBookings ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 text-cyan-400">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Loading your bookings...
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {myBookings.map((booking) => (
                      <Card key={booking.id} className="bg-ocean-card border-cyan-500/20 shadow-ocean">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">{booking.name}</h3>
                                <Badge 
                                  variant={
                                    booking.status === 'confirmed' ? 'default' : 
                                    booking.status === 'completed' ? 'secondary' : 'outline'
                                  }
                                  className={
                                    booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                    booking.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                  }
                                >
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-gray-300 text-sm mb-2">{booking.service}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <span>Budget: {booking.budget}</span>
                                {booking.mobile && <span>Mobile: {booking.mobile}</span>}
                                <span>Created: {new Date(booking.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                                onClick={() => handleEdit(booking)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                onClick={() => handleDelete(booking.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      )}
      
      <Footer />
    </div>
  );
};

export default Booking;
