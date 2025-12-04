'use server';

import { initializeFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// This is a server-side only file.

// Define the shape of the state object
export interface LoginState {
    success: boolean;
    message: string | null;
}

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'E-mail e senha são obrigatórios.' };
    }

    try {
        const { auth } = initializeFirebase();
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true, message: 'Login bem-sucedido!' };
    } catch (error: any) {
        let errorMessage = 'Falha na autenticação. Verifique suas credenciais.';
        // You can check for specific Firebase error codes if you want
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
        }
        return { success: false, message: errorMessage };
    }
}
