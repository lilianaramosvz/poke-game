// backend\src\routes\vida.js
import { Router } from "express";
import { db } from "../firebase.js";

const router = Router();
const clients = new Set();

db.ref("batalla_actual").on("value", (snapshot) => {
  const data = snapshot.val();
  const payload = `data: ${JSON.stringify(data)}\n\n`;

  for (const client of clients) {
    try {
      client.write(payload);
    } catch {
      clients.delete(client);
    }
  }
});

router.post("/iniciar", async (req, res) => {
  const { jugador, enemigo } = req.body;

  const estado = {
    jugador,
    enemigo,
    vidaJugador: 100,
    vidaEnemigo: 100,
  };

  await db.ref("batalla_actual").set(estado);
  res.json(estado);
});

router.post("/atacar", async (req, res) => {
  const { atacante, dano } = req.body;

  const ref = db.ref("batalla_actual");

  await ref.transaction((estado) => {
    if (!estado) return estado;

    if (estado.vidaJugador === 0 || estado.vidaEnemigo === 0) {
      return estado;
    }

    if (atacante === "jugador") {
      estado.vidaEnemigo = Math.max(0, estado.vidaEnemigo - dano);
    } else {
      estado.vidaJugador = Math.max(0, estado.vidaJugador - dano);
    }

    return estado;
  });

  res.json({ ok: true });
});

router.get("/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  clients.add(res);

  const snapshot = await db.ref("batalla_actual").get();
  res.write(`data: ${JSON.stringify(snapshot.val())}\n\n`);

  req.on("close", () => {
    clients.delete(res);
  });
});

export default router;
