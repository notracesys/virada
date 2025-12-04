import admin from 'firebase-admin';

// Garante que a inicialização não ocorra múltiplas vezes
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (e: any) {
    console.error("Firebase Admin SDK initialization error:", e.stack);
  }
}

const initializeAdminApp = () => {
  if (!admin.apps.length) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin SDK initialized successfully (on-demand).");
    } catch (e: any) {
      console.error("Firebase Admin SDK on-demand initialization error:", e.stack);
    }
  }
};


export { admin, initializeAdminApp };
