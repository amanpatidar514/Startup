import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Star, TrendingUp, Award, Heart } from "lucide-react";

const people = [
  { 
    name: "Aadarsh Jain", 
    role: "Content Strategist", 
    photo: "/images/aadarsh.jpg"
  },
  { 
    name: "Aman Patidar", 
    role: "Video Editor", 
    photo: "/images/aman patidar.jpg"
  },
  { 
    name: "Aryan Nayak", 
    role: "Social Media Manager", 
    photo: "/images/aryan.jpg"
  },
  { 
    name: "Aman Jain", 
    role: "Video Producer", 
    photo: "/images/aman jain.jpg"
  },
  { 
    name: "Jainam Jain", 
    role: "Performance Marketer", 
    photo: "/images/jainam.jpg"
  },
];

const Team = () => {
  return (
    <section className="section-padding relative" id="team">
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
            <Users className="w-4 h-4" />
            Meet Our Team
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
            5 specialists.{" "}
            <span className="text-gradient-ocean">One unified strategy.</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Our diverse team brings together expertise from across the digital marketing landscape 
            to deliver comprehensive solutions that drive real results.
          </p>
        </header>
        
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {people.map((p, index) => (
            <Card 
              key={p.name} 
              className="group card-interactive overflow-hidden relative text-center cursor-pointer bg-ocean-card border-cyan-500/20 hover:shadow-ocean transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Profile Image with Interactive Border */}
              <div className="relative mb-6 p-4">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
                <img
                  src={p.photo}
                  alt={`${p.name} - ${p.role} at AdWhey`}
                  loading="lazy"
                  className="relative w-32 h-32 mx-auto rounded-full object-cover shadow-elegant transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-2"
                />
              </div>
              
              <div className="px-6 pb-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient-ocean transition-all duration-300">{p.name}</h3>
                <p className="text-gradient-ocean font-semibold mb-3 group-hover:text-gradient-ocean transition-all duration-300">{p.role}</p>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Interactive Team Stats */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {[
            { number: "500+", label: "Campaigns Delivered", icon: "🚀" },
            { number: "98%", label: "Client Satisfaction", icon: "⭐" },
            { number: "100+", label: "Brands Helped", icon: "🎯" },
            { number: "24/7", label: "Support Available", icon: "🔄" }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center group cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="text-4xl mb-2 group-hover:animate-bounce-slow">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-gradient-ocean mb-2 group-hover:text-gradient-ocean transition-all duration-300">
                {stat.number}
              </div>
              <div className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
