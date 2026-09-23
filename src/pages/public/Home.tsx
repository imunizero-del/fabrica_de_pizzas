import { ArrowRight, Clock, Star, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingProvider } from '@/contexts/BookingContext';
import BookingFlow from '@/components/booking/BookingFlow';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section id="inicio" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Star className="mr-1 h-3.5 w-3.5 fill-primary" />
                Artesanal & Premium
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Mini pizzas prontas para <span className="text-primary">transformar</span> qualquer momento.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0">
                Escolha seu combo, agende o melhor dia e horário e tenha suas mini pizzas pré-assadas preparadas especialmente para você.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
                  <a href="#combos">
                    Escolher meu combo <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base rounded-full" asChild>
                  <a href="#como-funciona">
                    Como funciona
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="flex-1 relative w-full max-w-md mx-auto">
              <div className="aspect-square bg-muted rounded-full overflow-hidden relative shadow-2xl border-4 border-white/50 backdrop-blur-sm">
                {/* Placeholder para foto principal. Como exigido, espaço de destaque. */}
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">[Fotografia Alta Qualidade]</span>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border border-border/50">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Qualidade Artesanal</h3>
              <p className="text-muted-foreground">Massa leve e ingredientes selecionados. Sabor de pizzaria no conforto de casa.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border border-border/50">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Praticidade Absoluta</h3>
              <p className="text-muted-foreground">Pré-assadas e prontas para o forno. Em poucos minutos seu evento está servido.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border border-border/50">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pedido Agendado</h3>
              <p className="text-muted-foreground">Garanta sua reserva para o dia e horário do seu evento com total previsibilidade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMBOS E AGENDAMENTO */}
      <section id="combos" className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 -skew-y-3 origin-top-left -z-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">Nossos Combos</h2>
            <p className="text-lg text-muted-foreground">
              Opções sob medida para o seu evento. Escolha a quantidade ideal e agende com tranquilidade.
            </p>
          </div>
          
          <BookingProvider>
            <BookingFlow />
          </BookingProvider>
        </div>
      </section>

      {/* NOSSA PRODUÇÃO */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-primary/10 -rotate-3 rounded-[2.5rem]"></div>
              <img 
                src="/images/producao.jpg" 
                alt="Produção artesanal de mini pizzas" 
                className="relative rounded-3xl shadow-xl border-4 border-background w-full h-auto object-cover max-h-[600px]"
              />
              <div className="absolute -bottom-6 -right-6 bg-background p-4 rounded-2xl shadow-lg border border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                  100%
                </div>
                <div>
                  <p className="font-bold text-foreground leading-tight">Massa Artesanal</p>
                  <p className="text-xs text-muted-foreground">Feita todos os dias</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Qualidade artesanal em cada detalhe
              </h2>
              <p className="text-lg text-muted-foreground">
                Nossas mini pizzas são preparadas com muito carinho, utilizando ingredientes rigorosamente selecionados e massa fresca aberta diariamente pelo nosso pizzaiolo.
              </p>
              <ul className="space-y-4">
                {[
                  'Molho de tomate especial',
                  'Ingredientes de primeira linha',
                  'Assamento no ponto perfeito',
                  'Amor e dedicação na receita'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Star className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Button size="lg" className="rounded-full shadow-lg h-14 px-8 text-base" onClick={() => document.getElementById('combos')?.scrollIntoView({ behavior: 'smooth' })}>
                  Quero experimentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">Perguntas Frequentes</h2>
            <p className="text-lg text-muted-foreground">Tire suas dúvidas e faça seu pedido com tranquilidade.</p>
          </div>
          
          <div className="space-y-4">
            {/* Será substituído pelo componente Accordion do shadcn */}
            <div className="bg-background border border-border p-6 rounded-2xl">
              <h4 className="font-semibold text-lg mb-2">Como funciona o agendamento?</h4>
              <p className="text-muted-foreground">Você escolhe o combo, seleciona a data e o horário disponíveis na nossa agenda, informa seus dados e confirma. Seu pedido entra na nossa linha de produção especificamente para o horário escolhido.</p>
            </div>
            <div className="bg-background border border-border p-6 rounded-2xl">
              <h4 className="font-semibold text-lg mb-2">As mini pizzas são pré-assadas?</h4>
              <p className="text-muted-foreground">Sim! Elas vão prontas para finalizar. Basta colocar no forno por poucos minutos até o queijo derreter e a massa dourar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-foreground text-background text-center relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Seu próximo momento especial pode começar por aqui.
          </h2>
          <p className="text-lg text-white/70 mb-10">
            Garanta agora mesmo o seu combo de mini pizzas e ofereça a melhor experiência para seus convidados.
          </p>
          <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl hover:shadow-primary/25 transition-all w-full sm:w-auto" asChild>
            <a href="#combos">Escolher meu combo</a>
          </Button>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-primary/20 rounded-full blur-[100px] -z-0"></div>
      </section>
    </div>
  );
}
