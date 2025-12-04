'use client';

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

const steps = [
    "Validando solicitação...",
    "Acesso autorizado...",
    "Conectando ao banco de dados da loteria...",
    "Analisando resultados históricos...",
    "Executando algoritmo preditivo...",
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
        <div className="w-full max-w-lg text-center p-4 rounded-lg bg-card border">
            <h2 className="text-2xl font-headline text-primary mb-4">Analisando...</h2>
            <div className="font-mono text-foreground text-left space-y-2">
                {steps.slice(0, currentStep + 1).map((step, index) => (
                    <p key={index} className={index === currentStep ? "text-primary" : "text-muted-foreground"}>
                        <span className="text-accent">&gt; </span>{step}
                    </p>
                ))}
            </div>
            <Progress value={progress} className="mt-6 h-2 bg-secondary" />
            <p className="text-sm text-muted-foreground mt-2">Aguarde um momento...</p>
        </div>
    );
}
