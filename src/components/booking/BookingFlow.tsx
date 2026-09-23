import { useState } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import StepCombo from './Steps/StepCombo';
import StepDateTime from './Steps/StepDateTime';
import StepCustomer from './Steps/StepCustomer';
import StepReview from './Steps/StepReview';
import StepSuccess from './Steps/StepSuccess';

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const { state } = useBooking();

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const goToStep = (s: number) => setStep(s);

  // Se já temos resultado, forçar passo 5 (Sucesso)
  if (state.orderResult && step !== 5) {
    setStep(5);
  }

  const steps = [
    { num: 1, label: 'Combo' },
    { num: 2, label: 'Data/Hora' },
    { num: 3, label: 'Dados' },
    { num: 4, label: 'Resumo' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-background rounded-3xl md:shadow-xl md:border border-border overflow-hidden flex flex-col">
      {/* Progress Bar Header */}
      {step < 5 && (
        <div className="bg-muted/30 p-4 md:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex flex-col items-center gap-2 flex-1 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 transition-colors ${
                  step >= s.num ? 'bg-primary text-primary-foreground' : 'bg-background border-2 border-border text-muted-foreground'
                }`}>
                  {s.num}
                </div>
                <span className={`text-xs md:text-sm hidden sm:block ${step >= s.num ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
                {idx < steps.length - 1 && (
                  <div className={`absolute top-4 left-1/2 w-full h-[2px] -z-0 ${
                    step > s.num ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-4 md:p-8 flex-1">
        {step === 1 && <StepCombo onNext={nextStep} />}
        {step === 2 && <StepDateTime onNext={nextStep} onPrev={prevStep} />}
        {step === 3 && <StepCustomer onNext={nextStep} onPrev={prevStep} />}
        {step === 4 && <StepReview onNext={nextStep} onPrev={prevStep} onEdit={goToStep} />}
        {step === 5 && <StepSuccess />}
      </div>
    </div>
  );
}
