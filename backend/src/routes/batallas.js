//backend\src\routes\batallas.js
import { Router } from "express";
import { db } from "../index.js";

const router = Router();

// GET obtener todas las batallas
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.ref("batallas").get();
    res.json(snapshot.val() || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST guardar batalla
router.post("/", async (req, res) => {
  try {
    const { jugador, enemigo, ganador, fecha } = req.body;

    const nuevaBatalla = {
      jugador,
      enemigo,
      ganador,
      fecha: fecha || new Date().toISOString(),
    };

    const ref = db.ref("batallas").push();
    await ref.set(nuevaBatalla);

    res
      .status(201)
      .json({ mensaje: "Batalla guardada con éxito", id: ref.key });
  } catch (error) {
    res.status(500).json({ error: "No se pudo guardar la batalla" });
  }
});

export default router;
