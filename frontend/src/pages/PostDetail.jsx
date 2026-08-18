import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getPostBySlug } from "../api/posts.api";
import LikeButton from "../components/post/LikeButton";
import CommentSection from "../components/comment/CommentSection";
import Loader from "../components/common/Loader";
import { formatDate } from "../utils/formatDate";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getPostBySlug(slug)
      .then((res) => setPost(res.post))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (error || !post) return <p className="text-center mt-10">Post not found.</p>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
        <Link to={`/profile/${post.author._id}`}>{post.author.username}</Link>
        <span>·</span>
        <span>{formatDate(post.createdAt)}</span>
        {post.category && (
          <>
            <span>·</span>
            <span>{post.category.name}</span>
          </>
        )}
      </div>

      <div
        className="prose max-w-none mb-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <LikeButton postId={post._id} initialCount={post.likesCount} />
      <CommentSection postId={post._id} postAuthorId={post.author._id} />
    </article>
  );
}