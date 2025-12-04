'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProcessingScreen from './components/processing-screen';
import ResultsScreen from './components/results-screen';
import { AnimatedBackground } from '@/components/animated-background';
import { verifyAccessCode } from './actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Stage = 'processing' | 'results' | 'error' | 'loading';

function GeneratePageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [stage, setStage] = useState<Stage>('loading');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current || numbers.length > 0) {
      return;
    }

    const code = searchParams.get('code');
    const numberOfNumbersStr = searchParams.get('numbers');
    const numberOfNumbers = numberOfNumbersStr ? parseInt(numberOfNumbersStr, 10) : 6;
    
    if (!code) {
      setError('Nenhum código de acesso fornecido. Por favor, volte e insira um código.');
      setStage('error');
      return;
    }

    const checkCode = async () => {
      setStage('processing');
      hasVerified.current = true; 
      try {
        const result = await verifyAccessCode(code, numberOfNumbers);
        if (result.success && result.numbers) {
          setNumbers(result.numbers);
          setStage('results');
        } else {
          setError(result.error || 'Ocorreu um erro desconhecido.');
          setStage('error');
          toast({
            variant: "destructive",
            title: "Código Inválido",
            description: result.error,
          });
        }
      } catch (e: any) {
        setError(e.message || 'Falha ao verificar o código.');
        setStage('error');
        toast({
            variant: "destructive",
            title: "Erro de Conexão",
            description: "Não foi possível conectar ao servidor. Tente novamente.",
        });
      }
    };

    checkCode();
  }, [searchParams, numbers.length, toast]);

  const handleReset = () => {
    window.location.href = '/pricing';
  };

  const renderError = () => (
    <div className="text-center bg-card p-8 rounded-lg shadow-lg border border-destructive">
      <h1 className="text-2xl font-headline text-destructive mb-4">Acesso Negado</h1>
      <p className="text-muted-foreground mb-6">{error}</p>
      <Button asChild>
        <Link href="/pricing">Tentar Novamente</Link>
      </Button>
    </div>
  );

  const renderMainContent = () => {
    switch (stage) {
      case 'processing':
      case 'loading':
        return <ProcessingScreen />;
      case 'results':
        return <ResultsScreen numbers={numbers} onReset={handleReset} />;
      case 'error':
        return renderError();
      default:
        return <ProcessingScreen />;
    }
  };
  
  return renderMainContent();
}

export default function GeneratePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
      <AnimatedBackground />
      <div className="relative z-10 flex w-full flex-col items-center justify-center">
        <Suspense fallback={<ProcessingScreen />}>
          <GeneratePageContent />
        </Suspense>
      </div>
    </div>
  );
}
