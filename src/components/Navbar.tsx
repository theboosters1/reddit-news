import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, TrendingUp, Bookmark } from "lucide-react";
import { CATEGORIES } from "../services/reddit";
import { cn } from "../lib/utils";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      let query = searchQuery.trim().toLowerCase();
      if (query.startsWith("r/")) {
        query = query.slice(2);
      }
      navigate(`/category/${query}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-reddit-border bg-reddit-surface">
      <div className="container mx-auto px-6">
        <div className="flex h-[60px] items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-extrabold text-[#FF4500] text-2xl tracking-tighter">
                RedAgg.
              </span>
            </Link>
            <nav className="hidden lg:flex items-center space-x-1 text-sm font-semibold">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.id === "all" ? "/" : `/category/${cat.id}`}
                  className={cn(
                    "px-4 py-2 rounded-md transition-colors hover:bg-reddit-sidebox",
                    location.pathname === (cat.id === "all" ? "/" : `/category/${cat.id}`)
                      ? "text-reddit-orange"
                      : "text-reddit-text-main"
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-center max-w-lg">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-4 top-2.5 h-4 w-4 text-reddit-text-sub" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all trending subreddits..."
                className="h-10 w-full rounded-full border border-reddit-border bg-reddit-sidebox pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-reddit-orange transition-all"
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/saved"
              className="px-5 py-2 rounded-full border border-reddit-orange text-reddit-orange font-bold text-sm hover:bg-reddit-orange/5 transition-colors hidden sm:block"
            >
              Saved
            </Link>
            <button className="px-5 py-2 rounded-full bg-reddit-orange text-white font-bold text-sm hover:brightness-110 transition-all shadow-sm">
              Get Started
            </button>
            <button className="lg:hidden p-2 rounded-full hover:bg-reddit-sidebox text-reddit-text-sub">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
