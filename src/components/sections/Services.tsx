import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Megaphone, Camera, LineChart, Clapperboard, Building2, Target, ArrowRight, Sparkles, CheckCircle, Star, Instagram, Play } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { 
    icon: Megaphone, 
    title: "Social Strategy", 
    desc: "Channel mix, content pillars and growth roadmap tailored to your brand.",
    gradient: "from-emerald-500 to-blue-500",
    color: "text-emerald-600"
  },
  { 
    icon: Camera, 
    title: "Content Production", 
    desc: "Photo, design and short-form video optimized for engagement.",
    gradient: "from-blue-500 to-purple-500",
    color: "text-blue-600"
  },
  { 
    icon: LineChart, 
    title: "Paid Social Ads", 
    desc: "Full-funnel campaigns with creative testing and ROAS tracking.",
    gradient: "from-purple-500 to-pink-500",
    color: "text-purple-600"
  },
  { 
    icon: Clapperboard, 
    title: "Video Production", 
    desc: "Crisp edits, hooks and motion graphics for Reels/Shorts.",
    gradient: "from-pink-500 to-red-500",
    color: "text-pink-600"
  },
  { 
    icon: Building2, 
    title: "Property Seller Campaigns", 
    desc: "Lead-gen, virtual tours and CRM-ready inquiries.",
    gradient: "from-red-500 to-orange-500",
    color: "text-red-600"
  },
  { 
    icon: Target, 
    title: "Analytics & Reporting", 
    desc: "Dashboards and insights that guide weekly experimentation.",
    gradient: "from-orange-500 to-yellow-500",
    color: "text-orange-600"
  },
];

const Services = () => {
  return (
    <section id="services" className="section-padding relative">
      {/* Ocean Abyss Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000",
        }}
      />
      
      <div className="container relative z-10 px-4">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-full shadow-ocean mb-6">
            <Sparkles className="w-4 h-4" />
            Our Services
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
            Everything you need to{" "}
            <span className="text-gradient-ocean">grow across social</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            From strategy to execution, we handle every aspect of your social media presence 
            with proven methodologies and cutting-edge tools.
          </p>
        </header>
        
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc, gradient, color }, index) => (
            <Card 
              key={title} 
              className="group card-interactive overflow-hidden relative cursor-pointer bg-ocean-card border-cyan-500/20 hover:shadow-ocean transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Interactive Icon Container */}
              <div className="relative p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className={`relative p-4 rounded-xl bg-gradient-to-r ${gradient} shadow-lg group-hover:shadow-ocean transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-gradient-ocean transition-all duration-300">{title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">{desc}</p>
                
                {/* Hover Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Instagram & YouTube SMM Services */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Instagram SMM */}
          <Link to="/instagram-smm">
            <Card className="group card-interactive overflow-hidden relative cursor-pointer hover:shadow-ocean transition-all duration-500 bg-ocean-card border-cyan-500/20">
              <div className="relative p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative p-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg group-hover:shadow-ocean transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-gradient-ocean transition-all duration-300">Instagram SMM</h3>
                </div>
                <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 mb-4">
                  Complete Instagram marketing solutions including content creation, growth strategies, and engagement optimization.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Click to learn more</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          {/* YouTube SMM */}
          <Link to="/youtube-smm">
            <Card className="group card-interactive overflow-hidden relative cursor-pointer hover:shadow-ocean transition-all duration-500 bg-ocean-card border-cyan-500/20">
              <div className="relative p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative p-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 shadow-lg group-hover:shadow-ocean transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-gradient-ocean transition-all duration-300">YouTube SMM</h3>
                </div>
                <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 mb-4">
                  YouTube channel optimization, video marketing, and audience growth strategies for maximum reach and engagement.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Click to learn more</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
