'use server';

import { generateMegaNumbers } from '@/ai/flows/generate-mega-numbers';

// This is a placeholder for your server-side actions.
// We simulate code verification and then call the AI to generate numbers.

const MASTER_ACCESS_CODE = "MEGASORTE";

export async function verifyAccessCode(code: string): Promise<{ success: boolean; numbers?: number[]; error?: string; }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (code.toUpperCase() !== MASTER_ACCESS_CODE) {
        return { success: false, error: "Código de acesso não encontrado ou inválido." };
    }

    try {
        // Now, instead of fetching pre-generated numbers, we call the AI to generate them on the fly.
        // We'll request 6 numbers by default.
        const result = await generateMegaNumbers({ userId: 'user-accessing-now', numberOfNumbers: 6 });
        
        if (!result || !result.numbers || result.numbers.length === 0) {
            return { success: false, error: "A IA não conseguiu gerar os números. Tente novamente." };
        }

        return { success: true, numbers: result.numbers.sort((a, b) => a - b) };

    } catch (error) {
        console.error("Error calling generateMegaNumbers AI flow:", error);
        return { success: false, error: "Ocorreu um erro ao contatar a IA para gerar seus números." };
    }
}
