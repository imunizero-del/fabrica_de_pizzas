import { useState } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Pizza, Calendar, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function StepReview({ onNext, onPrev, onEdit }: { onNext: () => void, onPrev: () => void, onEdit: (step: number) => void }) {
  const { state, setOrderResult, totalPrice } = useBooking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00Z');
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  };

  const formatTime = (timeStr?: string) => {
    return timeStr ? timeStr.substring(0, 5) : '';
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      const idempotencyKey = crypto.randomUUID();

      const { data, error: rpcError } = await supabase.rpc('create_booking', {
        p_idempotency_key: idempotencyKey,
        p_customer_name: state.customer.name,
        p_customer_whatsapp: state.customer.whatsapp,
        p_customer_notes: state.customer.notes || '',
        p_time_slot_id: state.timeSlot?.id,
        p_combo_id: state.combo?.id,
        p_quantity: state.quantity,
      });

      if (rpcError) {
        // Erro de rede ou banco
        throw new Error(rpcError.message);
      }

      // A RPC retorna um JSON com success: true/false
      const result = data as { success: boolean; error?: string; order_id?: string; order_number?: string };

      if (!result.success) {
        throw new Error(result.error || 'UNKNOWN_ERROR');
      }

      setOrderResult({
        id: result.order_id!,
        order_number: result.order_number!,
      });
      onNext();

    } catch (err: any) {
      const msg: string = err.message || '';

      if (msg.includes('INSUFFICIENT_CAPACITY')) {
        setError('Infelizmente as vagas para este horário acabaram de esgotar. Por favor, volte e escolha outro horário.');
      } else if (msg.includes('TIME_SLOT_INACTIVE')) {
        setError('Este horário não está mais disponível. Por favor, escolha outro.');
      } else if (msg.includes('DATE_NOT_AVAILABLE')) {
        setError('Esta data foi fechada. Por favor, volte e escolha outra data.');
      } else if (msg.includes('COMBO_NOT_AVAILABLE')) {
        setError('Este combo não está mais disponível. Por favor, escolha outro.');
      } else if (msg.includes('DUPLICATE_ORDER')) {
        setError('Este pedido já foi processado anteriormente. Verifique seu WhatsApp.');
      } else {
        setError('Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!state.combo || !state.date || !state.timeSlot) return null;

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left mb-6">
        <h2 className="text-2xl font-bold text-foreground">Revise seu Pedido</h2>
        <p className="text-muted-foreground">Confira os detalhes antes de confirmar.</p>
      </div>

      <div className="bg-muted/30 border border-border rounded-2xl p-4 md:p-6 space-y-6">
        {/* Combo */}
        <div className="flex justify-between items-start gap-4 pb-6 border-b border-border/50">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Pizza className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{state.combo.name}</p>
              <p className="text-sm text-muted-foreground">
                Quantidade: {state.quantity}x ({state.combo.pizza_quantity * state.quantity} mini pizzas)
              </p>
            </div>
          </div>
          <button onClick={() => onEdit(1)} className="text-xs font-medium text-primary hover:underline">Editar</button>
        </div>

        {/* Data/Hora */}
        <div className="flex justify-between items-start gap-4 pb-6 border-b border-border/50">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Agendado para</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(state.date.schedule_date)} às {formatTime(state.timeSlot.schedule_time)}
              </p>
            </div>
          </div>
          <button onClick={() => onEdit(2)} className="text-xs font-medium text-primary hover:underline">Editar</button>
        </div>

        {/* Cliente */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{state.customer.name}</p>
              <p className="text-sm text-muted-foreground">{state.customer.whatsapp}</p>
              {state.customer.notes && (
                <p className="text-sm text-muted-foreground mt-2 flex items-start gap-1">
                  <FileText className="w-4 h-4 mt-0.5 shrink-0" /> {state.customer.notes}
                </p>
              )}
            </div>
          </div>
          <button onClick={() => onEdit(3)} className="text-xs font-medium text-primary hover:underline">Editar</button>
        </div>
      </div>

      <div className="flex justify-between items-center py-2 px-4 bg-primary/5 rounded-xl border border-primary/20">
        <span className="font-semibold">Total a pagar:</span>
        <span className="text-2xl font-bold text-primary">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="pt-6 mt-6 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <Button variant="ghost" onClick={onPrev} className="w-full sm:w-auto" disabled={loading}>Voltar</Button>
        <Button
          size="lg"
          className="w-full sm:w-auto px-10 rounded-full font-bold relative overflow-hidden"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              Processando reserva...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Confirmar Agendamento
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
