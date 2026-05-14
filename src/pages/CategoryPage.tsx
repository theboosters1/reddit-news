import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/src/components/Layout";
import { fetchRedditPosts, CATEGORIES, RedditPost } from "@/src/services/reddit";
import { PostCard } from "@/src/components/PostCard";
import { Sidebar } from "@/src/components/Sidebar";
import { Loader2, Filter } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function CategoryPage() {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "hot";

  const category = CATEGORIES.find((c) => c.id === categoryId);
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

  if (!category) return <Layout>Category not found</Layout>;

  return (
    <Layout title={`${category.name} | Reddified Feed`} description={`Browse the latest ${category.name} updates from Reddit.`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 min-w-0">
            <header className="mb-8 p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <h1 className="text-4xl font-black mb-2">{category.name}</h1>
                 <p className="text-zinc-400 text-lg">Trending discussions from {category.subreddits.map(s => `r/${s}`).join(", ")}</p>
                 
                 <div className="flex items-center gap-4 mt-8">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-300">
                      <Filter className="h-3 w-3" />
                      Sort by:
                    </div>
                    {["hot", "new", "top", "rising"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSearchParams({ sort: s })}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-bold transition-all",
                          sort === s 
                            ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                            : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                        )}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                 </div>
               </div>
               <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-orange-600/20 to-transparent pointer-events-none" />
            </header>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {posts.map((post, index) => (
                  <div key={`${post.id}-${index}`} ref={index === posts.length - 1 ? lastPostElementRef : null}>
                    <PostCard post={post} />
                  </div>
                ))}
                
                {loadingMore && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                  </div>
                )}
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </div>
    </Layout>
  );
}
