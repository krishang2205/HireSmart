import { Button } from '@/components/ui/button';
import { Menu, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Brand } from '@/components/Brand';

const Header = () => (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[90%] md:max-w-5xl animate-fade-in-down">
    <div className="bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-indigo-500/10 rounded-full px-2 py-2">
      <nav aria-label="Primary" className="flex items-center justify-between h-12 md:h-14 pl-6 pr-2">
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
