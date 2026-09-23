import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Combos', href: '#combos' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Barra de cores da marca no topo */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-gradient-to-r from-secondary via-accent to-primary" />

      <header
        className={`fixed top-1 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/96 backdrop-blur-md shadow-sm border-b border-border/60 py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/Logo.jpg"
              alt="Fábrica de Pizzas"
              className="h-12 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              size="lg"
              className="rounded-full shadow-md hover:shadow-lg transition-all bg-secondary hover:bg-secondary/90 text-white"
              asChild
            >
              <a href="#combos">
                <ShoppingBag className="mr-2 w-4 h-4" />
                Agendar pedido
              </a>
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden relative z-50 p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Alternar menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Mobile Menu */}
          <div
            className={`fixed inset-0 bg-background flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out md:hidden ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Barra colorida no topo do menu mobile */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-accent to-primary" />

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-semibold hover:text-secondary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button
              size="lg"
              className="rounded-full mt-4 w-64 bg-secondary hover:bg-secondary/90 text-white"
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <a href="#combos">
                <ShoppingBag className="mr-2 w-4 h-4" />
                Agendar pedido
              </a>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
