import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CATEGORIES } from "@/src/services/reddit";
import { ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sticky top-20 hidden lg:flex flex-col gap-4 w-[300px] shrink-0">
      <section className="p-4 rounded-[4px] bg-reddit-surface border border-reddit-border">
        <h4 className="text-[12px] font-bold uppercase tracking-widest text-reddit-text-sub mb-4">
          Feeds
        </h4>
        <nav className="flex flex-col gap-1">
          {CATEGORIES.slice(0, 3).map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(cat.id === "all" ? "/" : `/category/${cat.id}`)}
              className={cn(
                "flex items-center gap-3 p-2 rounded-[4px] text-sm font-semibold transition-colors",
                (location.pathname === (cat.id === "all" ? "/" : `/category/${cat.id}`))
                  ? "bg-reddit-sidebox text-reddit-orange border-l-4 border-reddit-orange -ml-4 pl-3"
                  : "hover:bg-reddit-sidebox text-reddit-text-main"
              )}
            >
              <div className="h-6 w-6 rounded-full bg-reddit-sidebox border border-reddit-border flex items-center justify-center text-[10px] text-reddit-text-sub">
                {cat.name.charAt(0)}
              </div>
              <span>{cat.name}</span>
            </button>
          ))}
        </nav>
      </section>

      <section className="p-4 rounded-[4px] bg-reddit-surface border border-reddit-border">
        <h4 className="text-[12px] font-bold uppercase tracking-widest text-reddit-text-sub mb-4">
          Communities
        </h4>
        <nav className="flex flex-col gap-1">
          {CATEGORIES.slice(3, 10).map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              className="flex items-center gap-3 p-2 rounded-[4px] hover:bg-reddit-sidebox text-sm font-medium text-reddit-text-main transition-colors group"
            >
               <div className="h-6 w-6 rounded-full bg-reddit-border" />
              <span>r/{cat.subreddits[0]}</span>
            </button>
          ))}
        </nav>
      </section>

      <div className="p-4 bg-reddit-surface border border-reddit-border rounded-[4px]">
        <h4 className="text-[12px] font-bold uppercase tracking-widest text-reddit-text-sub mb-3">Trending Topics</h4>
        <div className="flex flex-wrap gap-2">
            {["#AI", "#Markets", "#SpaceX", "#Apple", "#Gaming"].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-reddit-sidebox text-[11px] font-semibold text-reddit-text-main border border-reddit-border hover:border-reddit-text-sub cursor-pointer transition-colors">
                    {tag}
                </span>
            ))}
        </div>
      </div>

      <div className="text-[11px] text-reddit-text-sub text-center mt-4">
        <p>Privacy Policy • Terms • Cookie Policy</p>
        <p className="mt-1">© 2026 RedAgg Aggregator</p>
      </div>
    </aside>
  );
}
