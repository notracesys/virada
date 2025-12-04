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
    };
    
    const intervalId = setInterval(showRandomToast, 10000);

    return () => clearInterval(intervalId);
  }, [toast]);


  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-foreground">
      
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
          <Link href="/pricing">
            QUERO GERAR MEUS NÚMEROS
          </Link>
        </Button>

        <div className="mt-16 max-w-3xl text-center text-sm text-muted-foreground px-4">
          <h3 className="font-bold text-base text-foreground mb-2">Aviso Importante</h3>
          <p>
            Os números que você obterá em nosso sistema não são uma garantia de premiação. Eles são sugestões geradas com base em resoluções matemáticas, raciocínio lógico e um profundo estudo estatístico sobre todos os resultados históricos da Mega-Sena, realizado por especialistas. Nosso objetivo é aumentar suas probabilidades, não garantir o resultado. Jogue com responsabilidade.
          </p>
        </div>
      </div>
    </div>
  );
}
