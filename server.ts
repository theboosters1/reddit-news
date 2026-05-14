import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Reddit API Proxy to bypass CORS and add proper User-Agent
  app.get("/api/reddit", async (req, res) => {
    const { sub, sort, after, limit } = req.query;
    const cleanSub = String(sub || "all").trim();
    const cleanSort = String(sort || "hot").trim();
    const redditUrl = `https://www.reddit.com/r/${cleanSub}/${cleanSort}.json?limit=${limit || 25}${after ? `&after=${after}` : ""}`;

    try {
      const response = await fetch(redditUrl, {
        headers: {
          "User-Agent": "RedAggregator/1.0.0 (by /u/uaefreelancer2014)"
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: `Reddit API returned ${response.status}` });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Reddit Proxy Error:", error);
      res.status(500).json({ error: "Failed to fetch from Reddit" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production setup
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
