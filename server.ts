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
    
    const tryFetch = async (domain: string, ua: string) => {
      const url = `https://${domain}/r/${cleanSub}/${cleanSort}.json?limit=${limit || 25}${after ? `&after=${after}` : ""}&raw_json=1`;
      console.log(`[Reddit Proxy] Fetching: ${url} with UA: ${ua.slice(0, 30)}...`);
      return fetch(url, {
        headers: {
          "User-Agent": ua,
          "Accept": "application/json",
          "Cache-Control": "no-cache"
        }
      });
    };

    try {
      const uas = [
        "web:reddified-aggregator:v1.0.0 (by /u/uaefreelancer2014)",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "PostmanRuntime/7.37.0"
      ];
      
      const domains = ["www.reddit.com", "old.reddit.com"];
      
      let lastResponse: Response | null = null;
      
      for (const domain of domains) {
        for (const ua of uas) {
          const response = await tryFetch(domain, ua);
          if (response.ok) {
            const data = await response.json();
            return res.json(data);
          }
          lastResponse = response;
          // If we got a 404, forget it, it won't work on other domains
          if (response.status === 404) break;
          // Wait a bit before retry to avoid hammering
          await new Promise(r => setTimeout(r, 100));
        }
      }

      const errorText = lastResponse ? await lastResponse.text() : "No response";
      console.error(`[Reddit Proxy] All attempts failed. Last status: ${lastResponse?.status}`);
      return res.status(lastResponse?.status || 500).json({ 
        error: `Reddit API returned ${lastResponse?.status}`,
        details: errorText.slice(0, 150)
      });
      
    } catch (error) {
      console.error("[Reddit Proxy] Fatal Error:", error);
      res.status(500).json({ error: "Failed to fetch from Reddit", details: error instanceof Error ? error.message : "Unknown error" });
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
