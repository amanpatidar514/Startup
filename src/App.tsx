import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Booking from "./pages/Booking";
import Portfolio from "./pages/Portfolio";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import InstagramSMM from "./pages/InstagramSMM";
import YouTubeSMM from "./pages/YouTubeSMM";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen bg-black">
      <ScrollToTop />
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/instagram-smm" element={<InstagramSMM />} />
        <Route path="/youtube-smm" element={<YouTubeSMM />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <TooltipProvider>
          <App />
          <Toaster />
        </TooltipProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default AppWrapper;
