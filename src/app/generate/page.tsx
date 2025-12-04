'use client';

import { useState } from 'react';
import { getMegaNumbersAction } from './actions';
import PaymentScreen from './components/payment-screen';
import ProcessingScreen from './components/processing-screen';
import ResultsScreen from './components/results-screen';
import { AnimatedBackground } from '@/components/animated-background';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LotteryCard } from './components/lottery-card';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

type Stage = 'payment' | 'processing' | 'results' | 'error';

export default function GeneratePage() {
  const [stage, setStage] = useState<Stage>('payment');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [numberOfNumbers, setNumberOfNumbers] = useState(6);

  async function handleGenerate() {
    if (isProcessing) return;
    setIsProcessing(true);
    setError(null);
    setStage('processing');
    
    try {
      // Pass the selected number of numbers to the action
      const result = await getMegaNumbersAction(numberOfNumbers);
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
    setNumberOfNumbers(6);
  }

  const renderMainContent = () => {
    switch (stage) {
      case 'processing':
        return <ProcessingScreen />;
      case 'results':
        return <ResultsScreen numbers={numbers} onReset={handleReset} />;
      case 'error':
        return (
          <div className="w-full max-w-md text-center">
            <Alert variant="destructive">
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
      case 'payment':
      default:
        return (
          <div className="w-full max-w-md mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Acesso aos Números Sugeridos</h1>
            <p className="text-5xl md:text-6xl font-bold text-white mb-2">R$ 4,97</p>
            <p className="text-sm text-green-200 mb-6">Apenas uma única liberação por jogo</p>
            
            <div className="space-y-2 text-sm text-green-100 mb-8">
                <p>Sugestões geradas por nossa IA estatística</p>
                <p>Combinações com alta probabilidade estatística</p>
            </div>

            <div className="bg-card/10 backdrop-blur-sm p-4 rounded-lg my-8 space-y-4">
              <Label htmlFor="number-selector" className="text-white font-bold text-lg">
                Quantos números você quer gerar? <span className="text-primary-foreground font-headline text-xl">{numberOfNumbers}</span>
              </Label>
              <Slider
                id="number-selector"
                min={6}
                max={15}
                step={1}
                value={[numberOfNumbers]}
                onValueChange={(value) => setNumberOfNumbers(value[0])}
                className="w-full"
              />
            </div>
            
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl backdrop-blur-sm z-10">
                    <Lock className="w-16 h-16 text-white/50 animate-pulse"/>
                </div>
                <LotteryCard />
            </div>

            <div className="space-y-1 text-xs text-green-200 mb-8">
                <p>Conteúdo bloqueado</p>
                <p>Libere para ver as dezenas sugeridas</p>
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={isProcessing}
              className="w-full h-14 text-lg font-bold bg-yellow-400 text-green-900 hover:bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-all duration-300"
            >
              {isProcessing ? 'PROCESSANDO...' : 'LIBERAR SUGESTÕES'}
            </Button>
             <p className="text-xs text-green-200 mt-2">Acesso imediato após pagamento</p>
          </div>
        );
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-gradient-to-br from-green-600 via-green-800 to-green-900">
      <div className="relative z-10 flex w-full flex-col items-center justify-center">
        {renderMainContent()}
      </div>
    </div>
  );
}
