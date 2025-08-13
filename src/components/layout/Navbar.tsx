import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="bg-gradient-primary bg-clip-text text-transparent">AdWhey</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={({isActive}) => isActive ? "story-link text-foreground" : "story-link text-muted-foreground"}>Home</NavLink>
          <NavLink to="/portfolio" className={({isActive}) => isActive ? "story-link text-foreground" : "story-link text-muted-foreground"}>Portfolio</NavLink>
          <NavLink to="/booking" className={({isActive}) => isActive ? "story-link text-foreground" : "story-link text-muted-foreground"}>Booking</NavLink>
          <Button asChild variant="hero" size="sm">
            <Link to="/booking">Book Now</Link>
          </Button>
        </div>
        <div className="md:hidden">
          <Button asChild variant="outline" size="icon" aria-label="Book Now">
            <Link to="/booking">↗</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
