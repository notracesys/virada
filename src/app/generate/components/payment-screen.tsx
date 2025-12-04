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
        <Card className="w-full max-w-sm bg-card border shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl text-primary">Canal Seguro de Pagamento</CardTitle>
                <CardDescription>Sua transação é criptografada.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <div className="text-4xl font-bold text-foreground">R$ 9,99</div>
                <div className="text-sm text-muted-foreground">por Geração de Números</div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button 
                    onClick={onPay} 
                    disabled={isProcessing}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold"
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
