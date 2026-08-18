import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getComments, addComment, deleteComment } from "../../api/comments.api";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatDate";

export default function CommentSection({ postId, postAuthorId }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getComments(postId)
      .then((res) => setComments(res.comments))
      .catch(() => toast.error("Couldn't load comments"))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await addComment(postId, content.trim());
      setComments((prev) => [res.comment, ...prev]);
      setContent("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    const prev = comments;
    setComments((c) => c.filter((cm) => cm._id !== commentId)); // optimistic
    try {
      await deleteComment(postId, commentId);
    } catch (err) {
      setComments(prev); // rollback
      toast.error("Couldn't delete comment");
    }
  };

  const canDelete = (comment) =>
    user && (user._id === comment.author._id || user._id === postAuthorId || user.role === "admin");

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            placeholder="Add a comment..."
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mb-6">Log in to leave a comment.</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c._id} className="border-b pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{c.author.username}</p>
                  <p className="text-sm text-gray-700">{c.content}</p>
                  <p className="text-xs text-gray-400">{formatDate(c.createdAt)}</p>
                </div>
                {canDelete(c) && (
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-xs text-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}