'use server';
import admin from 'firebase-admin';

// Esta é a função central que garante que o Firebase Admin seja inicializado apenas uma vez.
function initializeAdminApp() {
  // Se já existirem apps inicializados, retorna o app padrão para evitar erros.
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    // Lança o erro apenas quando uma action que depende do admin é executada.
    // Isso evita que a aplicação inteira quebre na inicialização.
    throw new Error('A variável de ambiente FIREBASE_SERVICE_ACCOUNT_KEY não está definida.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    // Inicializa o app e o retorna.
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e: any) {
    console.error("Falha ao analisar a chave da conta de serviço do Firebase. Verifique se a variável de ambiente está correta.", e);
    throw new Error('A configuração do Firebase Admin falhou.');
  }
}

// Exporta a função para ser usada pelas Server Actions.
// E também exporta a instância do admin para acesso a tipos e outros utilitários.
export { initializeAdminApp };
export default admin;
