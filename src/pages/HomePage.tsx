import React, { useEffect, useState } from "react";
import { Layout } from "@/src/components/Layout";
import { fetchRedditPosts, CATEGORIES, RedditPost } from "@/src/services/reddit";
import { PostCard } from "@/src/components/PostCard";
import { Sidebar } from "@/src/components/Sidebar";
import { Loader2, TrendingUp, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function HomePage() {
  const [trending, setTrending] = useState<RedditPost[]>([]);
  const [sections, setSections] = useState<{ [key: string]: RedditPost[] }>({});
  const [headlines, setHeadlines] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { posts } = await fetchRedditPosts("all", "hot", null, 10);
      setTrending(posts);

      // Fetch all categories except "all"
      const sectionPromises = CATEGORIES.slice(1).map(async (cat) => {
        const { posts } = await fetchRedditPosts(cat.subreddits[0], "hot", null, 4);
        return { id: cat.id, name: cat.name, posts };
      });

      const results = await Promise.all(sectionPromises);
      
      // Aggregate one headline from each category until we have enough
      const aggregatedHeadlines = results
        .map(res => res.posts[0])
        .filter(p => p !== undefined)
        .slice(0, 12); // Show up to 12 headlines
      setHeadlines(aggregatedHeadlines);

      const sectionData: { [key: string]: RedditPost[] } = {};
      results.forEach((res) => {
        sectionData[res.id] = res.posts;
      });
      setSections(sectionData);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 min-w-0">
            {/* Hero Section */}
            <header className="mb-12">
              <div className="flex items-center gap-2 text-reddit-orange font-bold text-sm uppercase tracking-widest mb-2">
                <TrendingUp className="h-4 w-4" />
                <span>Trending Now</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8">
                Stay Ahead of the <span className="text-reddit-orange">Curve.</span>
              </h1>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-reddit-orange" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trending.slice(0, 1).map((post) => (
                    <PostCard key={post.id} post={post} priority />
                  ))}
                  <div className="grid grid-cols-1 gap-6">
                    {trending.slice(1, 4).map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </header>

            {/* Latest Headlines Section */}
            {!loading && headlines.length > 0 && (
              <section className="mb-16 p-6 bg-reddit-sidebox rounded-[4px] border border-reddit-border">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-reddit-text-sub mb-6 border-b border-reddit-border pb-2">
                  Headlines from across sections
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
                  {headlines.map((post) => {
                    const getThumb = (p: RedditPost) => {
                      if (!p.thumbnail || ["self", "default", "nsfw", "image", "spoiler"].includes(p.thumbnail)) return null;
                      if (p.thumbnail.startsWith("http")) return p.thumbnail;
                      if (p.preview?.images?.[0]?.source?.url) return p.preview.images[0].source.url.replaceAll("&amp;", "&");
                      return null;
                    };
                    const thumb = getThumb(post);
                    
                    return (
                      <div key={post.id} className="flex gap-4 group items-center">
                        {thumb ? (
                          <div className="h-14 w-14 shrink-0 rounded-[4px] overflow-hidden border border-reddit-border bg-reddit-bg">
                            <img 
                              src={thumb} 
                              alt="" 
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="h-14 w-14 shrink-0 rounded-[4px] bg-reddit-bg border border-reddit-border flex items-center justify-center text-reddit-text-sub">
                            <Zap className="h-4 w-4 opacity-20" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-reddit-orange uppercase tracking-wider">r/{post.subreddit}</span>
                          <h4 className="text-sm font-semibold leading-tight text-reddit-text-main hover:text-reddit-orange transition-colors line-clamp-2">
                            <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                              {post.title}
                            </a>
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Dynamic Sections */}
            {CATEGORIES.slice(1).map((cat) => (
              <section key={cat.id} className="mb-16">
                <div className="flex items-center justify-between mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    {cat.id === "technology" ? <Zap className="h-4 w-4 text-blue-500" /> : <Sparkles className="h-4 w-4 text-purple-500" />}
                    <h2 className="text-2xl font-bold tracking-tight">{cat.name}</h2>
                  </div>
                  <Link
                    to={`/category/${cat.id}`}
                    className="text-sm font-bold text-orange-600 hover:underline"
                  >
                    View All
                  </Link>
                </div>

                {loading ? (
                  <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-64 w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {(sections[cat.id] || []).map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          <Sidebar />
        </div>
      </div>
    </Layout>
  );
}
