'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2 } from "lucide-react";

type PaymentScreenProps = {
    onPay: () => void;
    isProcessing: boolean;
};

export default function PaymentScreen({ onPay, isProcessing }: PaymentScreenProps) {
    return (
        <Card className="w-full max-w-sm bg-black/50 border-2 border-green-500/50 shadow-[0_0_20px_rgba(0,255,0,0.3)]">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl text-green-400">Canal Seguro de Pagamento</CardTitle>
                <CardDescription className="text-green-400/70">Sua transação é criptografada.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary">R$ 9,99</div>
                <div className="text-sm text-muted-foreground">por Geração de Números</div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button 
                    onClick={onPay} 
                    disabled={isProcessing}
                    className="w-full bg-green-500 text-black hover:bg-green-400 text-lg font-bold"
                    size="lg"
                >
                    {isProcessing ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <ShieldCheck className="mr-2 h-5 w-5" />
                    )}
                    PAGAR E GERAR NÚMEROS
                </Button>
                <p className="text-xs text-muted-foreground">ACESSO RESTRITO</p>
            </CardFooter>
        </Card>
    );
}
