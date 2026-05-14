import React, { createContext, useContext, useState, useEffect } from "react";
import { RedditPost } from "@/src/services/reddit";

interface SavedPostsContextType {
  savedPosts: string[];
  toggleSave: (post: RedditPost) => void;
  isSaved: (postId: string) => boolean;
}

const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

export function SavedPostsProvider({ children }: { children: React.ReactNode }) {
  const [savedPosts, setSavedPosts] = useState<string[]>(() => {
    const saved = localStorage.getItem("saved_posts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("saved_posts", JSON.stringify(savedPosts));
  }, [savedPosts]);

  const toggleSave = (post: RedditPost) => {
    setSavedPosts((prev) => {
      const isBookmarked = prev.includes(post.id);
      const newSaved = isBookmarked ? prev.filter((id) => id !== post.id) : [...prev, post.id];
      
      // Sync post data
      const storedData = localStorage.getItem("saved_posts_data");
      const currentData: RedditPost[] = storedData ? JSON.parse(storedData) : [];
      
      if (isBookmarked) {
        localStorage.setItem("saved_posts_data", JSON.stringify(currentData.filter(p => p.id !== post.id)));
      } else {
        localStorage.setItem("saved_posts_data", JSON.stringify([...currentData, post]));
      }
      
      return newSaved;
    });
  };

  const isSaved = (postId: string) => savedPosts.includes(postId);

  return (
    <SavedPostsContext.Provider value={{ savedPosts, toggleSave, isSaved }}>
      {children}
    </SavedPostsContext.Provider>
  );
}

export function useSavedPosts() {
  const context = useContext(SavedPostsContext);
  if (context === undefined) {
    throw new Error("useSavedPosts must be used within a SavedPostsProvider");
  }
  return context;
}
