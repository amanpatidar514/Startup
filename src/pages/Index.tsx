import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Team from "@/components/sections/Team";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AdWhey",
    url: "/",
    logo: "/favicon.ico",
    sameAs: ["/portfolio", "/booking"],
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
        <title>AdWhey - Social Media Marketing & Content Creation</title>
        <meta name="description" content="Transform your brand with AdWhey's strategic social media marketing and compelling content creation services. Drive engagement and grow your business." />
        <meta name="keywords" content="social media marketing, content creation, video production, brand strategy, digital marketing" />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>
      
      <Navbar />
      
      <main className="relative z-10 pt-16 md:pt-0">
        <Hero />
        <Services />
        <Team />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
