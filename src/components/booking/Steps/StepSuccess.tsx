import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageCircle } from 'lucide-react';

export default function StepSuccess() {
  const { state, totalPrice } = useBooking();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00Z');
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  };

  const formatTime = (timeStr?: string) => {
    return timeStr ? timeStr.substring(0, 5) : '';
  };

  const generateWhatsAppLink = () => {
    const phone = "5522998458832";
    const orderNumber = state.orderResult?.order_number || '';
    const comboName = state.combo?.name || '';
    const date = formatDate(state.date?.schedule_date);
    const time = formatTime(state.timeSlot?.schedule_time);
    
    const message = `Olá! Acabei de fazer um agendamento pelo site da Fábrica de Pizzas.\n\n*Pedido:* #${orderNumber}\n*Combo:* ${comboName}\n*Data:* ${date}\n*Horário:* ${time}\n*Total:* R$ ${totalPrice.toFixed(2).replace('.',',')}\n\nGostaria de confirmar meu pedido.`;
    
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-8 py-8 text-center flex flex-col items-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-in zoom-in duration-500 shadow-sm border border-green-200">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Pedido agendado!</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Sua reserva foi confirmada com sucesso em nosso sistema.
        </p>
      </div>

      <div className="bg-muted/50 w-full max-w-sm rounded-2xl p-6 border border-border/50 shadow-inner">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Número do Pedido</p>
        <p className="text-2xl font-bold font-mono text-primary mb-4">#{state.orderResult?.order_number}</p>
        
        <div className="space-y-2 text-sm text-left">
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Combo:</span>
            <span className="font-semibold text-right">{state.combo?.name}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Data/Hora:</span>
            <span className="font-semibold text-right">{formatDate(state.date?.schedule_date)} às {formatTime(state.timeSlot?.schedule_time)}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-semibold text-right text-amber-600">Pendente</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-muted-foreground font-medium">Total:</span>
            <span className="font-bold text-primary">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 w-full max-w-sm pt-4">
        <p className="text-sm text-muted-foreground">
          Para agilizar a produção, clique no botão abaixo e envie a confirmação para o nosso WhatsApp.
        </p>
        
        <Button size="lg" className="w-full h-14 rounded-xl bg-[#25D366] hover:bg-[#20b958] text-white shadow-lg shadow-green-900/20 text-base" asChild>
          <a href={generateWhatsAppLink()} target="_blank" rel="noreferrer">
            <MessageCircle className="w-5 h-5 mr-2" />
            Falar com a Fábrica de Pizzas
          </a>
        </Button>
      </div>
    </div>
  );
}
