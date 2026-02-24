import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useIsCallerAdmin, useGetCallerUserProfile } from '../hooks/useQueries';
import {
  Menu, X, LogIn, LogOut, Shield, MoreVertical,
  Settings, MessageSquare, Info, BookOpen, LogOut as LogOutIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [overflowMenuOpen, setOverflowMenuOpen] = useState(false);
  const overflowMenuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: userProfile } = useGetCallerUserProfile();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleLogout = async () => {
    setOverflowMenuOpen(false);
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleOverflowNav = (path: string) => {
    setOverflowMenuOpen(false);
    navigate({ to: path });
  };

  // Close overflow menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overflowMenuRef.current && !overflowMenuRef.current.contains(event.target as Node)) {
        setOverflowMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOverflowMenuOpen(false);
      }
    };
    if (overflowMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [overflowMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/about-team', label: 'Team' },
    { to: '/achievements', label: 'Achievements' },
    { to: '/events', label: 'Events' },
    { to: '/locker', label: 'Member Locker' },
  ];

  // Show admin link as soon as isAdmin is confirmed true
  // isAdmin starts as undefined (loading), becomes true only when backend confirms admin status
  const showAdminLink = isAuthenticated && !adminLoading && isAdmin === true;

  const overflowMenuItems = [
    { label: 'Resources', icon: BookOpen, path: '/locker', highlight: false },
    { label: 'Settings', icon: Settings, path: '/settings', highlight: false },
    { label: 'Feedback', icon: MessageSquare, path: '/feedback', highlight: false },
    { label: 'About Club', icon: Info, path: '/about', highlight: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/assets/baja logo.jpg"
                alt="VVCEBAJA"
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="font-bold text-lg text-foreground tracking-tight hidden sm:block">
                VVCEBAJA
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  activeProps={{ className: 'px-3 py-2 rounded-md text-sm font-medium text-foreground bg-accent' }}
                >
                  {link.label}
                </Link>
              ))}
              {showAdminLink && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-md text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors flex items-center gap-1"
                  activeProps={{ className: 'px-3 py-2 rounded-md text-sm font-medium text-primary bg-primary/10 flex items-center gap-1' }}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
            </nav>

            {/* Right side: user info + admin button + auth button + overflow menu */}
            <div className="flex items-center gap-2">
              {isAuthenticated && userProfile?.name && (
                <span className="hidden sm:block text-sm text-muted-foreground">
                  {userProfile.name}
                </span>
              )}

              {/* Admin Panel button — always visible on all screen sizes when admin */}
              {showAdminLink && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline">Admin</span>
                </Link>
              )}

              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                variant={isAuthenticated ? 'outline' : 'default'}
                size="sm"
                className="hidden sm:flex items-center gap-2"
              >
                {isLoggingIn ? (
                  'Logging in...'
                ) : isAuthenticated ? (
                  <>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Login
                  </>
                )}
              </Button>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* 3-dot Overflow Menu */}
              <div className="relative" ref={overflowMenuRef}>
                <button
                  onClick={() => setOverflowMenuOpen(!overflowMenuOpen)}
                  aria-label="More options"
                  className={`
                    p-2 rounded-md transition-all duration-150
                    text-muted-foreground hover:text-primary hover:bg-primary/10
                    active:scale-90
                    ${overflowMenuOpen ? 'text-primary bg-primary/10' : ''}
                  `}
                >
                  <MoreVertical className="h-5 w-5" />
                </button>

                {/* Dropdown */}
                <div
                  className={`
                    absolute right-0 top-full mt-2 w-56 z-50
                    bg-carbon-black border border-border/60
                    rounded-xl shadow-2xl overflow-hidden
                    transition-all duration-200 ease-out origin-top-right
                    ${overflowMenuOpen
                      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }
                  `}
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)' }}
                >
                  {/* Header accent bar */}
                  <div className="h-0.5 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />

                  <div className="py-1.5">
                    {/* Admin Panel always at top of overflow menu when admin */}
                    {showAdminLink && (
                      <button
                        onClick={() => handleOverflowNav('/admin')}
                        className="
                          w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold
                          transition-all duration-150 text-left
                          min-h-[44px]
                          text-primary hover:bg-primary/15 hover:text-primary
                          active:scale-[0.98] active:bg-primary/20
                        "
                      >
                        <Shield className="h-4 w-4 shrink-0 text-primary" />
                        <span>Admin Panel</span>
                      </button>
                    )}

                    {overflowMenuItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path + index}
                          onClick={() => handleOverflowNav(item.path)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
                            transition-all duration-150 text-left
                            min-h-[44px]
                            text-foreground/80 hover:bg-primary/10 hover:text-primary
                            active:scale-[0.98] active:bg-primary/20
                          `}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}

                    {/* Separator before logout */}
                    <div className="my-1.5 mx-3 border-t border-border/40" />

                    {/* Logout / Login */}
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogout}
                        className="
                          w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
                          text-destructive hover:bg-destructive/10 hover:text-destructive
                          transition-all duration-150 text-left min-h-[44px]
                          active:scale-[0.98] active:bg-destructive/20
                        "
                      >
                        <LogOutIcon className="h-4 w-4 shrink-0" />
                        <span>Logout</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setOverflowMenuOpen(false);
                          handleAuth();
                        }}
                        disabled={isLoggingIn}
                        className="
                          w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
                          text-primary hover:bg-primary/10
                          transition-all duration-150 text-left min-h-[44px]
                          active:scale-[0.98] disabled:opacity-50
                        "
                      >
                        <LogIn className="h-4 w-4 shrink-0" />
                        <span>{isLoggingIn ? 'Logging in...' : 'Login'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  activeProps={{ className: 'block px-3 py-2 rounded-md text-sm font-medium text-foreground bg-accent' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {showAdminLink && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-primary hover:text-primary/80 hover:bg-primary/10 border border-primary/20 transition-colors"
                  activeProps={{ className: 'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-primary bg-primary/10 border border-primary/20' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin Panel
                </Link>
              )}
              <div className="pt-2 border-t border-border">
                {isAuthenticated && userProfile?.name && (
                  <p className="px-3 py-1 text-sm text-muted-foreground">{userProfile.name}</p>
                )}
                <button
                  onClick={() => {
                    handleAuth();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isLoggingIn}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-background/80 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/assets/baja logo.jpg"
                alt="VVCEBAJA"
                className="h-7 w-7 rounded-full object-cover"
              />
              <span className="text-sm font-semibold text-foreground">VVCEBAJA</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} VVCEBAJA. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'vvcebaja')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
