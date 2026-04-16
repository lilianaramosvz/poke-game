//backend\src\index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import batallasRouter from "./routes/batallas.js";
import storageRouter from "./routes/storage.js";
import vidaRouter from "./routes/vida.js";
import { db, bucket, auth } from "./firebase.js";

dotenv.config();

//  App
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "OPTIONS"],
  }),
);

app.use(cors());

app.use(express.json());

// Rutas
app.use("/api/batallas", batallasRouter);
app.use("/api/storage", storageRouter);
app.use("/api/vida", vidaRouter);

// ruta base
app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente");
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
