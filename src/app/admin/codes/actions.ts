'use server';

import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

function generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `MEGA-${result}`;
}

export async function createAccessCode(formData: FormData): Promise<{ success: boolean; code?: string; error?: string; }> {
    const email = formData.get('email') as string;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, error: 'Por favor, insira um e-mail válido.' };
    }

    try {
        const { firestore } = initializeFirebase();
        const newCode = generateRandomCode(8);
        const accessCodeRef = doc(firestore, 'access_codes', newCode);

        await setDoc(accessCodeRef, {
            email: email,
            isUsed: false,
            createdAt: serverTimestamp(),
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
