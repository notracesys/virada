'use client';

import { useState, useEffect } from 'react';
import ProcessingScreen from './components/processing-screen';
import ResultsScreen from './components/results-screen';
import { AnimatedBackground } from '@/components/animated-background';

type Stage = 'processing' | 'results';

export default function GeneratePage() {
  const [stage, setStage] = useState<Stage>('processing');
  // Números de exemplo para exibir quando o processamento terminar
  const [numbers, setNumbers] = useState<number[]>([]);

  useEffect(() => {
    // Simula um processo de geração
    const timer = setTimeout(() => {
      // Gera 6 números aleatórios entre 1 e 60
      const randomNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 60) + 1);
      // Garante que são únicos
      const uniqueNumbers = [...new Set(randomNumbers)];
      while(uniqueNumbers.length < 6) {
        uniqueNumbers.push(Math.floor(Math.random() * 60) + 1);
      }
      
      setNumbers(uniqueNumbers.sort((a, b) => a - b));
      setStage('results');
    }, 4000); // 4 segundos para a animação de processamento

    return () => clearTimeout(timer);
  }, []);

  const handleReset = () => {
    // Recarrega a página para simular uma nova geração
     window.location.reload();
  }

  const renderMainContent = () => {
    switch (stage) {
      case 'processing':
        return <ProcessingScreen />;
      case 'results':
        return <ResultsScreen numbers={numbers} onReset={handleReset} />;
      default:
        return <ProcessingScreen />;
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
