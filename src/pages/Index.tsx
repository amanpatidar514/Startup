import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
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
    <div className="min-h-screen bg-gradient-subtle">
      <Helmet>
        <title>AdWhey | Social Media Marketing Agency</title>
        <meta name="description" content="AdWhey helps property sellers, shops and brands grow with high-impact social media campaigns." />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>
      <Navbar />
      <main>
        <Hero />
        <Team />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
