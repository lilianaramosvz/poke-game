//backend\src\routes\pokemon.js
import { Router } from "express";
import { db } from "../index.js";

const router = Router();

// Activar SSE respuesta a los objetos que se conecten
const sseClients = new Set();

const onVidaChange = (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(payload);
      } catch {
        sseClients.delete(client);
      }
    }
  }
};

db.ref("pokemon/vida").on("value", onVidaChange);

// GET
router.get("/vida", async (req, res) => {
  try {
    const snapshot = await db.ref("pokemon/vida").get();
    const vida = snapshot.val() || { player: 100, enemy: 100 };
    res.json(vida);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST
router.post("/iniciar", async (req, res) => {
  try {
    await db.ref("pokemon/vida").set({ player: 100, enemy: 100 });
    res
      .status(201)
      .json({ mensaje: "Batalla iniciada", vida: { player: 100, enemy: 100 } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH
router.patch("/vida", async (req, res) => {
  try {
    const { player, enemy } = req.body;

    const snapshot = await db.ref("pokemon/vida").get();
    const current = snapshot.val() || { player: 100, enemy: 100 };

    const updated = { ...current };
    if (player !== undefined) updated.player = Math.max(0, player);
    if (enemy !== undefined) updated.enemy = Math.max(0, enemy);

    await db.ref("pokemon/vida").set(updated);
    res.json({ mensaje: "Vida actualizada", vida: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET
router.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sseClients.add(res);

  db.ref("pokemon/vida")
    .get()
    .then((snapshot) => {
      const data = snapshot.val() || { player: 100, enemy: 100 };
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    })
    .catch(console.error);

  req.on("close", () => {
    sseClients.delete(res);
  });
});

export default router;
