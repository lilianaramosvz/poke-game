import { Router } from "express";
import { db } from "../index.js";

const router = Router();

// Active SSE response objects
const sseClients = new Set();

// Firebase listener — broadcasts DB changes to all connected SSE clients
db.ref("pokemon/vida").on("value", (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    for (const client of sseClients) {
      client.write(payload);
    }
  }
});

// GET /api/pokemon/vida — recover initial state from DB
router.get("/vida", async (req, res) => {
  try {
    const snapshot = await db.ref("pokemon/vida").get();
    const vida = snapshot.val() || { player: 100, enemy: 100 };
    res.json(vida);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/pokemon/iniciar — reset health when a battle starts
router.post("/iniciar", async (req, res) => {
  try {
    await db.ref("pokemon/vida").set({ player: 100, enemy: 100 });
    res.status(201).json({ mensaje: "Batalla iniciada", vida: { player: 100, enemy: 100 } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/pokemon/vida — update health after an attack
// Body: { player?: number, enemy?: number }
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

// GET /api/pokemon/events — SSE stream; pushes DB changes in real time
router.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sseClients.add(res);

  // Send current state immediately so the client has something on connect
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
