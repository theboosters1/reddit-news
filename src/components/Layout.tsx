import { Navbar } from "./Navbar";
import { TrendingTicker } from "./TrendingTicker";
import { Helmet } from "react-helmet-async";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function Layout({ children, title = "Reddified | Modern Reddit Aggregator", description = "Lightweight, high-speed Reddit feed aggregator with trending content from all niches." }: LayoutProps) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <TrendingTicker />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-12 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-xl">
                    R
                  </div>
                  <span className="font-bold text-xl tracking-tight">Reddified</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs mb-4">
                  The fastest way to stay updated with what's happening on Reddit. Organized, categorized, and ultra-lightweight.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="font-bold text-sm mb-2">Categories</h5>
                <a href="#" className="text-sm text-zinc-500 hover:text-orange-600">Sports</a>
                <a href="#" className="text-sm text-zinc-500 hover:text-orange-600">Politics</a>
                <a href="#" className="text-sm text-zinc-500 hover:text-orange-600">Tech</a>
                <a href="#" className="text-sm text-zinc-500 hover:text-orange-600">Gaming</a>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="font-bold text-sm mb-2">Support</h5>
                <a href="#" className="text-sm text-zinc-500 hover:text-orange-600">Contact Us</a>
                <a href="#" className="text-sm text-zinc-500 hover:text-orange-600">FAQ</a>
                <a href="#" className="text-sm text-zinc-500 hover:text-orange-600">Help Center</a>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="font-bold text-sm mb-2">Legal</h5>
                <a href="#" className="text-sm text-zinc-500 hover:text-orange-600">Privacy Policy</a>
                <a href="#" className="text-sm text-zinc-500 hover:text-orange-600">Terms of Service</a>
                <a href="#" className="text-sm text-zinc-500 hover:text-orange-600">Cookie Policy</a>
              </div>
            </div>
            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
              © 2026 Reddified Aggregator. Not affiliated with Reddit Inc.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
