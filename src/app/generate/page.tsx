'use client';

import { useState } from 'react';
import AccessCodeScreen from './components/access-code-screen';
import ProcessingScreen from './components/processing-screen';
import ResultsScreen from './components/results-screen';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getNumbersByAccessCodeAction } from './actions';

type Stage = 'access_code' | 'processing' | 'results' | 'error';

export default function GeneratePage() {
  const [stage, setStage] = useState<Stage>('access_code');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleVerifyCode(accessCode: string) {
    if (isProcessing) return;
    setIsProcessing(true);
    setError(null);
    setStage('processing');

    try {
      const result = await getNumbersByAccessCodeAction(accessCode);
      // Pequeno delay para a tela de processamento ser visível
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (result.numbers) {
        setNumbers(result.numbers.sort((a, b) => a - b));
        setStage('results');
      } else {
        setError(result.error || 'Falha ao verificar o código. Tente novamente.');
        setStage('error');
      }
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setError('Erro de conexão com o servidor de análise. Tente novamente.');
      setStage('error');
    } finally {
      setIsProcessing(false);
    }
  }

  function handleReset() {
    setStage('access_code');
    setNumbers([]);
    setError(null);
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
              <AlertTitle>Erro de Validação</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <Button onClick={handleReset} className="mt-8" variant="secondary">
              Tentar Novamente
            </Button>
          </div>
        );
      case 'access_code':
      default:
        return (
          <AccessCodeScreen onVerify={handleVerifyCode} isProcessing={isProcessing} />
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
