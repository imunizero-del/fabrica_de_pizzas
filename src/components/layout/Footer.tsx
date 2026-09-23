import { Phone, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8 relative overflow-hidden">
      {/* Barra tricolor no topo do footer */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-accent to-primary" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="h-20 w-36 bg-white rounded-xl p-2 mb-6 flex items-center justify-center">
              <img src="/Logo.jpg" alt="Fábrica de Pizzas" className="h-full w-auto object-contain mix-blend-multiply" />
            </div>
            <p className="text-background/70 mb-6 max-w-sm">
              Combos de mini pizzas pré-assadas artesanais, preparadas com ingredientes selecionados para transformar o seu evento.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/5522998458832" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary" />
              Navegação
            </h3>
            <ul className="space-y-3">
              <li><a href="#combos" className="text-background/70 hover:text-accent transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Nossos Combos</a></li>
              <li><a href="#como-funciona" className="text-background/70 hover:text-accent transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Como Funciona</a></li>
              <li><a href="#faq" className="text-background/70 hover:text-accent transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" /> Perguntas Frequentes</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              Contato
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-background/70">
                <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-background">WhatsApp</p>
                  <a href="https://wa.me/5522998458832" className="hover:text-accent transition-colors">(22) 99845-8832</a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-background">Retirada</p>
                  <p>Endereço a definir</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
          <p>© {new Date().getFullYear()} Fábrica de Pizzas. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <Link to="/termos" className="hover:text-background transition-colors">Termos de Uso</Link>
            <Link to="/privacidade" className="hover:text-background transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
