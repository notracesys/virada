import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Typewriter } from '@/components/typewriter';
import { AnimatedBackground } from '@/components/animated-background';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clover } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="mb-4">
          <Logo className="h-28 w-28 md:h-32 md:w-32" />
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary flex items-center justify-center gap-4" style={{ textShadow: '0 0 15px hsl(var(--accent))' }}>
          MEGA DA VIRADA
          <Clover className="w-10 h-10 md:w-12 md:h-12 text-accent" />
        </h1>
        <p className="mt-2 text-lg md:text-xl text-accent">
          Aumente Suas Chances com IA
        </p>
        <div className="mt-6 h-8 text-base md:text-lg text-primary">
          <Typewriter text="Números calculados com análise estatística + IA avançada." speed={50} />
        </div>
        <Button asChild size="lg" className="mt-12 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-sm font-bold px-6 py-4 md:text-lg md:px-8 md:py-6 shadow-[0_0_20px_theme(colors.accent)] hover:shadow-[0_0_30px_theme(colors.accent)] transition-all duration-300">
          <Link href="/generate">
            GERAR NÚMEROS DA VIRADA (ACESSO PAGO)
          </Link>
        </Button>
      </div>

      <div className="relative z-10 w-full bg-black py-10 md:py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <Card className="border-red-900/50 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center font-headline text-2xl md:text-3xl text-accent">
                // RELATÓRIO DE INTELIGÊNCIA CONFIDENCIAL //
              </CardTitle>
            </CardHeader>
            <CardContent className="text-primary text-base md:text-lg space-y-6">
              <p className="text-center">
                Nosso sistema não depende de sorte. Utilizamos um algoritmo preditivo proprietário que combina múltiplos vetores de dados para identificar padrões ocultos nos sorteios da Mega da Virada.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Análise Histórica Profunda</h3>
                    <p className="text-sm text-muted-foreground">Análise de todos os resultados para identificar dezenas "quentes" e "frias".</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Modelagem Probabilística</h3>
                    <p className="text-sm text-muted-foreground">Cálculos de probabilidade para combinações com maior potencial de sorteio.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Detecção de Padrões</h3>
                    <p className="text-sm text-muted-foreground">Uso de machine learning para encontrar padrões matemáticos e sequências.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">IA Preditiva</h3>
                    <p className="text-sm text-muted-foreground">Nossa IA simula milhões de sorteios para refinar as previsões e otimizar suas chances.</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-accent/80 font-bold pt-6 text-sm">
                Dados provenientes de algoritmo preditivo interno. Canal Confidencial – Apenas Membros.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
