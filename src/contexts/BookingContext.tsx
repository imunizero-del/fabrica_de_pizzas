import { createContext, useContext, useState, type ReactNode } from 'react';

// Tipos baseados no schema do banco
export type Combo = {
  id: string;
  name: string;
  description: string;
  pizza_quantity: number;
  price: number;
  promotional_price: number | null;
  badge: string | null;
  image_url: string | null;
};

export type ScheduleDate = {
  id: string;
  schedule_date: string;
};

export type TimeSlot = {
  id: string;
  date_id: string;
  schedule_time: string;
  capacity_mode: 'orders' | 'units';
  capacity_limit: number;
  reserved_capacity: number;
  is_active?: boolean;
};

interface BookingState {
  combo: Combo | null;
  quantity: number;
  date: ScheduleDate | null;
  timeSlot: TimeSlot | null;
  customer: {
    name: string;
    whatsapp: string;
    notes: string;
  };
  orderResult: { id: string; order_number: string } | null;
}

interface BookingContextData {
  state: BookingState;
  setCombo: (combo: Combo) => void;
  setQuantity: (qtd: number) => void;
  setDate: (date: ScheduleDate) => void;
  setTimeSlot: (slot: TimeSlot) => void;
  setCustomer: (customer: BookingState['customer']) => void;
  setOrderResult: (result: { id: string; order_number: string }) => void;
  reset: () => void;
  totalPrice: number;
}

const initialState: BookingState = {
  combo: null,
  quantity: 1,
  date: null,
  timeSlot: null,
  customer: { name: '', whatsapp: '', notes: '' },
  orderResult: null,
};

const BookingContext = createContext<BookingContextData | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);

  const setCombo = (combo: Combo) => setState(prev => ({ ...prev, combo, quantity: 1, date: null, timeSlot: null }));
  const setQuantity = (quantity: number) => setState(prev => ({ ...prev, quantity }));
  const setDate = (date: ScheduleDate) => setState(prev => ({ ...prev, date, timeSlot: null }));
  const setTimeSlot = (timeSlot: TimeSlot) => setState(prev => ({ ...prev, timeSlot }));
  const setCustomer = (customer: BookingState['customer']) => setState(prev => ({ ...prev, customer }));
  const setOrderResult = (orderResult: { id: string; order_number: string }) => setState(prev => ({ ...prev, orderResult }));
  const reset = () => setState(initialState);

  const currentPrice = state.combo 
    ? (state.combo.promotional_price || state.combo.price) 
    : 0;
  const totalPrice = currentPrice * state.quantity;

  return (
    <BookingContext.Provider
      value={{
        state,
        setCombo,
        setQuantity,
        setDate,
        setTimeSlot,
        setCustomer,
        setOrderResult,
        reset,
        totalPrice,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
}
