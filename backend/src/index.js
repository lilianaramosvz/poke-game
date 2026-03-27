import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { readFile } from "fs/promises";

dotenv.config();

// Cargar credenciales — ruta corregida
const serviceAccount = JSON.parse(
  await readFile(
    new URL("../poke-game-bced1-firebase-adminsdk-fbsvc-95050ce7f6.json", import.meta.url)
  )
);

// Inicializar Firebase con Realtime Database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://poke-game-bced1-default-rtdb.firebaseio.com",
  storageBucket: "poke-game-bced1.firebasestorage.app"
});

export const db = admin.database();     // Realtime Database
export const bucket = admin.storage().bucket(); // Storage
export const auth = admin;              // Para verificar tokens

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Rutas
import batallasRouter from "./routes/batallas.js";
import storageRouter from "./routes/storage.js";

app.use("/api/batallas", batallasRouter);
app.use("/api/storage", storageRouter);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});