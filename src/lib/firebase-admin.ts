
import admin from "firebase-admin";


if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID || "vitacare-v3",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };


    if (!serviceAccount.clientEmail || !serviceAccount.privateKey) {
      throw new Error(
        "Missing Firebase Admin credentials in environment variables"
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.projectId,
      storageBucket: `${serviceAccount.projectId}.firebasestorage.app`,
    });

    console.log("✅ Firebase Admin initialized successfully");
  } catch (error) {
    console.error("❌ Firebase Admin initialization failed:", error);
    throw error;
  }
}


export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
export const adminFirestore = admin.firestore();

export default admin;
