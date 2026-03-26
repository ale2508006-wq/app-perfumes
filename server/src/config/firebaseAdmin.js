const admin = require("firebase-admin");

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.error("Faltan variables de Firebase Admin en el .env");
  console.error("FIREBASE_PROJECT_ID:", projectId ? "OK" : "NO");
  console.error("FIREBASE_CLIENT_EMAIL:", clientEmail ? "OK" : "NO");
  console.error("FIREBASE_PRIVATE_KEY:", privateKey ? "OK" : "NO");
  throw new Error("Variables de Firebase Admin incompletas");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

module.exports = admin;