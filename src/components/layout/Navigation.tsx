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
import { Palette, Menu, X, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
    { id: 'styles', label: 'Styles' },
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

  // First word of a display name for the trigger pill. Overflow is
  // handled by `max-w` + `truncate` on the label, so we no longer slice
  // or append a hard-coded "..." (which made every name look truncated
  // even when it wasn't).
  const firstName = (name: string | undefined): string => {
    const raw = (name ?? '').trim();
    if (!raw) return 'there';
    return raw.split(/\s+/)[0];
  };

  return (
    <nav className={styles.navBar}>
      <div className="max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8">
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
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={handleDropdownOpenChange}
                modal={false}
              >
                <DropdownMenuTrigger asChild>
                  {/*
                    The trigger is the avatar + a "Hi, <firstName>" pill on
                    md+. On small screens we just show the avatar to save room.
                    Wider trigger surface = less tap-fumbling, which matters
                    because every authenticated entry point lives behind this
                    menu (profile, logout, future settings).

                    `modal={false}` on the menu keeps the page scrollbar in
                    place while open — with the default (modal) the scroll
                    lock removes the scrollbar and shifts the fixed navbar vs.
                    the page content, which read as a jitter on open/close.
                  */}
                  <Button
                    variant="ghost"
                    className="flex h-10 items-center gap-2 rounded-full pl-1 pr-3 hover:bg-gray-100"
                  >
                    <UserAvatar user={user} className="h-8 w-8" />
                    <span className="hidden md:inline text-sm font-medium text-gray-700 max-w-[140px] truncate">
                      Hi, {firstName(user.name)}
                    </span>
                    <ChevronDown className="hidden md:block w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 p-2"
                  align="end"
                  sideOffset={8}
                  onCloseAutoFocus={(e) => {
                    // Don't yank focus (and the scroll position) back to the
                    // trigger when the menu closes.
                    e.preventDefault();
                  }}
                >
                  <div className="flex items-center gap-3 px-2 py-2">
                    <UserAvatar user={user} className="h-10 w-10 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name || "Your account"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleProfileClick}
                    className="gap-3 px-3 py-2.5 rounded-md cursor-pointer focus:bg-gray-100"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                      <UserIcon className="h-4 w-4 text-gray-700" />
                    </div>
                    <span className="text-sm font-medium">View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogoutClick}
                    className="gap-3 px-3 py-2.5 rounded-md cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">Logout</span>
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

/**
 * Avatar for the navbar. Shows the uploaded image when present, otherwise
 * a gradient initial that matches the profile page's `AvatarUpload`
 * fallback. This keeps the navbar consistent with the user's actual
 * profile — previously a user without a photo got a random stock face.
 */
function UserAvatar({ user, className }: { user: User; className?: string }) {
  const initial = (user.name ?? "").trim().charAt(0).toUpperCase() || "U";
  return (
    <Avatar className={className}>
      {user.avatar ? (
        <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
      ) : (
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
          {initial}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
