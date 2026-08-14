// src/pages/Home.jsx
import { useEffect, useRef } from "react";
import useInfinitePosts from "../hooks/useInfinitePosts";
import PostCard from "../components/post/PostCard";
import Loader from "../components/common/Loader";

export default function Home() {
  const { posts, loading, loadingMore, hasMore, loadMore } = useInfinitePosts();
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1.0 }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, loadMore]);

  if (loading) return <Loader />;

  if (posts.length === 0) {
    return <div className="p-6 text-center text-gray-500">No posts yet.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 grid gap-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {hasMore && (
        <div ref={sentinelRef} className="py-4 flex justify-center">
          {loadingMore && <Loader />}
        </div>
      )}
    </div>
  );
}