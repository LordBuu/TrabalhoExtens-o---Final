import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { apiRouter } from "./server/apiRouter.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api", apiRouter);

// Serve static build assets if available
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(path.resolve(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`NeuroEdu server running on port ${PORT}`);
});
