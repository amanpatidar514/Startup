import heroImage from "@/assets/hero-adwhey.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  return (
    <section
      className="relative overflow-hidden border-b"
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPos({ x, y });
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, hsl(var(--brand) / 0.25), transparent 60%)`,
        }}
      />
      <div className="container grid gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col items-start justify-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Grow faster with <span className="bg-gradient-primary bg-clip-text text-transparent">AdWhey</span>
          </h1>
          <p className="mb-8 max-w-xl text-muted-foreground">
            Social media marketing for property sellers, shops, and ambitious brands. We design scroll-stopping content and high-ROI campaigns.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl" className="hover-scale">
              <Link to="/booking">Book Now</Link>
            </Button>
            <Button asChild variant="secondary" size="xl">
              <Link to="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </div>
        <aside className="relative">
          <img
            src={heroImage}
            alt="AdWhey social media marketing hero image"
            loading="lazy"
            className="mx-auto w-full max-w-xl rounded-lg shadow-elegant"
          />
        </aside>
      </div>
    </section>
  );
};

export default Hero;
