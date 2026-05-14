import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { fetchRedditPosts, CATEGORIES, RedditPost, getCategoryOrSubreddit } from "../services/reddit";
import { PostCard } from "../components/PostCard";
import { Sidebar } from "../components/Sidebar";
import { Loader2, Filter, Compass } from "lucide-react";
import { cn } from "../lib/utils";

export function CategoryPage() {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "hot";

  const category = getCategoryOrSubreddit(categoryId || "all");
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observer = useRef<IntersectionObserver | undefined>(undefined);
  const lastPostElementRef = useCallback((node: any) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && after) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, after]);

  useEffect(() => {
    async function loadData() {
      if (!category) return;
      setLoading(true);
      const { posts: initialPosts, after: nextAfter } = await fetchRedditPosts(
        category.subreddits[0],
        sort,
        null,
        25
      );
      setPosts(initialPosts);
      setAfter(nextAfter);
      setLoading(false);
    }
    loadData();
  }, [categoryId, sort, category]);

  async function loadMore() {
    if (!category || !after || loadingMore) return;
    setLoadingMore(true);
    const { posts: newPosts, after: nextAfter } = await fetchRedditPosts(
      category.subreddits[0],
      sort,
      after,
      25
    );
    setPosts(prev => [...prev, ...newPosts]);
    setAfter(nextAfter);
    setLoadingMore(false);
  }

  return (
    <Layout title={`${category.name} | Reddified Feed`} description={`Browse the latest ${category.name} updates from Reddit.`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 min-w-0">
            <header className="mb-8 p-6 rounded-[4px] bg-reddit-surface border border-reddit-border text-reddit-text-main relative overflow-hidden">
               <div className="relative z-10">
                 <h1 className="text-3xl font-black mb-1">{category.name}</h1>
                 <p className="text-reddit-text-sub text-sm">Trending discussions from {category.subreddits.map(s => `r/${s}`).join(", ")}</p>
                 
                 <div className="flex flex-wrap items-center gap-3 mt-6">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-reddit-bg text-[10px] font-bold uppercase tracking-widest text-reddit-text-sub border border-reddit-border">
                      <Filter className="h-3 w-3" />
                      Sort by
                    </div>
                    {["hot", "new", "top", "rising"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSearchParams({ sort: s })}
                        className={cn(
                          "px-4 py-1 rounded-full text-xs font-bold transition-all border",
                          sort === s 
                            ? "bg-reddit-orange text-white border-reddit-orange shadow-sm" 
                            : "bg-reddit-sidebox text-reddit-text-sub border-reddit-border hover:border-reddit-text-main"
                        )}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                 </div>
               </div>
               <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-reddit-orange/5 to-transparent pointer-events-none" />
            </header>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-reddit-orange" />
              </div>
            ) : posts.length > 0 ? (
              <div className="flex flex-col gap-4">
                {posts.map((post, index) => (
                  <div key={`${post.id}-${index}`} ref={index === posts.length - 1 ? lastPostElementRef : null}>
                    <PostCard post={post} />
                  </div>
                ))}
                
                {loadingMore && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-reddit-orange" />
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center bg-reddit-surface border border-reddit-border rounded-[4px]">
                <Compass className="h-12 w-12 text-reddit-text-sub mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-2">No posts found</h3>
                <p className="text-reddit-text-sub max-w-sm mx-auto">
                  We couldn't find any posts in this category. The subreddits might be private or temporarily restricted.
                </p>
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </div>
    </Layout>
  );
}
