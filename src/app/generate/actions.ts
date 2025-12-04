'use server';

import { generateMegaNumbers } from '@/ai/flows/generate-mega-numbers';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, runTransaction } from 'firebase/firestore';

export async function verifyAccessCode(code: string): Promise<{ success: boolean; numbers?: number[]; error?: string; }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!code) {
        return { success: false, error: "Nenhum código de acesso fornecido." };
    }

    try {
        const { firestore } = initializeFirebase();
        const accessCodeRef = doc(firestore, 'access_codes', code);

        // Use a transaction to ensure atomicity (check and update in one operation)
        const result = await runTransaction(firestore, async (transaction) => {
            const accessCodeDoc = await transaction.get(accessCodeRef);

            if (!accessCodeDoc.exists()) {
                throw new Error("Código de acesso não encontrado ou inválido.");
            }

            const codeData = accessCodeDoc.data();

            if (codeData.isUsed) {
                throw new Error("Este código de acesso já foi utilizado.");
            }

            // Code is valid and unused, now generate numbers
            const generationResult = await generateMegaNumbers({ userId: 'user-accessing-now', numberOfNumbers: 6 });
            
            if (!generationResult || !generationResult.numbers || generationResult.numbers.length === 0) {
                throw new Error("A IA não conseguiu gerar os números. Tente novamente.");
            }

            const finalNumbers = generationResult.numbers.sort((a, b) => a - b);

            // Mark the code as used and save the generated numbers
            transaction.update(accessCodeRef, {
                isUsed: true,
                generatedNumbers: finalNumbers,
                usedAt: new Date().toISOString(),
            });

            return { success: true, numbers: finalNumbers };
        });

        return result;

    } catch (error: any) {
        console.error("Error verifying access code:", error);
        return { success: false, error: error.message || "Ocorreu um erro ao verificar o código." };
    }
}
