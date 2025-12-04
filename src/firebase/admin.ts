'use server';
import admin from 'firebase-admin';

// Esta é a função central que garante que o Firebase Admin seja inicializado apenas uma vez.
function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error('A variável de ambiente FIREBASE_SERVICE_ACCOUNT_KEY não está definida.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e: any) {
    console.error("Falha ao analisar a chave da conta de serviço do Firebase. Verifique se a variável de ambiente está correta.", e);
    throw new Error('A configuração do Firebase Admin falhou.');
  }
}

// Inicializa o app assim que este módulo é carregado no servidor.
initializeAdminApp();

// Exporta a instância admin do SDK para ser usada em outras partes do servidor.
export default admin;
