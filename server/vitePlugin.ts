import type { Plugin } from "vite";
import { analyzePedagogicalQuestion, RagAnalyzePayload } from "./gemini.js";

export function neuroEduApiPlugin(): Plugin {
  return {
    name: "neuroedu-api-plugin",
    configureServer(server) {
      server.middlewares.use("/api/health", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          status: "ok",
          app: "NeuroEdu",
          geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
          timestamp: new Date().toISOString(),
        }));
      });

      server.middlewares.use("/api/gemini/analyze", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Método não permitido" }));
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", async () => {
          try {
            const payload = JSON.parse(body || "{}") as RagAnalyzePayload;
            if (!payload || !payload.question || typeof payload.question !== "string" || !payload.question.trim()) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "A pergunta do professor é obrigatória." }));
              return;
            }

            const result = await analyzePedagogicalQuestion(payload);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
          } catch (error: any) {
            console.error("API /api/gemini/analyze error:", error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: error?.message || "Ocorreu uma falha no processamento com a IA." }));
          }
        });
      });
    },
  };
}
