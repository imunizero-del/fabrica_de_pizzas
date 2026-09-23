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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-50">
          {/* Logo oficial preservada na pasta raiz */}
          <div className="h-10 w-auto rounded-md overflow-hidden bg-white/50 backdrop-blur-sm p-1">
            <img src="/Logo.jpg" alt="Fábrica de Pizzas" className="h-full w-auto object-contain mix-blend-multiply" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#inicio" className="text-sm font-medium hover:text-primary transition-colors">Início</a>
          <a href="#combos" className="text-sm font-medium hover:text-primary transition-colors">Combos</a>
          <a href="#como-funciona" className="text-sm font-medium hover:text-primary transition-colors">Como funciona</a>
          <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button size="lg" className="rounded-full shadow-md hover:shadow-lg transition-all" asChild>
            <a href="#combos">
              Agendar pedido <ShoppingBag className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden relative z-50 p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Alternar menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Navigation */}
        <div
          className={`fixed inset-0 bg-background flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <a href="#inicio" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold hover:text-primary transition-colors">Início</a>
          <a href="#combos" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold hover:text-primary transition-colors">Combos</a>
          <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold hover:text-primary transition-colors">Como funciona</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold hover:text-primary transition-colors">FAQ</a>
          <Button size="lg" className="rounded-full mt-4 w-64" asChild onClick={() => setMobileMenuOpen(false)}>
            <a href="#combos">Agendar pedido</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
