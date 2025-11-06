import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail, MapPin, ArrowRight } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black border-t border-cyan-500/20">
      {/* Ocean Abyss Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000",
        }}
      />
      
      <div className="container relative z-10 py-12 px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/images/logo.jpg" alt="AdWhey Logo" className="w-8 h-8 rounded-full" />
              <span className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">AdWhey</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              We help you expand your reach through high-impact social media marketing. 
              Transform your digital presence with our expert team.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/adwhey_media" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/30 hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@adwheymedia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-500/30 hover:text-white transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" onClick={scrollToTop} className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/portfolio" onClick={scrollToTop} className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/booking" onClick={scrollToTop} className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/instagram-smm" onClick={scrollToTop} className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Instagram SMM
                </Link>
              </li>
              <li>
                <Link to="/youtube-smm" onClick={scrollToTop} className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  YouTube SMM
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Social Strategy
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Content Production
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Paid Social Ads
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Video Production
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Analytics & Reporting
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-300">adwheyofficial@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-300">Indore, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cyan-500/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 AdWhey. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
