import { Button } from "./ui/button";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => onNavigate('home')}
              className="text-xl font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Spotlight
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
            >
              Home
            </Button>
            <Button
              variant={currentPage === 'portfolios' ? 'default' : 'ghost'}
              onClick={() => onNavigate('portfolios')}
            >
              Templates
            </Button>
            <Button
              variant={currentPage === 'login' ? 'default' : 'ghost'}
              onClick={() => onNavigate('login')}
            >
              Login
            </Button>
            <Button
              variant={currentPage === 'signup' ? 'default' : 'ghost'}
              onClick={() => onNavigate('signup')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}