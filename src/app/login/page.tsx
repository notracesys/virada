'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedBackground } from "@/components/animated-background";
import { Logo } from "@/components/logo";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // Efeito para redirecionar se o usuário já estiver logado
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('E-mail e senha são obrigatórios.');
      return;
    }

    startTransition(async () => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Sucesso!',
          description: 'Login realizado com sucesso.',
        });
        router.push('/admin');
      } catch (err: any) {
        let errorMessage = 'Falha na autenticação. Verifique suas credenciais.';
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
        }
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Erro de Autenticação',
          description: errorMessage,
        });
      }
    });
  };
  
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-background">
      <AnimatedBackground />
      <Card className="w-full max-w-sm z-10 bg-card border">
        <CardHeader className="text-center space-y-4">
          <Logo className="w-20 h-20 mx-auto" />
          <CardTitle className="font-headline text-2xl text-primary">Acesso Restrito</CardTitle>
          <CardDescription>Painel Administrativo - Apenas para autorizados.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <fieldset disabled={isUserLoading || isPending} className="group">
            <CardContent className="space-y-4">
               {error && (
                  <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro de Autenticação</AlertTitle>
                      <AlertDescription>
                          {error}
                      </AlertDescription>
                  </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail de Acesso</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="user@email.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Chave de Segurança</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="************" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isUserLoading || isPending}>
                {isPending ? 'Autenticando...' : 'Autenticar'}
              </Button>
            </CardFooter>
          </fieldset>
        </form>
      </Card>
    </div>
  );
}
