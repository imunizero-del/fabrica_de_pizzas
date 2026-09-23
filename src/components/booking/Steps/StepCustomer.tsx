import { useState } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';

export default function StepCustomer({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { state, setCustomer } = useBooking();
  const [name, setName] = useState(state.customer.name);
  const [whatsapp, setWhatsapp] = useState(state.customer.whatsapp);
  const [notes, setNotes] = useState(state.customer.notes);
  const [error, setError] = useState('');

  // Máscara simples para WhatsApp (apenas números ou formatação básica no front)
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // só números
    if (val.length > 11) val = val.substring(0, 11);
    
    // Formatar (XX) XXXXX-XXXX
    if (val.length > 2 && val.length <= 7) {
      val = `(${val.substring(0,2)}) ${val.substring(2)}`;
    } else if (val.length > 7) {
      val = `(${val.substring(0,2)}) ${val.substring(2,7)}-${val.substring(7)}`;
    }
    setWhatsapp(val);
  };

  const handleNext = () => {
    if (!name.trim()) {
      setError('Por favor, informe seu nome.');
      return;
    }
    const cleanWhatsapp = whatsapp.replace(/\D/g, '');
    if (cleanWhatsapp.length < 10) {
      setError('Por favor, informe um WhatsApp válido.');
      return;
    }
    
    setError('');
    setCustomer({ name, whatsapp, notes });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left mb-6">
        <h2 className="text-2xl font-bold text-foreground">Seus Dados</h2>
        <p className="text-muted-foreground">Precisamos de poucas informações para registrar seu pedido.</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto md:mx-0">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">Nome completo <span className="text-destructive">*</span></label>
          <input
            id="name"
            type="text"
            className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="Ex: João da Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="whatsapp" className="text-sm font-medium text-foreground">WhatsApp <span className="text-destructive">*</span></label>
          <input
            id="whatsapp"
            type="tel"
            className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="(00) 00000-0000"
            value={whatsapp}
            onChange={handleWhatsappChange}
          />
          <p className="text-xs text-muted-foreground">Usaremos para confirmar seu pedido e enviar atualizações.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium text-foreground">Observações <span className="text-muted-foreground font-normal">(Opcional)</span></label>
          <textarea
            id="notes"
            className="w-full p-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[100px] resize-y"
            placeholder="Alguma restrição ou observação especial?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
            {error}
          </div>
        )}
      </div>

      <div className="pt-6 mt-6 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <Button variant="ghost" onClick={onPrev} className="w-full sm:w-auto">Voltar</Button>
        <Button size="lg" className="w-full sm:w-auto px-10 rounded-full" onClick={handleNext}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
