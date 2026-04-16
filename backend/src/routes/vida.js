// backend\src\routes\vida.js
import { Router } from "express";
import { db } from "../index.js";

const router = Router();

// actualizar vida
router.put("/", async (req, res) => {
  const { vidaJugador, vidaEnemigo } = req.body;

  if (vidaJugador == null || vidaEnemigo == null) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  await db.ref("batalla_actual").set({ vidaJugador, vidaEnemigo });

  res.json({ ok: true });
});

// SSE stream
router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const ref = db.ref("batalla_actual");

  const listener = ref.on("value", (snapshot) => {
    res.write(`data: ${JSON.stringify(snapshot.val())}\n\n`);
  });

  req.on("close", () => {
    ref.off("value", listener);
    res.end();
  });
});

export default router;
