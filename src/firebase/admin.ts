'use server';

import admin from 'firebase-admin';

// Esta é a função central que garante que o Firebase Admin seja inicializado apenas uma vez.
function initializeAdminApp() {
  // Se já existirem apps inicializados, retorna o app padrão para evitar erros.
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Tenta obter as credenciais das variáveis de ambiente (método seguro para produção)
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Corrige quebras de linha
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

  // Verifica se as credenciais foram carregadas
  if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
    // Lança o erro apenas quando uma action que depende do admin é executada.
    throw new Error('As credenciais do Firebase Admin não estão configuradas nas variáveis de ambiente. O painel de Admin não funcionará em produção.');
  }

  try {
    // Inicializa o app e o retorna.
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e: any) {
    console.error("Falha ao inicializar o Firebase Admin. Verifique suas variáveis de ambiente.", e);
    throw new Error('A configuração do Firebase Admin falhou.');
  }
}

// Exporta a função para ser usada pelas Server Actions.
export { initializeAdminApp };
