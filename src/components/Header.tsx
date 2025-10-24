import { Button } from '@/components/ui/button';
import { Menu, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Brand } from '@/components/Brand';

const Header = () => (
  <div className="sticky top-0 z-50 animate-fade-in">
    <div className="bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 border-b border-indigo-100/50 sticky top-0 z-50">
      <nav aria-label="Primary" className="container mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Brand />
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-indigo-900/70 hover:text-indigo-600 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-indigo-900/70 hover:text-indigo-600 transition-colors">How it works</a>
          <a href="#testimonials" className="text-sm font-medium text-indigo-900/70 hover:text-indigo-600 transition-colors">Testimonials</a>
          <a href="#cta" className="text-sm font-medium text-indigo-900/70 hover:text-indigo-600 transition-colors">Request demo</a>
          <Link to="/next-steps" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100">Next Steps</Link>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="border-transparent bg-transparent text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 shadow-none">
            <Link to="/auth/login" aria-label="Sign in to HireSmart" className="flex items-center gap-2"><LogIn className="size-4" /> Sign in</Link>
          </Button>
          <Button size="sm" asChild className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all">
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
