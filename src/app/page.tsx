'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Typewriter } from '@/components/typewriter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const fakeSales = [
  'Maria S. (SP)',
  'João P. (RJ)',
  'Ana C. (MG)',
  'Carlos A. (BA)',
  'Fernanda L. (RS)',
  'Lucas M. (PR)',
  'Juliana R. (CE)',
  'Rafael G. (PE)',
  'Patrícia F. (DF)',
  'Bruno T. (ES)',
];

export default function Home() {
  const { toast } = useToast();

  useEffect(() => {
    const showRandomToast = () => {
      const randomSale = fakeSales[Math.floor(Math.random() * fakeSales.length)];
      const randomDelay = Math.random() * (15000 - 7000) + 7000; // Between 7-15 seconds

      setTimeout(() => {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className='flex flex-col'>
                <span className="font-bold text-white text-xs">Geração Concluída!</span>
                <span className="text-gray-300 text-[10px]">{`${randomSale} acabou de gerar seus números.`}</span>
              </div>
            </div>
          ),
        });
        showRandomToast(); // Schedule the next one
      }, randomDelay);
    };

    // Start the loop
    const firstTimeout = setTimeout(showRandomToast, 5000); // First toast after 5 seconds

    return () => {
      clearTimeout(firstTimeout);
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="mb-4">
          <Logo className="h-28 w-28 md:h-32 md:w-32" />
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary flex items-center justify-center gap-4">
          MEGA DA VIRADA
        </h1>
        <p className="mt-2 text-lg md:text-xl text-primary">
          Aumente Suas Chances com IA
        </p>
        <div className="mt-6 h-8 text-base md:text-lg text-muted-foreground">
          <Typewriter text="Sugestões de números com base em análise estatística e IA." speed={50} />
        </div>
        <Button asChild size="lg" className="mt-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-base md:text-lg font-bold px-8 md:px-10 py-4 md:py-6 shadow-lg transition-all duration-300">
          <Link href="/generate">
            GERAR NÚMEROS (ACESSO PAGO)
          </Link>
        </Button>
      </div>

      <div className="relative z-10 w-full bg-secondary py-10 md:py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <Card className="bg-background">
            <CardHeader>
              <CardTitle className="text-center font-headline text-2xl md:text-3xl text-primary">
                // RELATÓRIO DE INTELIGÊNCIA CONFIDENCIAL //
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground text-base md:text-lg space-y-6">
              <p className="text-center">
                Nosso sistema não depende apenas de sorte. Utilizamos um algoritmo que combina múltiplos vetores de dados para identificar padrões e probabilidades nos sorteios da Mega da Virada.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Análise Histórica Profunda</h3>
                    <p className="text-sm text-muted-foreground">Análise de todos os resultados para identificar dezenas com maior e menor frequência.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Modelagem Probabilística</h3>
                    <p className="text-sm text-muted-foreground">Cálculos de probabilidade para combinações com maior potencial estatístico.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Detecção de Padrões</h3>
                    <p className="text-sm text-muted-foreground">Uso de machine learning para encontrar padrões matemáticos e sequências recorrentes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">IA Preditiva</h3>
                    <p className="text-sm text-muted-foreground">Nossa IA simula milhões de sorteios para refinar as sugestões e otimizar suas chances.</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-primary/80 font-bold pt-6 text-sm">
                Dados provenientes de algoritmo preditivo interno. Canal Confidencial – Apenas Membros.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
