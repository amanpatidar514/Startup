import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(2),
  budget: z.string().optional(),
  date: z.string().optional(),
  message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

const Booking = () => {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { toast } = useToast();

  const onSubmit = (data: FormData) => {
    const subject = encodeURIComponent("New Booking Inquiry - AdWhey");
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone ?? "-"}\nCompany: ${data.company ?? "-"}\nService: ${data.service}\nBudget: ${data.budget ?? "-"}\nPreferred date: ${data.date ?? "-"}\n\nMessage:\n${data.message}`
    );
    window.location.href = `mailto:contact@adwhey.agency?subject=${subject}&body=${body}`;
    toast({ title: "Opening email...", description: "A draft email has been prepared in your client." });
    reset();
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Booking | Contact AdWhey</title>
        <meta name="description" content="Contact AdWhey and book your social media campaign. Fast responses and tailored strategies." />
        <link rel="canonical" href="/booking" />
      </Helmet>
      <Navbar />
      <main className="container py-12 md:py-16">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Contact & Booking</h1>
          <p className="text-muted-foreground">Tell us your goals. We’ll reply within 24 hours.</p>
        </header>
        <Card className="mx-auto max-w-3xl p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-1">
              <label className="mb-1 block text-sm">Name</label>
              <Input {...register("name")} placeholder="Your full name" aria-invalid={!!errors.name} />
            </div>
            <div className="md:col-span-1">
              <label className="mb-1 block text-sm">Email</label>
              <Input type="email" {...register("email")} placeholder="you@example.com" aria-invalid={!!errors.email} />
            </div>
            <div className="md:col-span-1">
              <label className="mb-1 block text-sm">Phone</label>
              <Input {...register("phone")} placeholder="Optional" />
            </div>
            <div className="md:col-span-1">
              <label className="mb-1 block text-sm">Company</label>
              <Input {...register("company")} placeholder="Optional" />
            </div>
            <div className="md:col-span-1">
              <label className="mb-1 block text-sm">Service</label>
              <Select onValueChange={(v)=> setValue("service", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social-ads">Paid Social Ads</SelectItem>
                  <SelectItem value="content">Content Production</SelectItem>
                  <SelectItem value="strategy">Social Strategy</SelectItem>
                  <SelectItem value="video">Video Production</SelectItem>
                  <SelectItem value="property">Property Seller Campaign</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("service")} />
            </div>
            <div className="md:col-span-1">
              <label className="mb-1 block text-sm">Budget</label>
              <Input {...register("budget")} placeholder="e.g. $2,000 - $5,000" />
            </div>
            <div className="md:col-span-1">
              <label className="mb-1 block text-sm">Preferred Date</label>
              <Input type="date" {...register("date")} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm">Message</label>
              <Textarea {...register("message")} rows={6} placeholder="Tell us about your brand, audience and goals" aria-invalid={!!errors.message} />
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-3">
              <Button type="submit" variant="hero" size="lg">Send Booking</Button>
            </div>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
