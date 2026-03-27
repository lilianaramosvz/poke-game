import admin from "firebase-admin";

export async function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // contiene uid, email, etc.
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}