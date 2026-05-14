import React from "react";
import { RedditPost } from "../services/reddit";
import { formatNumber, getRelativeTime, cn } from "../lib/utils";
import { ArrowBigUp, MessageSquare, ExternalLink, Bookmark, Share2 } from "lucide-react";
import { useSavedPosts } from "../contexts/SavedPostsContext";
import { motion } from "motion/react";

interface PostCardProps {
  post: RedditPost;
  priority?: boolean;
  key?: React.Key;
}

export function PostCard({ post, priority = false }: PostCardProps) {
  const { toggleSave, isSaved } = useSavedPosts();
  const saved = isSaved(post.id);

  const getThumbnail = () => {
    if (!post.thumbnail) return null;
    if (["self", "default", "nsfw", "image", "spoiler"].includes(post.thumbnail)) return null;
    if (post.thumbnail.startsWith("http")) return post.thumbnail;
    if (post.preview?.images?.[0]?.source?.url) {
      return post.preview.images[0].source.url.replaceAll("&amp;", "&");
    }
    return null;
  };

  const thumbnail = getThumbnail();

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "group flex flex-row gap-0 overflow-hidden rounded-[4px] border border-reddit-border bg-reddit-surface transition-all hover:border-[#898989]",
        priority && "md:col-span-2"
      )}
    >
      <div className="w-[40px] shrink-0 bg-reddit-sidebox/30 flex flex-col items-center py-3 gap-1 font-bold text-reddit-text-main text-xs">
        <ArrowBigUp className="h-5 w-5 text-reddit-text-sub group-hover:text-reddit-orange transition-colors cursor-pointer" />
        <span>{formatNumber(post.score)}</span>
        <ArrowBigUp className="h-5 w-5 rotate-180 text-reddit-text-sub hover:text-blue-500 transition-colors cursor-pointer" />
      </div>

      <div className={cn(
        "flex flex-1 gap-4 p-3 min-w-0 flex-col sm:flex-row",
        priority && "sm:flex-row-reverse"
      )}>
        <div className="flex flex-col flex-1 gap-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-reddit-text-sub">
            <span className="font-bold text-reddit-text-main hover:underline cursor-pointer transition-colors">
              r/{post.subreddit}
            </span>
            <span>•</span>
            <span>Posted by u/{post.author}</span>
            <span>•</span>
            <span>{getRelativeTime(post.created_utc)}</span>
          </div>

          <h3 className={cn(
            "font-semibold leading-snug text-reddit-text-main group-hover:no-underline transition-colors mt-0.5",
            priority ? "text-lg md:text-xl" : "text-base md:text-lg"
          )}>
            <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a>
          </h3>

          {post.selftext && (
            <p className="line-clamp-2 text-xs text-reddit-text-sub mt-1">
              {post.selftext}
            </p>
          )}

          <div className="mt-3 flex items-center gap-4 text-xs font-bold text-reddit-text-sub">
            <div className="flex items-center gap-1.5 hover:bg-reddit-sidebox p-1.5 rounded cursor-pointer transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span>{formatNumber(post.num_comments)} Comments</span>
            </div>
            <div className="flex items-center gap-1.5 hover:bg-reddit-sidebox p-1.5 rounded cursor-pointer transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </div>
            <button
               onClick={(e) => {
                 e.preventDefault();
                 toggleSave(post);
               }}
               className={cn(
                 "flex items-center gap-1.5 hover:bg-reddit-sidebox p-1.5 rounded transition-colors",
                 saved ? "text-reddit-orange" : "text-reddit-text-sub"
               )}
            >
              <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {thumbnail && (
          <div className={cn(
            "relative overflow-hidden rounded-[4px] bg-reddit-sidebox shrink-0 border border-reddit-border/50",
            priority ? "w-full sm:w-[240px] aspect-video" : "w-full sm:w-[140px] h-[95px]"
          )}>
            <img
              src={thumbnail}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {post.is_video && (
              <div className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.5 text-[8px] font-bold text-white uppercase">
                Video
              </div>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
