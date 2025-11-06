import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";

const NotFound = () => {
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

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
        <title>Page Not Found | AdWhey</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>
      
      <Navbar />
      
      <main className="container flex flex-1 items-center justify-center py-12 relative z-10 pt-24">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-400 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" onClick={scrollToTop}>
              <Button className="btn-ocean">
                Go Home
              </Button>
            </Link>
            <Link to="/portfolio" onClick={scrollToTop}>
              <Button variant="outline" className="btn-ocean-outline">
                View Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
