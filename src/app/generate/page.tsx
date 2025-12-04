'use client';

import { useState } from 'react';
import { getMegaNumbersAction } from './actions';
import PaymentScreen from './components/payment-screen';
import ProcessingScreen from './components/processing-screen';
import ResultsScreen from './components/results-screen';
import { AnimatedBackground } from '@/components/animated-background';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Stage = 'payment' | 'processing' | 'results' | 'error';

export default function GeneratePage() {
  const [stage, setStage] = useState<Stage>('payment');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleGenerate() {
    if (isProcessing) return;
    setIsProcessing(true);
    setError(null);
    setStage('processing');
    
    try {
      const result = await getMegaNumbersAction();
      // The processing screen has a minimum animation time, wait for it if API is too fast
      await new Promise(resolve => setTimeout(resolve, 3000));
      if (result.numbers) {
        setNumbers(result.numbers.sort((a, b) => a - b));
        setStage('results');
      } else {
        setError(result.error || 'Falha ao gerar números. Tente novamente.');
        setStage('error');
      }
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setError('Erro de conexão com o servidor de análise. Tente novamente.');
      setStage('error');
    } finally {
      setIsProcessing(false);
    }
  }

  function handleReset() {
    setStage('payment');
    setNumbers([]);
    setError(null);
  }

  const renderStage = () => {
    switch (stage) {
      case 'payment':
        return <PaymentScreen onPay={handleGenerate} isProcessing={isProcessing} />;
      case 'processing':
        return <ProcessingScreen />;
      case 'results':
        return <ResultsScreen numbers={numbers} onReset={handleReset} />;
      case 'error':
        return (
          <div className="w-full max-w-md text-center">
            <Alert variant="destructive" className="bg-red-900/30 border-accent text-accent-foreground">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro de Geração</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <Button onClick={handleReset} className="mt-8" variant="secondary">
              Tentar Novamente
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
      <AnimatedBackground />
      <div className="relative z-10 flex w-full flex-col items-center justify-center">
        {renderStage()}
      </div>
    </div>
  );
}
