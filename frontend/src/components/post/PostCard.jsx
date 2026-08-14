import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { formatDate } from "../../utils/formatDate";

export default function PostCard({ post }) {
  // author/category might be a populated object OR just a raw ObjectId string —
  // handle both so this doesn't crash regardless of which endpoint sent it
  // const authorName =
  //   typeof post.author === "object" ? post.author?.username : "Unknown author";
  // const categoryName =
  //   typeof post.category === "object" ? post.category?.name : null;

  const excerpt = post.content?.replace(/<[^>]*>/g, "").slice(0, 140); // strip HTML from Quill content

  return (
    <Link
      to={`/post/${post.slug}`}
      className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        {post.category?.name && (
          <span className="bg-gray-100 px-2 py-0.5 rounded">{post.category?.name}</span>
        )}
        <span>{formatDate(post.createdAt)}</span>
      </div>

      <h2 className="text-lg font-semibold mb-1">{post.title}</h2>
      <p className="text-sm text-gray-600 mb-3">{excerpt}...</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>by {post.author?.username}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Heart size={14} /> {post.likesCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} /> {post.commentsCount}
          </span>
        </div>
      </div>
    </Link>
  );
}