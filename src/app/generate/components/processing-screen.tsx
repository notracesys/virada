'use client';

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

const steps = [
    "Validando solicitação...",
    "Acesso autorizado. Bypassing firewall...",
    "Conectando ao banco de dados secreto...",
    "Analisando 1.2TB de resultados históricos...",
    "Executando algoritmo preditivo v3.4...",
    "Calculando dezenas de alta probabilidade...",
    "Geração concluída."
];

export default function ProcessingScreen() {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 60);

        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= steps.length - 1) {
                    clearInterval(stepInterval);
                    return steps.length - 1;
                }
                return prev + 1;
            });
        }, 450);


        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
        };
    }, []);

    return (
        <div className="w-full max-w-lg text-center p-4 rounded-lg bg-black/50 border border-accent/50">
            <h2 className="text-2xl font-headline text-accent mb-4">Analisando...</h2>
            <div className="font-mono text-primary text-left space-y-2">
                {steps.slice(0, currentStep + 1).map((step, index) => (
                    <p key={index} className={index === currentStep ? "text-accent" : "text-primary/70"}>
                        <span className="text-green-500">&gt; </span>{step}
                    </p>
                ))}
            </div>
            <Progress value={progress} className="mt-6 h-2 bg-red-900/50 [&>div]:bg-accent" />
            <p className="text-sm text-muted-foreground mt-2">Hackeando o sistema...</p>
        </div>
    );
}
