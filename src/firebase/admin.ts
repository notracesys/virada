import admin from 'firebase-admin';
import { serviceAccount } from './service-account';

// Esta é a função central que garante que o Firebase Admin seja inicializado apenas uma vez.
function initializeAdminApp() {
  // Se já existirem apps inicializados, retorna o app padrão para evitar erros.
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Verifica se a conta de serviço foi preenchida
  if (!serviceAccount || !serviceAccount.project_id) {
    // Lança o erro apenas quando uma action que depende do admin é executada.
    throw new Error('A conta de serviço do Firebase não está configurada em src/firebase/service-account.ts. Verifique o arquivo.');
  }

  try {
    // Inicializa o app e o retorna.
    return admin.initializeApp({
      // @ts-ignore
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e: any) {
    console.error("Falha ao inicializar o Firebase Admin. Verifique o arquivo src/firebase/service-account.ts", e);
    throw new Error('A configuração do Firebase Admin falhou.');
  }
}

// Exporta a função para ser usada pelas Server Actions.
export { initializeAdminApp };
