import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";

const Portfolio = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>AdWhey Portfolio | Social Media Campaigns</title>
        <meta name="description" content="Explore AdWhey's images and videos from high-performing social media campaigns." />
        <link rel="canonical" href="/portfolio" />
      </Helmet>
      <Navbar />
      <main className="container py-12 md:py-16">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Our Portfolio</h1>
          <p className="text-muted-foreground">Images and videos from recent campaigns</p>
        </header>
        <section className="grid gap-6 md:grid-cols-2">
          {[p1, p2, p3, p4].map((src, i) => (
            <Card key={i} className="overflow-hidden">
              <img src={src} alt={`AdWhey campaign visual ${i+1}`} loading="lazy" className="h-full w-full object-cover" />
            </Card>
          ))}
        </section>
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Showreel</h2>
          <div className="aspect-video overflow-hidden rounded-lg border shadow-elegant">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/ysz5S6PUM-U"
              title="AdWhey Showreel"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
