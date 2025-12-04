'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type ResultsScreenProps = {
    numbers: number[];
    onReset: () => void;
};

export default function ResultsScreen({ numbers, onReset }: ResultsScreenProps) {
    const gridColsClass = numbers.length > 12 ? 'md:grid-cols-8' : 'md:grid-cols-6';

    return (
        <Card className="w-full max-w-4xl bg-card border text-center">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary">Sequência Exclusiva Gerada</CardTitle>
                <CardDescription>Utilize estes números para o seu jogo. Acesso único.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className={`grid grid-cols-4 sm:grid-cols-5 ${gridColsClass} gap-2 md:gap-4 my-8`}>
                    {numbers.map((num) => (
                        <div key={num} className="aspect-square flex items-center justify-center bg-primary/10 border-2 border-primary rounded-full">
                            <span className="text-2xl md:text-3xl font-bold text-foreground">
                                {num.toString().padStart(2, '0')}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                 <Button onClick={onReset} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Gerar Outro Jogo (Pago)
                </Button>
                <p className="text-xs text-muted-foreground">Boa sorte. Não compartilhe seus números.</p>
            </CardFooter>
        </Card>
    );
}
