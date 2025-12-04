'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Lock, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const numbers = Array.from({ length: 60 }, (_, i) => i + 1);
const selectedNumbers = [4, 12, 23, 33, 41, 58, 7, 19, 28, 45, 50, 5, 15, 25, 35];

function LockedLotteryCard() {
  return (
    <div className="relative transform -rotate-2">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-md mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-green-700">MEGA DA VIRADA</h2>
        </div>
        <div className="grid grid-cols-10 gap-1 sm:gap-2">
          {numbers.map((number) => (
            <div
              key={number}
              className={cn(
                'aspect-square flex items-center justify-center rounded-full text-gray-400 font-bold text-sm sm:text-base transition-all duration-300',
                selectedNumbers.includes(number) 
                  ? 'bg-green-700 border-2 border-green-800 text-white' 
                  : 'bg-gray-50 border-2 border-gray-200'
              )}
            >
              {selectedNumbers.includes(number) ? '?' : number.toString().padStart(2, '0')}
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-center text-gray-400">
          Seus números secretos estão aqui.
        </div>
      </div>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-2xl">
        <Lock className="w-24 h-24 text-white/50 animate-pulse" />
      </div>
    </div>
  );
}

export default function PricingPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [accessCode, setAccessCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessCode.trim()) {
            toast({
                variant: "destructive",
                title: "Código Inválido",
                description: "Por favor, insira um código de acesso.",
            });
            return;
        }
        router.push(`/generate?code=${accessCode}`);
    };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-green-600 via-green-800 to-gray-900 text-white">
      <div className="absolute top-4 left-4 z-20">
        <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 pt-16 md:pt-4 text-center">
        
        <header className="mb-8 animate-fade-in-down pt-16 md:pt-0">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">
            Acesso aos Números da Virada
          </h1>
          <p className="mt-4 text-3xl md:text-4xl font-bold text-yellow-300 tracking-wider">
            R$ 14,90
          </p>
          <p className="text-sm text-green-200">Apenas uma única liberação por jogo.</p>
        </header>

        <div className="my-8">
          <LockedLotteryCard />
        </div>

        <div className="space-y-2 text-green-100 mb-8">
            <p>Conteúdo bloqueado</p>
            <p className="font-bold">Libere para ver os números reais</p>
            <p className="text-sm text-green-300">Acesso imediato após pagamento</p>
        </div>
        
        <form onSubmit={handleVerifyCode} className="w-full max-w-sm space-y-4 mb-4">
            <div className="space-y-2 text-left">
                <Label htmlFor="access-code" className="text-green-200">Já tem um código?</Label>
                <div className="flex gap-2">
                    <Input 
                        id="access-code" 
                        placeholder="Insira seu código de acesso" 
                        className="bg-white/10 border-green-400/50 text-white placeholder:text-green-200/70 focus:ring-yellow-400"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" variant="secondary" disabled={isLoading}>
                        {isLoading ? 'Verificando...' : 'Verificar'}
                    </Button>
                </div>
            </div>
        </form>

        <p className="text-green-200 text-sm mb-4">Caso não tenha um código, clique no botão abaixo para garantir o seu.</p>
        
        <Button asChild size="lg" className="relative overflow-hidden bg-yellow-400 text-green-900 font-bold hover:bg-yellow-300 rounded-full text-lg px-10 py-6 shadow-lg transition-all duration-300">
          <Link href="https://pay.kirvano.com/CHECKOUT_URL">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full animate-shine" />
            LIBERAR ACESSO
          </Link>
        </Button>

        <div className="text-center space-y-2 max-w-sm text-green-200 mt-8">
            <p>✓ Resultados gerados pela nossa IA estatística</p>
            <p>✓ Números exclusivos que não aparecem gratuitamente</p>
            <p>✓ Libere o acesso imediato</p>
        </div>
      </div>
    </div>
  );
}
