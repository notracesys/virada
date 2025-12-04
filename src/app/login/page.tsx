'use client';

import { useActionState, useFormStatus } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, type LoginState } from './actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedBackground } from "@/components/animated-background";
import { Logo } from "@/components/logo";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useUser } from '@/firebase';

const initialState: LoginState = {
  success: false,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={pending}>
      {pending ? 'Autenticando...' : 'Autenticar'}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(login, initialState);
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If user is already logged in, redirect them to the admin dashboard
    if (!isUserLoading && user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);
  
  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Sucesso!',
        description: state.message || 'Login realizado com sucesso.',
      });
      // Redirect to admin dashboard on successful login
      router.push('/admin');
    }
  }, [state, router, toast]);
  
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-background">
      <AnimatedBackground />
      <Card className="w-full max-w-sm z-10 bg-card border">
        <CardHeader className="text-center space-y-4">
          <Logo className="w-20 h-20 mx-auto" />
          <CardTitle className="font-headline text-2xl text-primary">Acesso Restrito</CardTitle>
          <CardDescription>Painel Administrativo - Apenas para autorizados.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <fieldset disabled={isUserLoading} className="group">
            <CardContent className="space-y-4">
               {state.message && !state.success && (
                  <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro de Autenticação</AlertTitle>
                      <AlertDescription>
                          {state.message}
                      </AlertDescription>
                  </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail de Acesso</Label>
                <Input id="email" name="email" type="email" placeholder="user@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Chave de Segurança</Label>
                <Input id="password" name="password" type="password" placeholder="************" required />
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </fieldset>
        </form>
      </Card>
    </div>
  );
}
