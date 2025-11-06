import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { X } from "lucide-react";
import SwipeCarousel from "@/components/SwipeCarousel";

const Portfolio = () => {
  const [selectedItem, setSelectedItem] = useState<{ type: 'image' | 'video', src: string, alt: string } | null>(null);

  // Portfolio items with their file paths
  const portfolioItems: Array<{ type: 'image' | 'video', src: string, alt: string }> = [
    { type: 'image', src: '/images/portfolio/1.jpg', alt: 'AdWhey Portfolio 1' },
    { type: 'image', src: '/images/portfolio/2.jpg', alt: 'AdWhey Portfolio 2' },
    { type: 'image', src: '/images/portfolio/3.jpg', alt: 'AdWhey Portfolio 3' },
    { type: 'image', src: '/images/portfolio/4.jpg', alt: 'AdWhey Portfolio 4' },
    { type: 'image', src: '/images/portfolio/5.jpg', alt: 'AdWhey Portfolio 5' },
    { type: 'image', src: '/images/portfolio/6.jpg', alt: 'AdWhey Portfolio 6' },
    { type: 'image', src: '/images/portfolio/7.jpg', alt: 'AdWhey Portfolio 7' },
    { type: 'image', src: '/images/portfolio/8.jpg', alt: 'AdWhey Portfolio 8' },
    { type: 'image', src: '/images/portfolio/9.jpg', alt: 'AdWhey Portfolio 9' },
    { type: 'image', src: '/images/portfolio/10.jpg', alt: 'AdWhey Portfolio 10' },
    { type: 'image', src: '/images/portfolio/11.jpg', alt: 'AdWhey Portfolio 11' },
    { type: 'image', src: '/images/portfolio/12.jpg', alt: 'AdWhey Portfolio 12' },
    { type: 'image', src: '/images/portfolio/13.jpg', alt: 'AdWhey Portfolio 13' },
    { type: 'video', src: '/images/portfolio/14.mp4', alt: 'AdWhey Portfolio Video 14' },
    { type: 'video', src: '/images/portfolio/15.mp4', alt: 'AdWhey Portfolio Video 15' },
    { type: 'video', src: '/images/portfolio/16.mp4', alt: 'AdWhey Portfolio Video 16' },
  ];

  const showreelVideos: Array<{ type: 'image' | 'video', src: string, alt: string }> = [
    { type: 'video', src: '/images/portfolio/17.mp4', alt: 'AdWhey Showreel 17' },
    { type: 'video', src: '/images/portfolio/18.mp4', alt: 'AdWhey Showreel 18' },
    { type: 'video', src: '/images/portfolio/19.mp4', alt: 'AdWhey Showreel 19' },
    { type: 'video', src: '/images/portfolio/20.mp4', alt: 'AdWhey Showreel 20' },
  ];

  const images = portfolioItems.filter(i => i.type === 'image');
  const videos = portfolioItems.filter(i => i.type === 'video');

  const handleItemClick = (item: { type: 'image' | 'video', src: string, alt: string }) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
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
        <title>Portfolio | AdWhey</title>
        <meta name="description" content="View AdWhey's portfolio of successful social media marketing campaigns and content creation projects." />
        <link rel="canonical" href="/portfolio" />
      </Helmet>
      
      <Navbar />
      
      <main className="section-padding relative z-10 pt-16 md:pt-24">
        <div className="container px-4">
          {/* Header */}
          <header className="text-center mb-16 relative isolate">
            {/* Enhanced Ocean Glow behind heading */}
            <div aria-hidden className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
              <div className="w-[95%] max-w-4xl h-32 rounded-full blur-2xl bg-gradient-to-r from-cyan-400/30 via-blue-400/25 to-cyan-500/20"></div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 inline-block relative z-10">
              <span className="relative z-10">Our <span className="text-gradient-ocean">Portfolio</span></span>
              {/* Soft Ocean glow underline */}
              <span aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 w-[120%] h-4 rounded-full blur-lg bg-gradient-to-r from-cyan-400/40 via-blue-400/30 to-cyan-500/40"></span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Explore our collection of successful social media campaigns, 
              content creation, and marketing projects that drive real results.
            </p>
          </header>

          {/* Images Section */}
          <section className="mb-16 rounded-3xl p-4 sm:p-6 md:p-10 bg-ocean-card border border-cyan-500/20 shadow-ocean">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white">Images</h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((item, index) => (
                <Card 
                  key={`img-${index}`} 
                  className="overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-black/50 border border-cyan-500/20"
                  onClick={() => handleItemClick(item)}
                >
                  <img 
                    src={item.src} 
                    alt={item.alt} 
                    loading="lazy" 
                    className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </Card>
              ))}
            </div>
          </section>

          {/* 3D Carousel Section */}
          <section className="mb-16 rounded-3xl p-6 md:p-10 bg-ocean-card border border-cyan-500/20 shadow-ocean">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">Carousel</h2>
            <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience our portfolio in an immersive 3D carousel. Drag to rotate, hover to interact, and discover our creative work from every angle.
            </p>
            <div className="h-[32rem] md:h-[38rem] shadow-2xl shadow-cyan-500/20 rounded-2xl overflow-hidden bg-black">
              <SwipeCarousel
                images={[
                  '/images/portfolio/carousal/11.png',
                  '/images/portfolio/carousal/1.jpg',
                  '/images/portfolio/carousal/2.jpg',
                  '/images/portfolio/carousal/12.png',
                  '/images/portfolio/carousal/10.png',
                  '/images/portfolio/carousal/3.jpg',
                  '/images/portfolio/carousal/4.jpg',
                  '/images/portfolio/carousal/13.png',
                  '/images/portfolio/carousal/8.jpg',
                  '/images/portfolio/carousal/14.png',
                ]}
              />
            </div>
          </section>

          {/* Videos Section */}
          <section className="rounded-3xl p-6 md:p-10 bg-ocean-card border border-cyan-500/20 shadow-ocean">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Videos</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((item, index) => (
                <Card 
                  key={`vid-${index}`} 
                  className="overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-black/50 border border-cyan-500/20"
                  onClick={() => handleItemClick(item)}
                >
                  <video 
                    src={item.src} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  >
                    Your browser does not support the video tag.
                  </video>
                </Card>
              ))}
            </div>

            {/* AdWhey Showreel inside Videos Section */}
            <div className="mt-12">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-white">AdWhey Showreel</h3>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {showreelVideos.map((video, index) => (
                  <video 
                    key={`show-${index}`}
                    src={video.src} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    controls
                    className="w-full h-auto rounded-xl shadow-2xl shadow-cyan-500/30 border border-cyan-500/20 cursor-pointer hover:scale-105 hover:-translate-y-2 transition-all duration-500 bg-black/50"
                    onClick={() => handleItemClick(video)}
                  >
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-16 text-center">
            <div className="bg-ocean-card border border-cyan-500/20 rounded-2xl p-8 md:p-12 shadow-ocean">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Create Something <span className="text-gradient-ocean">Amazing</span>?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's discuss your project and create a custom strategy that fits your goals and budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/booking" 
                  className="inline-flex items-center justify-center px-8 py-4 btn-ocean rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  Start Your Project
                </a>
                <a 
                  href="/portfolio" 
                  className="inline-flex items-center justify-center px-8 py-4 btn-ocean-outline rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  View More Work
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors duration-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            {selectedItem.type === 'image' ? (
              <img
                src={selectedItem.src}
                alt={selectedItem.alt}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl shadow-cyan-500/30"
              />
            ) : (
              <video
                src={selectedItem.src}
                controls
                autoPlay
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl shadow-cyan-500/30"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
