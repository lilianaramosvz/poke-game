import { Router } from "express";
import { bucket } from "../index.js";
import { verificarToken } from "../middleware/auth.js";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST — subir archivo
router.post("/subir", verificarToken, upload.single("archivo"), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const ruta = `uploads/${req.user.uid}/${Date.now()}_${originalname}`;
    const file = bucket.file(ruta);

    await file.save(buffer, { contentType: mimetype });
    await file.makePublic();

    const url = `https://storage.googleapis.com/${bucket.name}/${ruta}`;
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;