import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { fetchRedditPosts } from "@/src/services/reddit";

export function TrendingTicker() {
  const [trending, setTrending] = useState<string[]>([]);

  useEffect(() => {
    fetchRedditPosts("all", "rising", null, 10).then(({ posts }) => {
      setTrending(posts.map(p => p.title.slice(0, 50) + "..."));
    });
  }, []);

  if (trending.length === 0) return null;

  return (
    <div className="bg-reddit-surface h-8 flex items-center border-b border-reddit-border overflow-hidden">
      <div className="container mx-auto px-6 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-reddit-text-main font-bold text-[12px] uppercase tracking-wider shrink-0 overflow-hidden">
          <div className="h-1.5 w-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span>Trending:</span>
        </div>
        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {trending.concat(trending).map((title, i) => (
            <span key={i} className="text-reddit-text-sub text-[11px] font-bold hover:text-reddit-orange cursor-pointer transition-colors">
              {title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
