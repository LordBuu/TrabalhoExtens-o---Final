import express, { Request, Response } from "express";
import { analyzePedagogicalQuestion, RagAnalyzePayload } from "./gemini.js";

export const apiRouter = express.Router();

apiRouter.use(express.json({ limit: "5mb" }));

apiRouter.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "NeuroEdu",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

apiRouter.post("/gemini/analyze", async (req: Request, res: Response) => {
  try {
    const payload = req.body as RagAnalyzePayload;
    if (!payload || !payload.question || typeof payload.question !== "string" || !payload.question.trim()) {
      return res.status(400).json({ error: "A pergunta do professor é obrigatória." });
    }

    // Call server-side Gemini service with RAG retrieved sources
    const result = await analyzePedagogicalQuestion(payload);
    return res.json(result);
  } catch (error: any) {
    console.error("API /api/gemini/analyze error:", error);
    const message = error?.message || "Ocorreu uma falha no processamento com a IA.";
    return res.status(500).json({ error: message });
  }
});
