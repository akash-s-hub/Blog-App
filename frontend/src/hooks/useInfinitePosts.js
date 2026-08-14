import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { getPosts } from "../api/posts.api";

export default function useInfinitePosts() {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true); // initial load
  const [loadingMore, setLoadingMore] = useState(false); // subsequent loads

  const isFirstLoad = useRef(true);

  const loadPosts = useCallback(async () => {
    if (loadingMore || !hasMore) return; // guard against double-fires (StrictMode, fast scroll)

    isFirstLoad.current ? setLoading(true) : setLoadingMore(true);

    try {
      const res = await getPosts({ limit: 10, cursor: cursor || undefined });
      setPosts((prev) => [...prev, ...res.posts]);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFirstLoad.current = false;
    }
  }, [cursor, hasMore, loadingMore]);

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only run once on mount — loadPosts is called manually afterward via loadMore

  return { posts, loading, loadingMore, hasMore, loadMore: loadPosts };
}