import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Megaphone, Camera, LineChart, Clapperboard, Building2, Target } from "lucide-react";

const items = [
  { icon: Megaphone, title: "Social Strategy", desc: "Channel mix, content pillars and growth roadmap tailored to your brand." },
  { icon: Camera, title: "Content Production", desc: "Photo, design and short-form video optimized for engagement." },
  { icon: LineChart, title: "Paid Social Ads", desc: "Full-funnel campaigns with creative testing and ROAS tracking." },
  { icon: Clapperboard, title: "Video Production", desc: "Crisp edits, hooks and motion graphics for Reels/Shorts." },
  { icon: Building2, title: "Property Seller Campaigns", desc: "Lead-gen, virtual tours and CRM-ready inquiries." },
  { icon: Target, title: "Analytics & Reporting", desc: "Dashboards and insights that guide weekly experimentation." },
];

const Services = () => {
  return (
    <section id="services" className="container py-16 md:py-24">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-bold">Our Services</h2>
        <p className="text-muted-foreground">Everything you need to grow across social—strategy to execution.</p>
      </header>
      <Separator className="mb-8" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="group p-6 transition-transform hover:-translate-y-0.5 hover:shadow-elegant">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-md bg-secondary">
                <Icon className="size-5" />
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Services;
