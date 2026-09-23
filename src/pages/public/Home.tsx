import { ArrowRight, Clock, Star, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingFlow from '@/components/booking/BookingFlow';

export default function Home() {
  return (
    <div className="flex flex-col w-full">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section id="inicio" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
        {/* Faixa dourada diagonal decorativa */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-6 origin-top-right -z-10" />
        {/* Faixa vermelha sutil no topo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-accent to-primary" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-center md:text-left">

              {/* Badge */}
              <div className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent-foreground gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Artesanal &amp; Premium
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Mini pizzas prontas para{' '}
                <span className="relative">
                  <span className="text-secondary">transformar</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-accent rounded-full opacity-70" />
                </span>{' '}
                qualquer momento.
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0">
                Escolha seu combo, agende o melhor dia e horário e tenha suas mini pizzas
                pré-assadas preparadas especialmente para você.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-base rounded-full shadow-lg hover:shadow-xl transition-all bg-secondary hover:bg-secondary/90 text-white"
                  asChild
                >
                  <a href="#combos">
                    Escolher meu combo <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 text-base rounded-full border-2 border-primary/40 text-primary hover:bg-primary/5"
                  asChild
                >
                  <a href="#como-funciona">Como funciona</a>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                {[
                  { label: 'Massa fresca diária', color: 'text-primary' },
                  { label: 'Ingredientes selecionados', color: 'text-secondary' },
                  { label: 'Agendamento garantido', color: 'text-accent-foreground' },
                ].map((b) => (
                  <span key={b.label} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <CheckCircle2 className={`w-4 h-4 ${b.color}`} />
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="flex-1 relative w-full max-w-md mx-auto">
              {/* Anel dourado */}
              <div className="absolute inset-0 rounded-full border-[6px] border-accent/30 scale-110 -z-10" />
              <div className="aspect-square bg-muted rounded-full overflow-hidden relative shadow-2xl border-4 border-white/70 group">
                <img
                  src="/images/11.jpeg"
                  alt="Mini pizzas premium"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay dourado sutil na borda */}
                <div className="absolute inset-0 rounded-full ring-4 ring-inset ring-accent/20" />
              </div>
              {/* Detalhe verde */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-primary/8 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ────────────────────────────────────────── */}
      <section id="como-funciona" className="py-16 relative overflow-hidden">
        {/* Fundo listrado sutil com as 3 cores */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-muted/40" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary/60" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/60" />
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Por que escolher a{' '}
              <span className="text-secondary">Fábrica</span>{' '}
              de{' '}
              <span className="text-primary">Pizzas</span>?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 — Dourado */}
            <div className="flex flex-col items-center text-center p-8 bg-background rounded-2xl shadow-sm border-2 border-accent/20 hover:border-accent/50 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:bg-accent/20 transition-colors border border-accent/30">
                <Star className="w-7 h-7 fill-accent text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Qualidade Artesanal</h3>
              <p className="text-muted-foreground">Massa leve e ingredientes selecionados. Sabor de pizzaria no conforto de casa.</p>
            </div>
            {/* Card 2 — Vermelho */}
            <div className="flex flex-col items-center text-center p-8 bg-background rounded-2xl shadow-sm border-2 border-secondary/20 hover:border-secondary/50 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary/20 transition-colors border border-secondary/30">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Praticidade Absoluta</h3>
              <p className="text-muted-foreground">Pré-assadas e prontas para o forno. Em poucos minutos seu evento está servido.</p>
            </div>
            {/* Card 3 — Verde */}
            <div className="flex flex-col items-center text-center p-8 bg-background rounded-2xl shadow-sm border-2 border-primary/20 hover:border-primary/50 transition-colors group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary/20 transition-colors border border-primary/30">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pedido Agendado</h3>
              <p className="text-muted-foreground">Garanta sua reserva para o dia e horário do seu evento com total previsibilidade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMBOS / AGENDAMENTO ──────────────────────────────── */}
      <section id="combos" className="py-24 bg-background relative overflow-hidden">
        {/* Faixa diagonal verde */}
        <div className="absolute top-0 left-0 w-full h-80 bg-primary/5 -skew-y-3 origin-top-left -z-10" />
        {/* Detalhe dourado lateral */}
        <div className="absolute right-0 top-1/4 w-2 h-48 bg-gradient-to-b from-accent via-secondary to-primary rounded-l-full opacity-40" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
            {/* Etiqueta colorida */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Reserve agora
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Nossos <span className="text-primary">Combos</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Opções sob medida para o seu evento. Escolha a quantidade ideal e agende com tranquilidade.
            </p>
          </div>

          <BookingFlow />
        </div>
      </section>

      {/* ── NOSSA PRODUÇÃO ────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        {/* Fundo com gradiente sutil das 3 cores */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Galeria */}
            <div className="order-2 lg:order-1 relative">
              {/* Anel dourado decorativo */}
              <div className="absolute inset-0 bg-accent/10 -rotate-3 rounded-[2.5rem]" />
              <div className="relative grid grid-cols-2 gap-3 md:gap-4 rounded-3xl bg-background p-2 md:p-3 shadow-xl border border-accent/20">
                <img src="/images/01.jpeg" alt="Preparo artesanal 1" className="rounded-2xl w-full h-40 md:h-56 object-cover" />
                <img src="/images/02.jpeg" alt="Preparo artesanal 2" className="rounded-2xl w-full h-40 md:h-56 object-cover translate-y-6 md:translate-y-8" />
                <img src="/images/03.jpeg" alt="Preparo artesanal 3" className="rounded-2xl w-full h-40 md:h-56 object-cover" />
                <img src="/images/04.jpeg" alt="Preparo artesanal 4" className="rounded-2xl w-full h-40 md:h-56 object-cover translate-y-6 md:translate-y-8" />
              </div>
              {/* Badge flutuante */}
              <div className="absolute -bottom-2 md:-bottom-6 -left-4 md:-left-6 bg-background p-3 md:p-4 rounded-2xl shadow-lg border-2 border-accent/30 flex items-center gap-3 md:gap-4 z-10">
                <div className="w-12 h-12 bg-accent/15 rounded-full flex items-center justify-center text-accent font-extrabold text-sm border border-accent/40">
                  100%
                </div>
                <div>
                  <p className="font-bold text-foreground leading-tight">Massa Artesanal</p>
                  <p className="text-xs text-muted-foreground">Feita todos os dias</p>
                </div>
              </div>
            </div>

            {/* Texto */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-secondary/10 border border-secondary/20 text-sm font-semibold text-secondary">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                Nossa história
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Qualidade artesanal em{' '}
                <span className="text-secondary">cada</span>{' '}
                detalhe
              </h2>
              <p className="text-lg text-muted-foreground">
                Nossas mini pizzas são preparadas com muito carinho, utilizando ingredientes
                rigorosamente selecionados e massa fresca aberta diariamente pelo nosso pizzaiolo.
              </p>
              <ul className="space-y-4">
                {[
                  { text: 'Molho de tomate especial', color: 'bg-secondary/10 text-secondary border-secondary/20' },
                  { text: 'Ingredientes de primeira linha', color: 'bg-accent/10 text-accent-foreground border-accent/20' },
                  { text: 'Assamento no ponto perfeito', color: 'bg-secondary/10 text-secondary border-secondary/20' },
                  { text: 'Amor e dedicação na receita', color: 'bg-primary/10 text-primary border-primary/20' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${item.color}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Button
                  size="lg"
                  className="rounded-full shadow-lg h-14 px-8 text-base bg-primary hover:bg-primary/90"
                  onClick={() => document.getElementById('combos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Quero experimentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-muted/30" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary via-accent to-primary" />

        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Perguntas <span className="text-accent-foreground" style={{color: 'hsl(var(--accent))'}}>Frequentes</span>
            </h2>
            <p className="text-lg text-muted-foreground">Tire suas dúvidas e faça seu pedido com tranquilidade.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-background border-l-4 border-secondary px-6 py-6 rounded-2xl shadow-sm border border-border">
              <h4 className="font-semibold text-lg mb-2 text-foreground">Como funciona o agendamento?</h4>
              <p className="text-muted-foreground">
                Você escolhe o combo, seleciona a data e o horário disponíveis na nossa agenda,
                informa seus dados e confirma. Seu pedido entra na nossa linha de produção
                especificamente para o horário escolhido.
              </p>
            </div>
            <div className="bg-background border-l-4 border-primary px-6 py-6 rounded-2xl shadow-sm border border-border">
              <h4 className="font-semibold text-lg mb-2 text-foreground">As mini pizzas são pré-assadas?</h4>
              <p className="text-muted-foreground">
                Sim! Elas vão prontas para finalizar. Basta colocar no forno por poucos minutos
                até o queijo derreter e a massa dourar.
              </p>
            </div>
            <div className="bg-background border-l-4 border-accent px-6 py-6 rounded-2xl shadow-sm border border-border">
              <h4 className="font-semibold text-lg mb-2 text-foreground">Posso escolher os sabores?</h4>
              <p className="text-muted-foreground">
                Sim! Cada combo inclui a escolha de sabores. Você poderá combinar os sabores
                disponíveis no dia do seu pedido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden text-center">
        {/* Fundo tricolor da marca */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/90 via-foreground to-primary/90" />
        {/* Detalhe dourado */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-accent" />
        {/* Brilho central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-accent/10 rounded-full blur-[80px] -z-0" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-accent/20 border border-accent/40 text-sm font-bold text-accent mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Vagas limitadas
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Seu próximo momento especial pode{' '}
            <span className="text-accent">começar por aqui.</span>
          </h2>
          <p className="text-lg text-white/70 mb-10">
            Garanta agora mesmo o seu combo de mini pizzas e ofereça a melhor
            experiência para seus convidados.
          </p>
          <Button
            size="lg"
            className="h-16 px-12 text-lg rounded-full bg-accent text-foreground hover:bg-accent/90 shadow-2xl hover:shadow-accent/30 transition-all w-full sm:w-auto font-bold border-2 border-white/20"
            asChild
          >
            <a href="#combos">Escolher meu combo →</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
