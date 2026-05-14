export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  url: string;
  permalink: string;
  thumbnail: string;
  is_video: boolean;
  post_hint?: string;
  selftext?: string;
  preview?: {
    images: {
      source: {
        url: string;
      };
    }[];
  };
}

export interface RedditResponse {
  kind: string;
  data: {
    after: string | null;
    children: {
      kind: string;
      data: RedditPost;
    }[];
  };
}

export const CATEGORIES = [
  { id: "all", name: "Trending Now", subreddits: ["all"] },
  { id: "sports", name: "Sports", subreddits: ["sports", "nba", "soccer", "nfl", "formula1"] },
  { id: "politics", name: "Politics", subreddits: ["politics", "worldnews", "geopolitics"] },
  { id: "movies", name: "Movies & TV", subreddits: ["movies", "television", "boxoffice"] },
  { id: "music", name: "Music", subreddits: ["music", "hiphopheads", "popheads"] },
  { id: "entertainment", name: "Entertainment", subreddits: ["entertainment", "celebritynews"] },
  { id: "technology", name: "Technology", subreddits: ["technology", "programming", "artificial"] },
  { id: "gaming", name: "Gaming", subreddits: ["gaming", "pcgaming", "playstation"] },
  { id: "memes", name: "Memes", subreddits: ["memes", "dankmemes"] },
  { id: "business", name: "Business", subreddits: ["business", "stocks", "entrepreneur"] },
  { id: "crypto", name: "Crypto", subreddits: ["cryptocurrency", "bitcoin"] },
  { id: "lifestyle", name: "Lifestyle", subreddits: ["lifestyle", "fashion", "travel"] },
  { id: "worldnews", name: "World News", subreddits: ["worldnews", "news"] },
  { id: "anime", name: "Anime & Comics", subreddits: ["anime", "manga", "comicbooks"] },
];

export function getCategoryOrSubreddit(id: string) {
  const category = CATEGORIES.find((c) => c.id === id);
  if (category) return category;
  
  return {
    id,
    name: id.length > 20 ? id.slice(0, 20) + "..." : id.charAt(0).toUpperCase() + id.slice(1),
    subreddits: [id]
  };
}

export async function fetchRedditPosts(
  subreddit: string,
  sort: string = "hot",
  after: string | null = null,
  limit: number = 25
): Promise<{ posts: RedditPost[]; after: string | null }> {
  const cleanSub = subreddit.trim().startsWith("r/") ? subreddit.trim().slice(2) : subreddit.trim();
  const url = `/api/reddit?sub=${cleanSub || "all"}&sort=${sort}&limit=${limit}${after ? `&after=${after}` : ""}`;
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
      // Fallback to frontpage if specific subreddit fails
      if (cleanSub !== "all" && response.status !== 429) {
         return fetchRedditPosts("all", sort, after, limit);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RedditResponse = await response.json();
    
    if (!data.data || !data.data.children) {
      return { posts: [], after: null };
    }

    return {
      posts: data.data.children.map((child) => child.data),
      after: data.data.after,
    };
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    return { posts: [], after: null };
  }
}
