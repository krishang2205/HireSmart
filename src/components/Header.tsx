import { Button } from '@/components/ui/button';
import { Menu, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Brand } from '@/components/Brand';

const Header = () => (
  <div className="sticky top-0 z-50 animate-fade-in">
    <div className="bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <nav aria-label="Primary" className="container mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Brand />
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="story-link text-sm text-muted-foreground hover:text-foreground">Features</a>
          <a href="#how-it-works" className="story-link text-sm text-muted-foreground hover:text-foreground">How it works</a>
          <a href="#testimonials" className="story-link text-sm text-muted-foreground hover:text-foreground">Testimonials</a>
          <a href="#cta" className="story-link text-sm text-muted-foreground hover:text-foreground">Request demo</a>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/auth/login" aria-label="Sign in to HireSmart" className="flex items-center gap-2"><LogIn className="size-4" /> Sign in</Link>
          </Button>
          <Button variant="hero" size="sm" asChild className="hover-scale">
            <Link to="/auth/signup" aria-label="Create your HireSmart account" className="flex items-center gap-2"><UserPlus className="size-4" /> Sign up</Link>
          </Button>
  </div>
        <div className="md:hidden">
          <button className="p-2" aria-label="Open menu"><Menu /></button>
        </div>
      </nav>
    </div>
  </div>
);
export default Header;
