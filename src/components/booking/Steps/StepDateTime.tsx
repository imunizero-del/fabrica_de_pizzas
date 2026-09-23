import { useState, useEffect } from 'react';
import { useBooking, type ScheduleDate, type TimeSlot } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function StepDateTime({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { state, setDate, setTimeSlot } = useBooking();
  const [dates, setDates] = useState<ScheduleDate[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorDates, setErrorDates] = useState('');
  const [errorSlots, setErrorSlots] = useState('');

  // Buscar datas disponíveis
  useEffect(() => {
    const fetchDates = async () => {
      setLoadingDates(true);
      setErrorDates('');

      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('schedule_dates')
        .select('id, schedule_date')
        .eq('is_open', true)
        .gte('schedule_date', today)
        .order('schedule_date', { ascending: true });

      if (error) {
        setErrorDates('Não foi possível carregar as datas. Tente novamente.');
      } else {
        setDates((data as ScheduleDate[]) || []);
      }
      setLoadingDates(false);
    };

    fetchDates();
  }, []);

  // Buscar horários quando uma data é selecionada
  useEffect(() => {
    if (!state.date) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setErrorSlots('');
      setSlots([]);

      const { data, error } = await supabase
        .from('time_slots')
        .select('id, date_id, schedule_time, capacity_limit, reserved_capacity, capacity_mode, is_active')
        .eq('date_id', state.date!.id)
        .eq('is_active', true)
        .order('schedule_time', { ascending: true });

      if (error) {
        setErrorSlots('Não foi possível carregar os horários. Tente novamente.');
      } else {
        setSlots((data as TimeSlot[]) || []);
      }
      setLoadingSlots(false);
    };

    fetchSlots();
  }, [state.date]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00Z');
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).format(d);
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  const isSlotFull = (slot: TimeSlot) => {
    return slot.reserved_capacity >= slot.capacity_limit;
  };

  const getAvailabilityColor = (slot: TimeSlot) => {
    const pct = slot.reserved_capacity / slot.capacity_limit;
    if (pct >= 1) return null; // esgotado
    if (pct >= 0.7) return 'text-amber-500'; // quase cheio
    return 'text-green-500';
  };

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left mb-6">
        <h2 className="text-2xl font-bold text-foreground">Quando você precisa?</h2>
        <p className="text-muted-foreground">Escolha a data e o horário para agendar seu pedido.</p>
      </div>

      {/* Seleção de Data */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" /> 1. Escolha a data
        </h3>

        {loadingDates ? (
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-24 h-20 rounded-xl bg-muted animate-pulse shrink-0"></div>
            ))}
          </div>
        ) : errorDates ? (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorDates}</p>
          </div>
        ) : dates.length === 0 ? (
          <div className="p-4 rounded-xl bg-muted/50 text-muted-foreground text-sm text-center border border-border">
            Nenhuma data disponível no momento. Entre em contato conosco!
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
            {dates.map(d => {
              const isSelected = state.date?.id === d.id;
              const parts = formatDate(d.schedule_date).split(' ');
              return (
                <button
                  key={d.id}
                  onClick={() => setDate(d)}
                  className={`snap-start shrink-0 w-28 p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground shadow-md'
                      : 'border-border hover:border-primary/50 bg-background text-foreground'
                  }`}
                >
                  <span className="text-xs font-medium uppercase opacity-80">{parts[0]?.replace(',', '')}</span>
                  <span className="text-xl font-bold">{parts[1]}</span>
                  <span className="text-xs font-medium opacity-80">{parts[2]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Seleção de Horário */}
      {state.date && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> 2. Escolha o horário
          </h3>

          {loadingSlots ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 rounded-xl bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : errorSlots ? (
            <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{errorSlots}</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="p-4 rounded-xl bg-muted/50 text-muted-foreground text-sm text-center border border-border">
              Nenhum horário disponível para esta data.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.map(s => {
                const isSelected = state.timeSlot?.id === s.id;
                const full = isSlotFull(s);
                const availColor = getAvailabilityColor(s);
                const remaining = s.capacity_limit - s.reserved_capacity;
                return (
                  <button
                    key={s.id}
                    disabled={full}
                    onClick={() => setTimeSlot(s)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-medium transition-all relative ${
                      full
                        ? 'border-border/50 bg-muted/50 text-muted-foreground/50 cursor-not-allowed opacity-60'
                        : isSelected
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border hover:border-primary/50 text-foreground bg-background'
                    }`}
                  >
                    <span className="text-base">{formatTime(s.schedule_time)}</span>
                    {!full && availColor && (
                      <span className={`text-[10px] font-semibold ${availColor}`}>
                        {remaining <= 3 ? `${remaining} vaga${remaining > 1 ? 's' : ''}` : 'Disponível'}
                      </span>
                    )}
                    {full && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 text-[10px] uppercase font-bold text-destructive rounded-lg tracking-widest backdrop-blur-[1px]">
                        Esgotado
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="pt-6 mt-6 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <Button variant="ghost" onClick={onPrev} className="w-full sm:w-auto">Voltar</Button>
        <Button
          size="lg"
          className="w-full sm:w-auto px-10 rounded-full"
          onClick={onNext}
          disabled={!state.date || !state.timeSlot}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
