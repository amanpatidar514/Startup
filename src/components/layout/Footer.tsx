const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:flex-row">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AdWhey. All rights reserved.</p>
        <nav className="flex items-center gap-6 text-sm">
          <a href="/portfolio" className="story-link">Portfolio</a>
          <a href="/booking" className="story-link">Booking</a>
          <a href="#team" className="story-link">Team</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
