import admin from 'firebase-admin';

// Garante que a inicialização não ocorra múltiplas vezes
if (!admin.apps.length) {
  try {
    // Esta variável de ambiente precisa ser configurada no seu ambiente de hospedagem (Vercel, Firebase Hosting, etc.)
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (e: any) {
    console.error("Firebase Admin SDK initialization error:", e.stack);
  }
}

// A função initializeAdminApp é agora um getter que apenas garante que a inicialização ocorreu.
const initializeAdminApp = () => {
    if (!admin.apps.length) {
        throw new Error("Firebase Admin SDK not initialized.");
    }
    return admin;
};

export { admin, initializeAdminApp };
