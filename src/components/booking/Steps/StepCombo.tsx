import { useState, useEffect } from 'react';
import { useBooking, type Combo } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';

// Mock temporário para simular fetch do DB
const mockCombos: Combo[] = [
  {
    id: 'c1',
    name: 'Combo 30 Unidades',
    description: 'Ideal para pequenas reuniões. Acompanha 2 sabores à sua escolha.',
    pizza_quantity: 30,
    price: 59.90,
    promotional_price: null,
    image_url: '/images/05.jpeg',
  },
  {
    id: 'c2',
    name: 'Combo 50 Unidades',
    description: 'A opção mais pedida. Serve muito bem até 8 pessoas com 3 sabores.',
    pizza_quantity: 50,
    price: 99.90,
    promotional_price: 89.90,
    image_url: '/images/06.jpeg',
  }
];

export default function StepCombo({ onNext }: { onNext: () => void }) {
  const { state, setCombo, setQuantity } = useBooking();
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from Supabase
    setTimeout(() => {
      setCombos(mockCombos);
      setLoading(false);
    }, 500);
  }, []);

  const handleSelect = (c: Combo) => {
    setCombo(c);
  };

  const handleNext = () => {
    if (state.combo) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left mb-8">
        <h2 className="text-2xl font-bold text-foreground">Escolha seu combo</h2>
        <p className="text-muted-foreground">Selecione a quantidade ideal de mini pizzas para o seu evento.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {combos.map(combo => {
            const isSelected = state.combo?.id === combo.id;
            return (
              <div 
                key={combo.id}
                onClick={() => handleSelect(combo)}
                className={`flex flex-col sm:flex-row gap-4 p-4 rounded-2xl cursor-pointer border-2 transition-all duration-200 ${
                  isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
              >
                <div className="w-full sm:w-32 h-32 bg-muted rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                  {combo.image_url ? (
                     <img src={combo.image_url} alt={combo.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground">[Imagem]</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{combo.name}</h3>
                      <div className="text-right">
                        {combo.promotional_price && (
                          <div className="text-sm line-through text-muted-foreground">
                            R$ {combo.price.toFixed(2).replace('.',',')}
                          </div>
                        )}
                        <div className="font-bold text-primary text-lg">
                          R$ {(combo.promotional_price || combo.price).toFixed(2).replace('.',',')}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{combo.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {state.combo && (
        <div className="pt-6 mt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">Quantidade:</span>
            <div className="flex items-center bg-muted rounded-full p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, state.quantity - 1))}
                className="w-8 h-8 rounded-full bg-background flex items-center justify-center font-medium shadow-sm"
              >-</button>
              <span className="w-10 text-center font-semibold">{state.quantity}</span>
              <button 
                onClick={() => setQuantity(state.quantity + 1)}
                className="w-8 h-8 rounded-full bg-background flex items-center justify-center font-medium shadow-sm"
              >+</button>
            </div>
          </div>
          <Button size="lg" className="w-full sm:w-auto px-10 rounded-full" onClick={handleNext}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
}
