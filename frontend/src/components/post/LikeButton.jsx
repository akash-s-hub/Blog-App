import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { toggleLike, getLikeStatus } from "../../api/likes.api";
import useAuth from "../../hooks/useAuth"

export default function LikeButton({ postId, initialCount = 0 }) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    getLikeStatus(postId)
      .then((res) => setLiked(res.liked))
      .catch(() => { });
  }, [postId, isAuthenticated]);

  const handleClick = async () => {
    if (!isAuthenticated) {
      toast.error("Log in to like posts");
      return;
    }
    if (busy) return; // guard against double-fire from fast clicks

    // optimistic update
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevLiked ? prevCount - 1 : prevCount + 1);
    setBusy(true);

    try {
      const res = await toggleLike(postId);
      setLiked(res.message.includes("unliked") ? false : true);
    } catch (err) {
      // roll back on failure
      setLiked(prevLiked);
      setCount(prevCount);
      toast.error("Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="flex items-center gap-2 text-sm disabled:opacity-50"
    >
      <Heart
        size={20}
        className={liked ? "fill-red-500 text-red-500" : "text-gray-500"}
      />
      <span>{count}</span>
    </button>
  );
}