'use client';

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

const steps = [
    "Solicitação recebida...",
    "Validando código de acesso...",
    "Conectando ao banco de dados quântico...",
    "Analisando resultados históricos da Mega...",
    "Executando algoritmo preditivo v2.7...",
    "Calculando dezenas de alta probabilidade...",
    "Cruzando dados com padrões astrológicos...",
    "Geração concluída. Boa sorte!"
];

export default function ProcessingScreen() {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => Math.min(prev + 1, 100));
        }, 30);

        const stepInterval = setInterval(() => {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        }, 375); // 3000ms / 8 steps

        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
        };
    }, []);

    return (
        <div className="w-full max-w-lg text-center p-8 rounded-lg bg-card border shadow-2xl">
            <Logo className="w-24 h-24 mx-auto animate-pulse" />
            <h2 className="text-2xl font-headline text-primary mt-6 mb-4">Analisando Milhões de Possibilidades...</h2>
            <div className="font-code text-foreground text-left text-sm space-y-2 h-48 overflow-hidden">
                 {steps.slice(0, currentStep + 1).map((step, index) => (
                    <p key={index} className={index === currentStep ? "text-primary font-bold" : "text-muted-foreground"}>
                        <span className="text-accent">&gt; </span>{step}
                    </p>
                ))}
            </div>
            <Progress value={progress} className="mt-6 h-2 bg-secondary" />
            <p className="text-sm text-muted-foreground mt-2 font-code">Aguarde, a sorte está sendo calculada...</p>
        </div>
    );
}
