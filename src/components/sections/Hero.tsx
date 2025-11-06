import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp } from "lucide-react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden border-b interactive-bg">
      {/* Ocean Abyss Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000",
        }}
      />
      
      {/* Interactive Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-10 blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full opacity-10 blur-xl"></div>
        <div className="floating-element absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-10 blur-xl"></div>
        <div className="floating-element absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-10 blur-xl"></div>
      </div>

      {/* Mouse Interactive Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setPos({ x, y });
        }}
        style={{
          background: `radial-gradient(800px circle at ${pos.x}% ${pos.y}%, rgba(6, 182, 212, 0.15), transparent 60%)`,
        }}
      />

      <div className="container section-padding relative z-10 px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className={`flex flex-col items-start justify-center space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Interactive Badge */}
            <a href="#team" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-full shadow-ocean mb-6 group cursor-pointer hover:scale-105 transition-all duration-300">
              <span>Social Media Experts</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white">
              We help you expand your reach through{" "}
              <span className="text-gradient-ocean">high-impact social media marketing.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl">
              AdWhey delivers results-driven social media marketing that converts 
              followers into customers. Book your strategy call in minutes.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild variant="default" className="btn-ocean hover:scale-105 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 group">
                <Link to="/auth?tab=signup" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="btn-ocean-outline hover:scale-105 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 group">
                <Link to="/portfolio" className="flex items-center gap-2">
                  Watch Demo
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
            
            {/* Interactive Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-4">
              <div className="group flex items-center gap-2 hover:scale-110 transition-transform duration-300">
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full group-hover:animate-bounce-slow"></div>
                <span className="text-sm text-gray-300 group-hover:text-cyan-400 transition-colors duration-300">24/7 Support</span>
              </div>
              <div className="group flex items-center gap-2 hover:scale-110 transition-transform duration-300">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full group-hover:animate-bounce-slow"></div>
                <span className="text-sm text-gray-300 group-hover:text-blue-400 transition-colors duration-300">Results Driven</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image with Logo */}
          <div className="relative">
            {/* Floating Elements */}
            <div className="absolute inset-0">
              <div className="floating-element absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-20 blur-xl"></div>
              <div className="floating-element absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full opacity-30 blur-lg" style={{ animationDelay: '1s' }}></div>
              <div className="floating-element absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-25 blur-xl" style={{ animationDelay: '2s' }}></div>
              <div className="floating-element absolute bottom-10 right-10 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-35 blur-lg" style={{ animationDelay: '3s' }}></div>
            </div>
            
            {/* Hero Image Container */}
            <div className="relative z-10 bg-ocean-card rounded-2xl p-4 shadow-ocean border border-cyan-500/20 backdrop-blur-sm max-w-lg mx-auto">
              <div className="relative overflow-hidden rounded-xl">
                <video 
                  src="/images/portfolio/14.mp4" 
                  alt="AdWhey Hero Video" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-auto max-w-md object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Interactive Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-ocean-card rounded-xl p-4 shadow-ocean border border-cyan-500/20 hover:scale-110 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient-ocean group-hover:text-gradient-ocean transition-all duration-300">500+</div>
                  <div className="text-sm text-gray-300">Happy Clients</div>
                </div>
              </div>
              
              {/* Floating Action Button */}
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-ocean transition-all duration-300 hover:scale-110 rounded-full w-12 h-12 p-0"
                >
                  <TrendingUp className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
