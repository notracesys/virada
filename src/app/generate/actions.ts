'use server';

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// --- INICIALIZAÇÃO DO FIREBASE ADMIN SDK ---
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

if (!getApps().length) {
  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Em um ambiente de produção, você pode querer lançar um erro
    console.error('ERRO: Credenciais do Firebase não encontradas. As Server Actions que dependem do Firebase não funcionarão.');
  }
}

const db = getFirestore();

export async function getNumbersByAccessCodeAction(accessCode: string): Promise<{ numbers?: number[]; error?: string }> {
  if (!serviceAccount) {
    return { error: 'O servidor não está configurado corretamente para acessar o banco de dados.' };
  }
  
  if (!accessCode || accessCode.trim().length === 0) {
    return { error: 'O código de acesso não pode estar em branco.' };
  }

  try {
    const generationRef = db.collection('generations').doc(accessCode);
    const doc = await generationRef.get();

    if (!doc.exists) {
      return { error: 'Código de acesso inválido ou não encontrado.' };
    }

    const data = doc.data();

    if (!data) {
        return { error: 'Não foi possível ler os dados para este código.' };
    }

    if (data.used) {
      // Opcional: se você quiser permitir que eles vejam os números várias vezes,
      // apenas retorne os números. Se for para uso único, mantenha o erro.
      return { error: 'Este código de acesso já foi utilizado.' };
    }

    // Marca o código como usado para prevenir reutilização
    // Comente a linha abaixo se quiser permitir múltiplas visualizações
    await generationRef.update({ used: true });

    return { numbers: data.numbers };

  } catch (error) {
    console.error('Erro ao verificar o código de acesso:', error);
    return { error: 'Ocorreu um erro no servidor ao verificar seu código. Tente novamente.' };
  }
}
