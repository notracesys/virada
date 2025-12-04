'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import ProcessingScreen from './components/processing-screen';
import ResultsScreen from './components/results-screen';
import { AnimatedBackground } from '@/components/animated-background';
import AccessCodeScreen from './components/access-code-screen';

type Stage = 'access_code' | 'processing' | 'results' | 'error';

export default function GeneratePage() {
  const [stage, setStage] = useState<Stage>('access_code');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [error, setError] = useState('');

  const handleCodeSubmit = async (code: string) => {
    // Aqui você faria a chamada para verificar o código.
    // Por enquanto, vamos simular que qualquer código é válido.
    if (code) {
      setStage('processing');
    } else {
      setError('Por favor, insira um código de acesso.');
    }
  };

  useEffect(() => {
    if (stage === 'processing') {
      const timer = setTimeout(() => {
        const randomNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 60) + 1);
        const uniqueNumbers = [...new Set(randomNumbers)];
        while (uniqueNumbers.length < 6) {
          uniqueNumbers.push(Math.floor(Math.random() * 60) + 1);
        }
        setNumbers(uniqueNumbers.sort((a, b) => a - b));
        setStage('results');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleReset = () => {
    setStage('access_code');
    setNumbers([]);
    setError('');
  };

  const renderMainContent = () => {
    switch (stage) {
      case 'access_code':
        return <AccessCodeScreen onSubmit={handleCodeSubmit} error={error} />;
      case 'processing':
        return <ProcessingScreen />;
      case 'results':
        return <ResultsScreen numbers={numbers} onReset={handleReset} />;
      default:
        return <AccessCodeScreen onSubmit={handleCodeSubmit} error={error} />;
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
