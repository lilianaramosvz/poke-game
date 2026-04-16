import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../poke-game-bced1-firebase-adminsdk-fbsvc-95050ce7f6.json"),
    "utf-8"
  )
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://poke-game-bced1-default-rtdb.firebaseio.com",
    storageBucket: "poke-game-bced1.firebasestorage.app",
  });
}

export const db = admin.database();
export const bucket = admin.storage().bucket();
export const auth = admin;