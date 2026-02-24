import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useIsCallerAdmin, useGetCallerUserProfile } from '../hooks/useQueries';
import { Menu, X, LogIn, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: isAdmin } = useIsCallerAdmin();
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

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/about-team', label: 'Team' },
    { to: '/achievements', label: 'Achievements' },
    { to: '/events', label: 'Events' },
    { to: '/locker', label: 'Member Locker' },
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
              {isAdmin && (
                <Link
                  to="/locker/access-admin"
                  className="px-3 py-2 rounded-md text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors flex items-center gap-1"
                  activeProps={{ className: 'px-3 py-2 rounded-md text-sm font-medium text-primary bg-primary/10 flex items-center gap-1' }}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin Panel
                </Link>
              )}
            </nav>

            {/* Right side: user info + auth button */}
            <div className="flex items-center gap-3">
              {isAuthenticated && userProfile?.name && (
                <span className="hidden sm:block text-sm text-muted-foreground">
                  {userProfile.name}
                </span>
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
              {isAdmin && (
                <Link
                  to="/locker/access-admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors"
                  activeProps={{ className: 'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-primary bg-primary/10' }}
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
            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>© {new Date().getFullYear()} VVCEBAJA. All rights reserved.</p>
              <p className="text-xs">#BuiltBeyondBounds</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Built with{' '}
              <span className="text-red-500">♥</span>{' '}
              using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'vvcebaja')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
