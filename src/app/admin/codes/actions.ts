'use server';

import { config } from 'dotenv';
import { initializeAdminApp } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

config(); // Carrega as variáveis de ambiente do .env

function generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `MEGA-${result}`;
}

export async function createAccessCode(prevState: any, formData: FormData): Promise<{ success: boolean; code?: string; error?: string; }> {
    const email = formData.get('email') as string;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, error: 'Por favor, insira um e-mail válido.' };
    }

    try {
        initializeAdminApp(); // Garante que o Admin SDK está pronto.
        const firestore = getFirestore();
        const newCode = generateRandomCode(8);
        const accessCodeRef = firestore.collection('access_codes').doc(newCode);

        await accessCodeRef.set({
            id: newCode,
            email: email,
            isUsed: false,
            createdAt: new Date(),
            generatedNumbers: null,
            usedAt: null,
        });
        
        revalidatePath('/admin/codes');
        return { success: true, code: newCode };
    } catch (error: any) {
        console.error("Error creating access code:", error);
        return { success: false, error: error.message || 'Falha ao criar o código de acesso.' };
    }
}
