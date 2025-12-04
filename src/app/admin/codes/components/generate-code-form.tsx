'use client';

import { createAccessCode } from '../actions';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy } from 'lucide-react';

const initialState = {
  code: undefined,
  error: undefined,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Gerando...' : 'Gerar Código'}
    </Button>
  );
}

export function GenerateCodeForm() {
  const [state, formAction] = useFormState(createAccessCode, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Código Gerado!',
        description: `O código ${state.code} foi criado com sucesso.`,
      });
      formRef.current?.reset();
    }
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: state.error,
      });
    }
  }, [state, toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copiado!",
        description: "O código foi copiado para a área de transferência."
    })
  };

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail do Cliente</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="cliente@email.com"
          required
        />
      </div>
      <SubmitButton />
      {state.success && state.code && (
        <Alert>
          <AlertTitle className="flex items-center justify-between">
            Código Gerado
             <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => copyToClipboard(state.code!)}
              >
                <Copy className="h-4 w-4" />
              </Button>
          </AlertTitle>
          <AlertDescription>
            Envie este código para o cliente:
            <pre className="mt-2 rounded-md bg-muted p-2 font-mono text-sm">
              {state.code}
            </pre>
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}
