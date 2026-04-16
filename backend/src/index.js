import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Rutas
import batallasRouter from "./routes/batallas.js";
import storageRouter from "./routes/storage.js";
import vidaRouter from "./routes/vida.js";

dotenv.config();

// --- FIX para __dirname en ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Cargar credenciales Firebase (FORMA ESTABLE) ---
const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../poke-game-bced1-firebase-adminsdk-fbsvc-95050ce7f6.json"),
    "utf-8"
  )
);

// --- Inicializar Firebase ---
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://poke-game-bced1-default-rtdb.firebaseio.com",
  storageBucket: "poke-game-bced1.firebasestorage.app",
});

// --- Exportaciones ---
export const db = admin.database();
export const bucket = admin.storage().bucket();
export const auth = admin;

// --- App Express ---
const app = express();

// 🔥 CORS CORRECTO (incluye preflight)
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "OPTIONS"],
}));

app.use(cors());

app.use(express.json());

// --- Rutas ---
app.use("/api/batallas", batallasRouter);
app.use("/api/storage", storageRouter);
app.use("/api/vida", vidaRouter);

// --- Ruta base ---
app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente");
});

// --- Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});