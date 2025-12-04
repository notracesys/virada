'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type ResultsScreenProps = {
    numbers: number[];
    onReset: () => void;
};

export default function ResultsScreen({ numbers, onReset }: ResultsScreenProps) {
    return (
        <Card className="w-full max-w-2xl bg-black/50 border-accent/50 text-center">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary">Sequência Exclusiva Gerada</CardTitle>
                <CardDescription>Utilize estes números para o seu jogo. Acesso único.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 my-8">
                    {numbers.map((num) => (
                        <div key={num} className="aspect-square flex items-center justify-center bg-accent/10 border-2 border-accent rounded-full">
                            <span className="text-3xl md:text-4xl font-bold text-shadow-neon-red text-primary">
                                {num.toString().padStart(2, '0')}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                 <Button onClick={onReset} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Gerar Outro Jogo (Pago)
                </Button>
                <p className="text-xs text-muted-foreground">Boa sorte. Não compartilhe seus números.</p>
            </CardFooter>
        </Card>
    );
}
