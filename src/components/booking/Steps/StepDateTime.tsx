import { useState, useEffect } from 'react';
import { useBooking, type ScheduleDate, type TimeSlot } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

// Mock
const mockDates: ScheduleDate[] = [
  { id: 'd1', schedule_date: '2026-10-10' },
  { id: 'd2', schedule_date: '2026-10-11' },
  { id: 'd3', schedule_date: '2026-10-12' },
];

const mockSlots: TimeSlot[] = [
  { id: 's1', date_id: 'd1', schedule_time: '18:00:00', capacity_limit: 10, reserved_capacity: 0 },
  { id: 's2', date_id: 'd1', schedule_time: '19:00:00', capacity_limit: 10, reserved_capacity: 10 }, // esgotado
  { id: 's3', date_id: 'd1', schedule_time: '20:00:00', capacity_limit: 10, reserved_capacity: 5 },
];

export default function StepDateTime({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { state, setDate, setTimeSlot } = useBooking();
  const [dates, setDates] = useState<ScheduleDate[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    // TODO: Fetch from Supabase
    setTimeout(() => {
      setDates(mockDates);
      setLoadingDates(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (state.date) {
      setLoadingSlots(true);
      // TODO: Fetch slots for date from Supabase
      setTimeout(() => {
        setSlots(mockSlots);
        setLoadingSlots(false);
      }, 500);
    }
  }, [state.date]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00Z');
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).format(d);
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5); // 18:00
  };

  const isSlotFull = (slot: TimeSlot) => {
    // Para simplificar no mockup, comparando direto
    return slot.reserved_capacity >= slot.capacity_limit;
  };

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left mb-6">
        <h2 className="text-2xl font-bold text-foreground">Quando você precisa?</h2>
        <p className="text-muted-foreground">Escolha a data e o horário para agendar seu pedido.</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-primary"/> 1. Escolha a data</h3>
        {loadingDates ? (
          <div className="flex gap-3 overflow-hidden">
            {[1,2,3].map(i => <div key={i} className="w-24 h-20 rounded-xl bg-muted animate-pulse shrink-0"></div>)}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
            {dates.map(d => {
              const isSelected = state.date?.id === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDate(d)}
                  className={`snap-start shrink-0 w-28 p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                    isSelected ? 'border-primary bg-primary text-primary-foreground shadow-md' : 'border-border hover:border-primary/50 bg-background text-foreground'
                  }`}
                >
                  <span className="text-xs font-medium uppercase opacity-80">{formatDate(d.schedule_date).split(',')[0]}</span>
                  <span className="text-xl font-bold">{formatDate(d.schedule_date).split(' ')[1]}</span>
                  <span className="text-xs font-medium opacity-80">{formatDate(d.schedule_date).split(' ')[3]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {state.date && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-semibold flex items-center gap-2"><Clock className="w-5 h-5 text-primary"/> 2. Escolha o horário</h3>
          {loadingSlots ? (
             <div className="grid grid-cols-3 gap-3">
               {[1,2,3].map(i => <div key={i} className="h-12 rounded-xl bg-muted animate-pulse"></div>)}
             </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.map(s => {
                const isSelected = state.timeSlot?.id === s.id;
                const full = isSlotFull(s);
                return (
                  <button
                    key={s.id}
                    disabled={full}
                    onClick={() => setTimeSlot(s)}
                    className={`p-3 rounded-xl border-2 flex items-center justify-center font-medium transition-all ${
                      full 
                        ? 'border-border/50 bg-muted/50 text-muted-foreground/50 cursor-not-allowed opacity-60 relative' 
                        : isSelected 
                          ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                          : 'border-border hover:border-primary/50 text-foreground bg-background'
                    }`}
                  >
                    {formatTime(s.schedule_time)}
                    {full && <div className="absolute inset-0 flex items-center justify-center bg-background/80 text-[10px] uppercase font-bold text-destructive rounded-lg tracking-widest backdrop-blur-[1px]">Esgotado</div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="pt-6 mt-6 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <Button variant="ghost" onClick={onPrev} className="w-full sm:w-auto">Voltar</Button>
        <Button size="lg" className="w-full sm:w-auto px-10 rounded-full" onClick={onNext} disabled={!state.date || !state.timeSlot}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
