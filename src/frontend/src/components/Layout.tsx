import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './LoginButton';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about-team', label: 'Our Team' },
    { to: '/achievements', label: 'Achievements' },
    { to: '/events', label: 'Events' },
    { to: '/member-locker', label: 'Member Locker' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-racing-red/20 bg-carbon-black/95 backdrop-blur supports-[backdrop-filter]:bg-carbon-black/80">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/assets/baja%20logo.jpg" alt="VVCE BAJA Logo" className="h-10 w-10 object-contain" />
            <span className="font-bold text-xl text-racing-red tracking-tight">VVCEBAJA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-metallic-silver hover:text-racing-red transition-colors"
                activeProps={{ className: 'text-racing-red' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Login Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <LoginButton />
            <button
              className="md:hidden text-metallic-silver hover:text-racing-red transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-racing-red/20 bg-carbon-black">
            <nav className="container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-metallic-silver hover:text-racing-red transition-colors py-2"
                  activeProps={{ className: 'text-racing-red' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-racing-red/20 bg-carbon-black/50 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-metallic-silver">
              <span>© {new Date().getFullYear()} VVCEBAJA</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-metallic-silver">
              <span className="text-racing-red font-medium">#BuiltBeyondBounds</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
