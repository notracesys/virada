'use client';

import { useState, useEffect } from 'react';
import ProcessingScreen from './components/processing-screen';
import ResultsScreen from './components/results-screen';
import { AnimatedBackground } from '@/components/animated-background';
import { Button } from '@/components/ui/button';

type Stage = 'initial' | 'processing' | 'results';

export default function GeneratePage() {
  const [stage, setStage] = useState<Stage>('initial');
  const [numbers, setNumbers] = useState<number[]>([]);

  const handleStart = () => {
    setStage('processing');
  };

  useEffect(() => {
    if (stage === 'processing') {
      const timer = setTimeout(() => {
        // Simulação de geração de números
        const randomNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 60) + 1);
        const uniqueNumbers = [...new Set(randomNumbers)];
        while (uniqueNumbers.length < 6) {
          uniqueNumbers.push(Math.floor(Math.random() * 60) + 1);
        }
        setNumbers(uniqueNumbers.sort((a, b) => a - b));
        setStage('results');
      }, 4000); // Simula o tempo de processamento

      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleReset = () => {
    setStage('initial');
    setNumbers([]);
  };

  const renderMainContent = () => {
    switch (stage) {
      case 'initial':
        return (
            <div className="text-center">
                <h1 className="text-2xl font-headline text-primary mb-4">Pronto para Gerar?</h1>
                <p className="text-muted-foreground mb-6">Clique no botão abaixo para iniciar a análise da IA.</p>
                <Button onClick={handleStart} size="lg">Iniciar Geração</Button>
            </div>
        )
      case 'processing':
        return <ProcessingScreen />;
      case 'results':
        return <ResultsScreen numbers={numbers} onReset={handleReset} />;
      default:
         return (
            <div className="text-center">
                <h1 className="text-2xl font-headline text-primary mb-4">Pronto para Gerar?</h1>
                <p className="text-muted-foreground mb-6">Clique no botão abaixo para iniciar a análise da IA.</p>
                <Button onClick={handleStart} size="lg">Iniciar Geração</Button>
            </div>
        )
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
      <AnimatedBackground />
      <div className="relative z-10 flex w-full flex-col items-center justify-center">
        {renderMainContent()}
      </div>
    </div>
  );
}
