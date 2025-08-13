import { Button } from "@/components/ui/button";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="container grid gap-8 py-10 md:grid-cols-3">
        <section>
          <h2 className="text-lg font-semibold">Join AdWhey</h2>
          <p className="mt-1 text-sm text-muted-foreground">Become a member of our team—grow with creatives and marketers shaping standout campaigns.</p>
          <div className="mt-3 flex gap-3">
            <a href="mailto:adwheyofficial@gmail.com" className="story-link">Apply via Email</a>
            <a href="/booking" className="story-link">Contact Us</a>
          </div>
        </section>
        <nav className="flex flex-col gap-2 text-sm">
          <a href="/portfolio" className="story-link">Portfolio</a>
          <a href="/booking" className="story-link">Booking</a>
          <a href="#team" className="story-link">Team</a>
          <a href="#services" className="story-link">Services</a>
        </nav>
        <aside className="text-sm">
          <p>Connect with us</p>
          <p className="mt-1"><a className="story-link" href="https://instagram.com/adwhey_media" target="_blank" rel="noreferrer">Instagram: @adwhey_media</a></p>
          <p className="mt-1"><a className="story-link" href="mailto:adwheyofficial@gmail.com">Email: adwheyofficial@gmail.com</a></p>
        </aside>
      </div>
      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-sm text-muted-foreground">© {year} AdWhey. All rights reserved.</p>
          <div className="text-xs text-muted-foreground">Crafted with care for brands, shops, and property sellers.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
