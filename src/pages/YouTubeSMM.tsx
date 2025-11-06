import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp, Users, Target, Zap, CheckCircle, Star, BarChart3, Camera, Heart, Share2, Video, ThumbsUp, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const YouTubeSMM = () => {
  const services = [
    {
      icon: Video,
      title: "Video Production",
      description: "High-quality video content that captivates your audience",
      features: ["Professional filming", "Editing & post-production", "Motion graphics", "Brand integration"]
    },
    {
      icon: Play,
      title: "Channel Optimization",
      description: "Optimize your YouTube channel for maximum visibility and growth",
      features: ["SEO optimization", "Thumbnail design", "Playlist organization", "Channel branding"]
    },
    {
      icon: TrendingUp,
      title: "Content Strategy",
      description: "Strategic content planning to grow your YouTube presence",
      features: ["Content calendar", "Trending topics", "Audience research", "Performance analysis"]
    },
    {
      icon: Target,
      title: "YouTube Advertising",
      description: "Targeted YouTube ads to reach your ideal audience",
      features: ["Ad campaign setup", "Audience targeting", "Budget management", "Performance tracking"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Comprehensive YouTube analytics and performance reporting",
      features: ["View analytics", "Audience insights", "Engagement metrics", "Monthly reports"]
    },
    {
      icon: Zap,
      title: "Community Management",
      description: "Build and engage with your YouTube community",
      features: ["Comment management", "Live streaming", "Community posts", "Fan engagement"]
    }
  ];

  const benefits = [
    "Increased video views and watch time",
    "Higher subscriber growth and retention",
    "Better search rankings and discoverability",
    "Enhanced brand authority and credibility",
    "More qualified leads and conversions",
    "Long-term content marketing asset"
  ];

  const results = [
    { metric: "1M+", label: "Total Views", icon: "👁️" },
    { metric: "50K+", label: "Subscribers Gained", icon: "📺" },
    { metric: "95%", label: "Client Satisfaction", icon: "⭐" },
    { metric: "200+", label: "Videos Produced", icon: "🎬" }
  ];

  return (
    <>
      <Helmet>
        <title>YouTube SMM Services - AdWhey</title>
        <meta name="description" content="Professional YouTube social media marketing services. Grow your YouTube channel with our expert team." />
      </Helmet>

      <div className="w-full relative bg-black">
        {/* Ocean Abyss Background with Top Glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000",
          }}
        />
        
        <main className="section-padding relative z-10 pt-16 md:pt-0">
          {/* Hero Section */}
          <div className="text-center mb-16 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white text-sm font-medium rounded-full shadow-ocean mb-6">
              <Play className="w-4 h-4" />
              YouTube Marketing
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Dominate{" "}
              <span className="text-gradient-ocean">YouTube</span>{" "}
              with Strategic Marketing
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transform your YouTube presence with our comprehensive video marketing services. 
              From content creation to channel optimization, we help you build a powerful YouTube strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-ocean hover:scale-105 text-lg px-8 py-6 group">
                <Link to="/booking" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="btn-ocean-outline hover:scale-105 text-lg px-8 py-6 group">
                <Link to="/portfolio" className="flex items-center gap-2">
                  View Our Work
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Services Grid */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Complete YouTube{" "}
                <span className="text-gradient-ocean">Marketing Solutions</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                We handle every aspect of your YouTube marketing to ensure maximum impact and results.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Card 
                  key={service.title} 
                  className="group bg-ocean-card border-cyan-500/20 hover:shadow-ocean transition-all duration-500 hover:scale-105 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-white group-hover:text-gradient-ocean transition-colors duration-300">
                        {service.title}
                      </CardTitle>
                    </div>
                    
                    <CardDescription className="text-gray-300 mb-4 leading-relaxed">
                      {service.description}
                    </CardDescription>
                    
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mb-20">
            <div className="bg-ocean-card border border-cyan-500/20 rounded-2xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Why Choose Our{" "}
                  <span className="text-gradient-ocean">YouTube Services</span>
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Experience the difference with our proven YouTube marketing strategies.
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Proven{" "}
                <span className="text-gradient-ocean">Results</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Our YouTube marketing strategies have delivered exceptional results for our clients.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {results.map((result, index) => (
                <div key={result.label} className="text-center group cursor-pointer hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl mb-2 group-hover:animate-bounce-slow">{result.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-gradient-ocean mb-2 group-hover:text-gradient-ocean transition-all duration-300">
                    {result.metric}
                  </div>
                  <div className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                    {result.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section>
            <div className="bg-ocean-card border border-cyan-500/20 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Transform Your{" "}
                <span className="text-gradient-ocean">YouTube Presence</span>?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's discuss your YouTube marketing goals and create a custom strategy that drives real results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="btn-ocean hover:scale-105 text-lg px-8 py-6 group">
                  <Link to="/booking" className="flex items-center gap-2">
                    Start Your YouTube Campaign
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="btn-ocean-outline hover:scale-105 text-lg px-8 py-6 group">
                  <Link to="/portfolio" className="flex items-center gap-2">
                    View YouTube Portfolio
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default YouTubeSMM; 