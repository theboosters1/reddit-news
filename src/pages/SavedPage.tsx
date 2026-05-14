import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useSavedPosts } from "../contexts/SavedPostsContext";
import { RedditPost } from "../services/reddit";
import { PostCard } from "../components/PostCard";
import { Bookmark, Inbox } from "lucide-react";

export function SavedPage() {
  const { savedPosts } = useSavedPosts();
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      // Since the Reddit API doesn't allow fetching multiple specific IDs easily without auth,
      // and we are doing a lightweight read-only app, we would normally fetch them individually
      // or store the full post object. For this demo, we'll store basic info or fetch from a common source.
      // Better strategy: Store the post object in localStorage when saving.
      
      const stored = localStorage.getItem("saved_posts_data");
      const data = stored ? JSON.parse(stored) : [];
      setPosts(data.filter((p: RedditPost) => savedPosts.includes(p.id)));
      setLoading(false);
    }
    loadSaved();
  }, [savedPosts]);

  return (
    <Layout title="Saved Posts | Reddified" description="Your bookmarked Reddit posts.">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest mb-2">
            <Bookmark className="h-4 w-4" />
            <span>Archive</span>
          </div>
          <h1 className="text-4xl font-black mb-4">Saved Posts</h1>
        </header>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-6">
              <Inbox className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">No saved posts yet</h3>
            <p className="text-zinc-500 max-w-sm">
              Posts you bookmark while browsing will appear here for easy access later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
