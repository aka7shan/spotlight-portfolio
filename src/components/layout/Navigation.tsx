import { useState, useCallback} from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../ui/dropdown-menu";
import { Palette, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { ImageWithFallback } from "../common/ImageWithFallback";
import type { User } from "../../types/portfolio";
import styles from "./Navigation.module.css";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user?: User | null;
  onLogout?: () => void;
  onNavigationRequest?: (page: string) => void; // New prop for handling navigation with unsaved changes
}

export function Navigation({ 
  currentPage, 
  onNavigate, 
  user, 
  onLogout,
  onNavigationRequest 
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'portfolios', label: 'Templates' },
  ];


  // Use navigation request handler if available, otherwise use direct navigation
  const handleNavigation = useCallback((page: string) => {
    if (onNavigationRequest) {
      onNavigationRequest(page);
    } else {
      onNavigate(page);
    }
  }, [onNavigate, onNavigationRequest]);

  const handleMobileNavClick = useCallback((itemId: string) => {
    handleNavigation(itemId);
    setIsMobileMenuOpen(false);
  }, [handleNavigation]);

  const handleMobileAuthClick = useCallback((action: string) => {
    if (action === 'logout') {
      onLogout?.();
    } else {
      handleNavigation(action);
    }
    setIsMobileMenuOpen(false);
  }, [handleNavigation, onLogout]);

  const handleLogoClick = useCallback(() => {
    handleNavigation('home');
  }, [handleNavigation]);

  const handleProfileClick = useCallback(() => {
    handleNavigation('profile');
    setIsDropdownOpen(false); // Close dropdown after navigation
  }, [handleNavigation]);

  const handleLogoutClick = useCallback(() => {
    onLogout?.();
    setIsDropdownOpen(false); // Close dropdown after logout
  }, [onLogout]);

  const handleDropdownOpenChange = useCallback((open: boolean) => {
    setIsDropdownOpen(open);
  }, []);

  return (
    <nav className={styles.navBar}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className={styles.logoIcon}>
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className={styles.logoText}>
              Spotlight
            </span>
            <Badge variant="secondary" className="ml-2 text-xs">
              Beta
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  currentPage === item.id ? styles.navItemActive : styles.navItemInactive
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Authenticated User Menu
              <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <ImageWithFallback
                      src={user.avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face`}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56" 
                  align="end" 
                  forceMount
                  sideOffset={5}
                  onCloseAutoFocus={(e) => {
                    // Prevent focus trap and allow normal scrolling
                    e.preventDefault();
                  }}
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      {user.title && (
                        <p className="w-[200px] truncate text-xs text-muted-foreground">
                          {user.title}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogoutClick} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Non-authenticated buttons
              <div className="hidden md:flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavigation('login')}
                  className="text-gray-600 hover:text-primary"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => handleNavigation('signup')}
                  className={styles.primaryGradientButton}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMobileNavClick(item.id)}
                  className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md ${
                    currentPage === item.id ? styles.mobileNavItemActive : styles.mobileNavItemInactive
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {!user && (
                <div className="pt-4 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleMobileAuthClick('login')}
                  >
                    Login
                  </Button>
                  <Button 
                    className={styles.mobileSignupButton}
                    onClick={() => handleMobileAuthClick('signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {user && (
                <div className="pt-4 space-y-2 border-t border-gray-200">
                  <div className="px-3 py-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleMobileAuthClick('profile')}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-600"
                    onClick={() => handleMobileAuthClick('logout')}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
