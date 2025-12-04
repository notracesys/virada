'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type AccessCodeScreenProps = {
    onVerify: (accessCode: string) => void;
    isProcessing: boolean;
};

export default function AccessCodeScreen({ onVerify, isProcessing }: AccessCodeScreenProps) {
    const [accessCode, setAccessCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessCode.trim()) {
            onVerify(accessCode.trim());
        }
    };

    return (
        <Card className="w-full max-w-sm z-10 bg-card border shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl text-primary">Revelar Meus Números</CardTitle>
                <CardDescription>Insira o código que você recebeu por e-mail após a compra.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="access-code" className="sr-only">Código de Acesso</Label>
                        <Input
                            id="access-code"
                            type="text"
                            placeholder="Seu código de acesso..."
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            disabled={isProcessing}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button
                        type="submit"
                        disabled={isProcessing || !accessCode.trim()}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold"
                        size="lg"
                    >
                        {isProcessing ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <KeyRound className="mr-2 h-5 w-5" />
                        )}
                        VERIFICAR E REVELAR
                    </Button>
                     <Button asChild variant="link" className="text-muted-foreground">
                        <Link href="/">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Ainda não tenho um código
                        </Link>
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
