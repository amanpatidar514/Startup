import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, User, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/booking", label: "Booking" },
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={scrollToTop}>
            <img src="/images/logo.jpg" alt="AdWhey Logo" className="w-8 h-8 rounded-full" />
            <span className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">AdWhey</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={scrollToTop}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-300 hover:text-cyan-400 ${
                    isActive 
                      ? 'text-cyan-400 border-b-2 border-cyan-400' 
                      : 'text-gray-300 hover:scale-105'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.email === 'adwheyofficial@gmail.com' ? (
                  <Link to="/admin" onClick={scrollToTop}>
                    <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400/50">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/profile" onClick={scrollToTop}>
                    <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth?tab=signin" onClick={scrollToTop}>
                  <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?tab=signup" onClick={scrollToTop}>
                  <Button size="sm" className="btn-ocean">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-cyan-500/20 bg-black/95 backdrop-blur-xl">
            <div className="py-6 space-y-3 px-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToTop();
                  }}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-base font-medium transition-all duration-300 rounded-lg ${
                      isActive 
                        ? 'text-cyan-400 bg-cyan-500/10 border-l-2 border-cyan-400' 
                        : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="border-t border-cyan-500/20 pt-6 mt-6">
                {user ? (
                  <div className="space-y-3">
                    {user.email === 'adwheyofficial@gmail.com' ? (
                      <Link 
                        to="/admin" 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          scrollToTop();
                        }}
                        className="flex items-center gap-2 px-4 py-3 text-base font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all duration-300 rounded-lg"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link 
                        to="/profile" 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          scrollToTop();
                        }}
                        className="flex items-center gap-2 px-4 py-3 text-base font-medium text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-300 rounded-lg"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      to="/auth?tab=signin" 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        scrollToTop();
                      }}
                      className="flex items-center justify-center px-4 py-3 text-base font-medium text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-300 rounded-lg"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/auth?tab=signup" 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        scrollToTop();
                      }}
                      className="flex items-center justify-center px-4 py-3 text-base font-medium bg-cyan-500 text-white hover:bg-cyan-600 transition-all duration-300 rounded-lg"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
