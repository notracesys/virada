'use server';

import { generateMegaNumbers } from '@/ai/flows/generate-mega-numbers';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeAdminApp } from '@/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function verifyAccessCode(code: string): Promise<{ success: boolean; numbers?: number[]; error?: string; }> {
    if (!code) {
        return { success: false, error: "Nenhum código de acesso fornecido." };
    }

    try {
        initializeAdminApp();
        const firestore = getFirestore();
        const accessCodeRef = firestore.collection('access_codes').doc(code);

        const result = await firestore.runTransaction(async (transaction) => {
            const accessCodeDoc = await transaction.get(accessCodeRef);

            if (!accessCodeDoc.exists) {
                throw new Error("Código de acesso não encontrado ou inválido.");
            }

            const codeData = accessCodeDoc.data();

            if (codeData?.isUsed) {
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
                usedAt: Timestamp.now(),
            });

            return { success: true, numbers: finalNumbers };
        });

        return result;

    } catch (error: any) {
        console.error("Error verifying access code:", error);
        return { success: false, error: error.message || "Ocorreu um erro ao verificar o código." };
    }
}
